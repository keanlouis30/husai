# app/routers/students.py

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.db.supabase import get_db
from app.schemas.student import (
    StudentProfile, StudentListItem, SubjectGrade,
    AttendanceRecord, Insight, StudentCreate
)

router = APIRouter()


# ── GET STUDENT PROFILE ───────────────────────────────────────────────────────
@router.get("/students/{student_id}", response_model=StudentProfile)
async def get_student_profile(student_id: str):
    """
    Get a student's full profile.
    Used by: React StudentDashboard hero section.
    Example: GET /api/students/STU-240142
    """
    db = get_db()

    # Wrap in parentheses instead of backslash continuation
    response = (
        db.table("students")
        .select("*, teachers(name)")
        .eq("student_id", student_id)
        .single()
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=404,
            detail=f"Student {student_id} not found"
        )

    student = response.data

    return StudentProfile(
        id=           student["id"],
        student_id=   student["student_id"],
        name=         student["name"],
        grade=        student["grade"],
        section=      student["section"],
        school=       student["school_name"],
        sy=           student["school_year"],
        quarter=      student["current_quarter"],
        gwa=          student["gwa"],
        risk_level=   student["risk_level"],
        adviser_id=   student["adviser_id"],
        adviser_name= student["teachers"]["name"],
    )


# ── GET STUDENT SUBJECTS ──────────────────────────────────────────────────────
@router.get("/students/{student_id}/subjects", response_model=List[SubjectGrade])
async def get_student_subjects(
    student_id: str,
    quarter: Optional[str] = Query(None, description="Q1, Q2, Q3, or Q4")
):
    """
    Get all subjects and grades for a student.
    Used by: React Subjects tab.
    Example: GET /api/students/STU-240142/subjects?quarter=Q3
    """
    db = get_db()

    query = (
        db.table("student_grades")
        .select("*")
        .eq("student_id", student_id)
    )

    if quarter:
        query = query.eq("quarter", quarter)

    response = query.execute()

    if not response.data:
        return []

    return [
        SubjectGrade(
            name=  grade["subject_name"],
            code=  grade["subject_code"],
            melc=  grade["melc_competency"],
            q1=    grade.get("q1_score"),
            q2=    grade.get("q2_score"),
            q3=    grade.get("q3_score"),
            q4=    grade.get("q4_score"),
            trend= grade["trend"],
        )
        for grade in response.data
    ]


# ── GET STUDENT INSIGHTS ──────────────────────────────────────────────────────
@router.get("/students/{student_id}/insights", response_model=List[Insight])
async def get_student_insights(student_id: str):
    """
    Get pre-computed AI insights for a student.
    These are generated nightly — not on every request.
    Used by: React Husai AI Insights card.
    """
    db = get_db()

    response = (
        db.table("insights")
        .select("*")
        .eq("student_id", student_id)
        .eq("is_active", True)
        .order("created_at", desc=True)
        .limit(5)
        .execute()
    )

    if not response.data:
        return []

    return [
        Insight(
            type=          insight["type"],
            message=       insight["message"],
            quarter=       insight["quarter"],
            created_at=    insight["created_at"],
            model_version= insight["model_version"],
        )
        for insight in response.data
    ]


# ── GET STUDENT ATTENDANCE ────────────────────────────────────────────────────
@router.get("/students/{student_id}/attendance", response_model=AttendanceRecord)
async def get_student_attendance(
    student_id: str,
    quarter: Optional[str] = Query("Q3")
):
    """
    Get attendance summary for a student.
    Used by: React Attendance tab.
    """
    db = get_db()

    response = (
        db.table("attendance_summary")
        .select("*")
        .eq("student_id", student_id)
        .eq("quarter", quarter)
        .single()
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Attendance record not found")

    att = response.data
    total = att["present"] + att["absent"] + att["late"]

    return AttendanceRecord(
        present= att["present"],
        absent=  att["absent"],
        late=    att["late"],
        total=   total,
        rate=    round((att["present"] / total) * 100, 1) if total > 0 else 0.0
    )


# ── GET STUDENT ACTIVITY ──────────────────────────────────────────────────────
@router.get("/students/{student_id}/activity")
async def get_student_activity(
    student_id: str,
    limit: int = Query(10, ge=1, le=50)
):
    """
    Get recent activity for a student.
    Used by: React Activity tab.
    """
    db = get_db()

    response = (
        db.table("student_activity")
        .select("*")
        .eq("student_id", student_id)
        .order("activity_date", desc=True)
        .limit(limit)
        .execute()
    )

    return {"activities": response.data or []}


# ── CREATE STUDENT ────────────────────────────────────────────────────────────
@router.post("/students", status_code=201)
async def create_student(student: StudentCreate):
    """
    Create a new student record.
    Used by: Admin enrollment flow.
    """
    db = get_db()

    from datetime import date
    year_code = str(date.today().year)[-2:]

    last = (
        db.table("students")
        .select("student_id")
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    if last.data:
        last_seq = int(last.data[0]["student_id"].split("-")[1][2:])
        new_seq = str(last_seq + 1).zfill(4)
    else:
        new_seq = "0001"

    student_id = f"STU-{year_code}{new_seq}"

    response = (
        db.table("students")
        .insert({
            "student_id":      student_id,
            "name":            student.name,
            "grade":           student.grade,
            "section":         student.section,
            "adviser_id":      student.adviser_id,
            "school_year":     "S.Y. 2024-2025",
            "current_quarter": "Q3",
            "gwa":             0.0,
            "risk_level":      "none",
        })
        .execute()
    )

    return {
        "message":    "Student created successfully",
        "student_id": student_id,
        "data":       response.data[0]
    }