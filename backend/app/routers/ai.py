# app/routers/ai.py

import os
import json
from datetime import datetime
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import anthropic
from app.db.supabase import get_db

router = APIRouter()
claude = anthropic.Anthropic()


# ── SCHEMAS ───────────────────────────────────────────────────────────────────

class ReportRequest(BaseModel):
    school_name:      str
    quarter:          str
    total_students:   int
    passing_students: int
    avg_gwa:          float
    attendance_rate:  float
    at_risk_count:    int
    dropout_risk:     int
    top_section:      str
    lowest_section:   str

class NLQueryRequest(BaseModel):
    query:      str
    teacher_id: str
    section:    str


# ── AI REPORT GENERATION ──────────────────────────────────────────────────────
@router.post("/ai/report")
async def generate_school_report(request: ReportRequest):
    """
    Generate monthly school health narrative using Claude.
    Used by: Admin AI Report tab — principal clicks Generate Report.
    """
    pass_rate = round((request.passing_students / request.total_students) * 100)

    prompt = f"""You are Husai, an AI school intelligence platform for Philippine public schools.

Write a professional monthly school health narrative for a DepEd principal.
Format: 3 paragraphs.
  Paragraph 1: overall performance summary.
  Paragraph 2: areas of concern with specific details.
  Paragraph 3: recommended immediate actions.
Be specific, evidence-based, and flag urgent issues first. Write in formal English.

School Data for {request.school_name} — {request.quarter}:
- Total enrolled: {request.total_students} students
- Passing rate: {pass_rate}% ({request.passing_students} students)
- School GWA: {request.avg_gwa}
- Attendance rate: {request.attendance_rate}%
- At-risk students: {request.at_risk_count}
- Critical dropout risk: {request.dropout_risk}
- Top performing section: {request.top_section}
- Section needing support: {request.lowest_section}

Generate the narrative now:"""

    try:
        message = claude.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=800,
            messages=[{"role": "user", "content": prompt}]
        )

        return {
            "narrative":    message.content[0].text,
            "quarter":      request.quarter,
            "school":       request.school_name,
            "generated_at": datetime.utcnow().isoformat(),
            "model":        "claude-sonnet-4-6"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Claude API error: {str(e)}")


# ── NATURAL LANGUAGE QUERY ────────────────────────────────────────────────────
@router.post("/ai/query")
async def natural_language_query(request: NLQueryRequest):
    """
    Translate teacher's plain English question into a database query.
    Student data is NEVER sent to Claude — only schema and intent.
    Used by: Teacher NL query bar.
    """
    db = get_db()

    schema_description = f"""
    Available data for section {request.section}:
    - students: name, grade, section, gwa, risk_level
    - attendance: absent_count, late_count, attendance_rate
    - grades: subject_name, q1, q2, q3, trend
    """

    interpretation_prompt = f"""You are a query interpreter for a Philippine school database.
A teacher asked: "{request.query}"

{schema_description}

Respond ONLY with a JSON object (no explanation, no markdown):
{{
  "filter_type": "attendance",
  "conditions": {{
    "absent_count_gte": 5
  }},
  "explanation": "Students with more than 5 absences"
}}"""

    try:
        response = claude.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=200,
            messages=[{"role": "user", "content": interpretation_prompt}]
        )

        filter_spec = json.loads(response.content[0].text)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Query interpretation failed: {str(e)}"
        )

    # Query the database using the filter spec
    # Student data stays on your server — never touched by Claude
    query = (
        db.table("students")
        .select("*, attendance_summary(absent, late, attendance_rate)")
        .eq("section", request.section)
    )

    conditions = filter_spec.get("conditions", {})

    if "risk_level" in conditions:
        query = query.eq("risk_level", conditions["risk_level"])

    if "gwa_lt" in conditions:
        query = query.lt("gwa", conditions["gwa_lt"])

    result = query.execute()

    students = result.data or []

    if "absent_count_gte" in conditions:
        threshold = conditions["absent_count_gte"]
        students = [
            s for s in students
            if s.get("attendance_summary")
            and s["attendance_summary"].get("absent", 0) >= threshold
        ]

    return {
        "query":       request.query,
        "explanation": filter_spec.get("explanation", ""),
        "count":       len(students),
        "students":    students
    }


# ── STUDENT INSIGHT GENERATION ────────────────────────────────────────────────
@router.post("/ai/insights/generate/{student_id}")
async def generate_student_insights(
    student_id: str,
    background_tasks: BackgroundTasks
):
    """
    Queue insight generation for one student.
    Called by nightly cron job — NOT by the React frontend directly.
    """
    background_tasks.add_task(_generate_insights_task, student_id)

    return {
        "message":    "Insight generation queued",
        "student_id": student_id,
        "status":     "processing"
    }


async def _generate_insights_task(student_id: str):
    """Runs in background after the response is sent."""
    db = get_db()

    student_resp = (
        db.table("students")
        .select("*, student_grades(*), attendance_summary(*)")
        .eq("student_id", student_id)
        .single()
        .execute()
    )

    if not student_resp.data:
        return

    student    = student_resp.data
    grades     = student.get("student_grades", [])
    attendance = student.get("attendance_summary", {})

    from app.models.at_risk import predict_risk
    risk_result = predict_risk(student, grades, attendance)

    subject_summary = ", ".join([
        f"{g['subject_name']}: {g.get('q3_score', 'N/A')}"
        for g in grades[:5]
    ])

    prompt = f"""Generate 3 short, actionable insights for a Filipino elementary student.
Each insight should be 1-2 sentences. Be specific and helpful.

Data:
- GWA: {student['gwa']}
- Attendance rate: {attendance.get('attendance_rate', 'N/A')}%
- At-risk level: {risk_result['risk_level']}
- Recent grades: {subject_summary}
- Trend: {risk_result['trend']}

Respond ONLY with a JSON array, no markdown:
[
  {{"type": "warn", "message": "insight here"}},
  {{"type": "ok",   "message": "insight here"}},
  {{"type": "info", "message": "insight here"}}
]"""

    try:
        response = claude.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=400,
            messages=[{"role": "user", "content": prompt}]
        )

        insights = json.loads(response.content[0].text)

        # Deactivate old insights
        (
            db.table("insights")
            .update({"is_active": False})
            .eq("student_id", student_id)
            .execute()
        )

        # Insert new ones
        for insight in insights:
            (
                db.table("insights")
                .insert({
                    "student_id":    student_id,
                    "type":          insight["type"],
                    "message":       insight["message"],
                    "quarter":       "Q3",
                    "is_active":     True,
                    "model_version": "claude-sonnet-4-6",
                    "risk_level":    risk_result["risk_level"],
                    "created_at":    datetime.utcnow().isoformat(),
                })
                .execute()
            )

    except Exception as e:
        print(f"Insight generation failed for {student_id}: {e}")


# ── RESUME GENERATION ─────────────────────────────────────────────────────────
@router.post("/ai/resume/{student_id}")
async def generate_resume(student_id: str):
    """
    Generate Harvard-style resume data for a student.
    Used by: Student Profile modal — Generate Resume button.
    """
    db = get_db()

    student = (
        db.table("students")
        .select("*, awards(*), extracurricular(*), student_grades(*)")
        .eq("student_id", student_id)
        .single()
        .execute()
    )

    if not student.data:
        raise HTTPException(status_code=404, detail="Student not found")

    s = student.data

    return {
        "student_id":  student_id,
        "name":        s["name"],
        "resume_data": {
            "education":       [{"school": s.get("school_name", ""), "gwa": s["gwa"]}],
            "awards":          s.get("awards", []),
            "extracurricular": s.get("extracurricular", []),
            "skills":          _derive_skills(s.get("student_grades", [])),
        },
        "status":  "ready",
    }


def _derive_skills(grades: list) -> list:
    """Map MELC grades to skill competency levels."""
    result = []
    for g in grades:
        score = g.get("q3_score") or g.get("q2_score") or 0
        if score >= 90:
            level = "Advanced"
        elif score >= 85:
            level = "Proficient"
        elif score >= 75:
            level = "Developing"
        else:
            level = "Below Proficiency"

        result.append({
            "name":  g.get("melc_competency") or g.get("subject_name"),
            "level": level
        })

    return result

    