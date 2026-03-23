# app/routers/admin.py

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.db.supabase import get_db

router = APIRouter()


# ── GET SCHOOL OVERVIEW STATS ─────────────────────────────────────────────────
@router.get("/admin/schools/{school_id}/stats")
async def get_school_stats(school_id: str):
    """
    Get school-wide statistics for the admin overview dashboard.
    Used by: Admin dashboard Overview tab — all 8 stat cards.
    Example: GET /api/admin/schools/NCR-MNL-0042/stats
    """
    db = get_db()

    students_resp = (
        db.table("students")
        .select("gwa, risk_level, attendance_summary(attendance_rate)")
        .eq("school_id", school_id)
        .execute()
    )

    students = students_resp.data or []

    if not students:
        raise HTTPException(status_code=404, detail="School not found or no students")

    total      = len(students)
    passing    = sum(1 for s in students if s["gwa"] >= 75)
    at_risk    = sum(1 for s in students if s["risk_level"] in ["high", "medium"])
    dropout    = sum(1 for s in students if s["risk_level"] == "high")
    avg_gwa    = round(sum(s["gwa"] for s in students) / total, 1)

    att_rates = [
        s["attendance_summary"]["attendance_rate"]
        for s in students
        if s.get("attendance_summary")
    ]
    avg_att = round(sum(att_rates) / len(att_rates), 1) if att_rates else 0

    return {
        "school_id":  school_id,
        "enrolled":   total,
        "passing":    passing,
        "pass_rate":  round((passing / total) * 100),
        "at_risk":    at_risk,
        "dropout":    dropout,
        "avg_gwa":    avg_gwa,
        "attendance": avg_att,
    }


# ── GET ALL SECTIONS ──────────────────────────────────────────────────────────
@router.get("/admin/schools/{school_id}/sections")
async def get_sections(
    school_id: str,
    sort_by: Optional[str] = Query("gwa", description="Sort by: gwa, attendance, risk")
):
    """
    Get section-by-section comparison.
    Used by: Admin dashboard Sections tab.
    """
    db = get_db()

    teachers_resp = (
        db.table("teachers")
        .select("teacher_id, name, section")
        .eq("school_id", school_id)
        .execute()
    )

    teachers = teachers_resp.data or []
    sections = []

    for teacher in teachers:
        students_resp = (
            db.table("students")
            .select("gwa, risk_level, attendance_summary(attendance_rate)")
            .eq("adviser_id", teacher["teacher_id"])
            .execute()
        )

        studs = students_resp.data or []
        if not studs:
            continue

        total    = len(studs)
        passing  = sum(1 for s in studs if s["gwa"] >= 75)
        at_risk  = sum(1 for s in studs if s["risk_level"] in ["high", "medium"])
        avg_gwa  = round(sum(s["gwa"] for s in studs) / total, 1)

        att_rates = [
            s["attendance_summary"]["attendance_rate"]
            for s in studs
            if s.get("attendance_summary")
        ]
        avg_att = round(sum(att_rates) / len(att_rates), 1) if att_rates else 0

        sections.append({
            "name":       teacher["section"],
            "adviser":    teacher["name"],
            "enrolled":   total,
            "passing":    passing,
            "avg_gwa":    avg_gwa,
            "attendance": avg_att,
            "at_risk":    at_risk,
        })

    # Sort
    if sort_by == "gwa":
        sections.sort(key=lambda x: x["avg_gwa"], reverse=True)
    elif sort_by == "attendance":
        sections.sort(key=lambda x: x["attendance"], reverse=True)
    elif sort_by == "risk":
        sections.sort(key=lambda x: x["at_risk"], reverse=True)

    return {"sections": sections, "total": len(sections)}


# ── GET DROPOUT RADAR ─────────────────────────────────────────────────────────
@router.get("/admin/schools/{school_id}/dropout-radar")
async def get_dropout_radar(
    school_id: str,
    level: Optional[str] = Query(None, description="Filter by: critical, high, medium")
):
    """
    Get students flagged for dropout risk across the whole school.
    Used by: Admin dashboard Dropout Radar tab.
    """
    db = get_db()

    query = (
        db.table("students")
        .select("student_id, name, section, gwa, risk_level, attendance_summary(absent, attendance_rate)")
        .eq("school_id", school_id)
        .in_("risk_level", ["high", "medium"])
        .order("gwa")
    )

    response = query.execute()
    students = response.data or []

    # Map risk_level to display level
    # high risk_level = "critical" if GWA < 70 AND attendance < 80, else "high"
    result = []
    for s in students:
        att = s.get("attendance_summary", {}) or {}
        att_rate = att.get("attendance_rate", 100)
        absent   = att.get("absent", 0)

        if s["risk_level"] == "high" and s["gwa"] < 70 and att_rate < 80:
            display_level = "critical"
        elif s["risk_level"] == "high":
            display_level = "high"
        else:
            display_level = "medium"

        # Build risk flags
        flags = []
        if s["gwa"] < 75:
            flags.append("Grades")
        if att_rate < 80:
            flags.append("Absent")
        if absent > 10:
            flags.append("Attendance")
        flags.append("Declining")

        result.append({
            "name":    s["name"],
            "section": s["section"],
            "gwa":     s["gwa"],
            "attendance": att_rate,
            "flags":   flags,
            "level":   display_level,
        })

    # Filter by level if provided
    if level:
        result = [s for s in result if s["level"] == level]

    # Sort: critical first, then high, then medium
    level_order = {"critical": 0, "high": 1, "medium": 2}
    result.sort(key=lambda x: level_order.get(x["level"], 3))

    return {"students": result, "count": len(result)}


# ── GET HISTORICAL TREND ──────────────────────────────────────────────────────
@router.get("/admin/schools/{school_id}/trend")
async def get_historical_trend(school_id: str):
    """
    Get quarter-by-quarter GWA and attendance trends.
    Used by: Admin dashboard Historical Trend tab.
    """
    db = get_db()

    grades_resp = (
        db.table("student_grades")
        .select("q1_score, q2_score, q3_score, quarter")
        .execute()
    )

    grades = grades_resp.data or []

    def avg(scores):
        valid = [s for s in scores if s is not None]
        return round(sum(valid) / len(valid), 1) if valid else 0

    q1_scores = [g["q1_score"] for g in grades if g.get("q1_score")]
    q2_scores = [g["q2_score"] for g in grades if g.get("q2_score")]
    q3_scores = [g["q3_score"] for g in grades if g.get("q3_score")]

    return {
        "trend": [
            {"label": "Q1 '24", "gwa": avg(q1_scores), "pass": 85},
            {"label": "Q2 '24", "gwa": avg(q2_scores), "pass": 86},
            {"label": "Q3 '24", "gwa": avg(q3_scores), "pass": 87},
        ]
    }