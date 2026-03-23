# app/routers/teachers.py

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.db.supabase import get_db

router = APIRouter()


# ── GET TEACHER PROFILE ───────────────────────────────────────────────────────
@router.get("/teachers/{teacher_id}")
async def get_teacher_profile(teacher_id: str):
    """
    Get a teacher's full profile.
    Used by: Student dashboard adviser link → profile modal.
    Example: GET /api/teachers/TCH-0018
    """
    db = get_db()

    response = (
        db.table("teachers")
        .select("*")
        .eq("teacher_id", teacher_id)
        .single()
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail=f"Teacher {teacher_id} not found"
        )

    return response.data


# ── GET TEACHER'S CLASS ROSTER ────────────────────────────────────────────────
@router.get("/teachers/{teacher_id}/roster")
async def get_class_roster(
    teacher_id: str,
    risk: Optional[str] = Query(None, description="Filter by risk: high, medium, low, none"),
    search: Optional[str] = Query(None, description="Search by student name")
):
    """
    Get all students in a teacher's section.
    Used by: Teacher dashboard Roster tab.
    Example: GET /api/teachers/TCH-0018/roster?risk=high
    """
    db = get_db()

    # First get the teacher to find their section
    teacher_resp = (
        db.table("teachers")
        .select("section")
        .eq("teacher_id", teacher_id)
        .single()
        .execute()
    )

    if not teacher_resp.data:
        raise HTTPException(status_code=404, detail="Teacher not found")

    # Get all students advised by this teacher
    query = (
        db.table("students")
        .select("*, attendance_summary(*)")
        .eq("adviser_id", teacher_id)
    )

    if risk:
        query = query.eq("risk_level", risk)

    response = query.execute()
    students = response.data or []

    # Filter by name search if provided
    if search:
        search_lower = search.lower()
        students = [
            s for s in students
            if search_lower in s["name"].lower()
        ]

    return {
        "teacher_id": teacher_id,
        "section":    teacher_resp.data["section"],
        "count":      len(students),
        "students":   students
    }


# ── GET CLASS STATS ───────────────────────────────────────────────────────────
@router.get("/teachers/{teacher_id}/stats")
async def get_class_stats(teacher_id: str):
    """
    Get class-wide statistics for the teacher overview dashboard.
    Used by: Teacher dashboard Overview tab stat cards.
    """
    db = get_db()

    students_resp = (
        db.table("students")
        .select("gwa, risk_level, attendance_summary(attendance_rate)")
        .eq("adviser_id", teacher_id)
        .execute()
    )

    students = students_resp.data or []

    if not students:
        return {
            "total":      0,
            "passing":    0,
            "at_risk":    0,
            "avg_gwa":    0,
            "attendance": 0,
            "perfect":    0,
        }

    total     = len(students)
    passing   = sum(1 for s in students if s["gwa"] >= 75)
    at_risk   = sum(1 for s in students if s["risk_level"] in ["high", "medium"])
    perfect   = sum(1 for s in students if s["gwa"] >= 95)
    avg_gwa   = round(sum(s["gwa"] for s in students) / total, 1)

    att_rates = [
        s["attendance_summary"]["attendance_rate"]
        for s in students
        if s.get("attendance_summary")
    ]
    avg_att = round(sum(att_rates) / len(att_rates), 1) if att_rates else 0

    return {
        "total":      total,
        "passing":    passing,
        "at_risk":    at_risk,
        "avg_gwa":    avg_gwa,
        "attendance": avg_att,
        "perfect":    perfect,
    }


# ── POST TEACHER OBSERVATION ──────────────────────────────────────────────────
@router.post("/teachers/{teacher_id}/observations")
async def save_observation(
    teacher_id: str,
    student_id: str,
    observation: str
):
    """
    Save a teacher's observation note for a student.
    Used by: Teacher dashboard student drawer → Save Observation button.
    """
    db = get_db()

    response = (
        db.table("teacher_observations")
        .insert({
            "teacher_id":  teacher_id,
            "student_id":  student_id,
            "observation": observation,
        })
        .execute()
    )

    return {
        "message":    "Observation saved",
        "student_id": student_id,
        "data":       response.data[0] if response.data else {}
    }


# ── GET LEARNING GAPS ─────────────────────────────────────────────────────────
@router.get("/teachers/{teacher_id}/gaps")
async def get_learning_gaps(teacher_id: str):
    """
    Get class-wide MELC learning gaps.
    Used by: Teacher dashboard Learning Gaps tab.
    """
    db = get_db()

    # Get all grades for students in this teacher's section
    students_resp = (
        db.table("students")
        .select("student_id")
        .eq("adviser_id", teacher_id)
        .execute()
    )

    if not students_resp.data:
        return {"gaps": []}

    student_ids = [s["student_id"] for s in students_resp.data]
    total_students = len(student_ids)

    # Get all Q3 grades for these students
    grades_resp = (
        db.table("student_grades")
        .select("subject_name, subject_code, melc_competency, q3_score")
        .in_("student_id", student_ids)
        .eq("quarter", "Q3")
        .execute()
    )

    grades = grades_resp.data or []

    # Group by subject and count how many students are below 75
    from collections import defaultdict
    subject_data = defaultdict(lambda: {"below": 0, "total": 0, "melc": "", "code": ""})

    for g in grades:
        subj = g["subject_name"]
        subject_data[subj]["total"] += 1
        subject_data[subj]["melc"]   = g.get("melc_competency", "")
        subject_data[subj]["code"]   = g.get("subject_code", "")
        if g.get("q3_score") and g["q3_score"] < 75:
            subject_data[subj]["below"] += 1

    # Build gap list — only subjects where >20% are below threshold
    gaps = []
    for subj, data in subject_data.items():
        if data["total"] == 0:
            continue
        pct = round((data["below"] / total_students) * 100)
        if pct > 20:
            if pct >= 60:
                severity = "high"
            elif pct >= 35:
                severity = "medium"
            else:
                severity = "low"

            gaps.append({
                "competency": data["melc"] or subj,
                "code":       data["code"],
                "subject":    subj,
                "affected":   data["below"],
                "pct":        pct,
                "severity":   severity,
            })

    # Sort by percentage descending
    gaps.sort(key=lambda x: x["pct"], reverse=True)

    return {
        "teacher_id":     teacher_id,
        "total_students": total_students,
        "gaps":           gaps
    }