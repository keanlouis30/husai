# app/schemas/student.py

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Enums — restrict values to a fixed set
class RiskLevel(str, Enum):
    high   = "high"
    medium = "medium"
    low    = "low"
    none   = "none"

class TrendDirection(str, Enum):
    up     = "up"
    down   = "down"
    stable = "stable"

class InsightType(str, Enum):
    warn = "warn"
    ok   = "ok"
    info = "info"

# ── STUDENT SCHEMAS ────────────────────────────────────────────────────────────

class SubjectGrade(BaseModel):
    name:       str
    code:       str                    # e.g. "MATH", "FIL"
    melc:       str                    # DepEd MELC competency
    q1:         Optional[float] = None
    q2:         Optional[float] = None
    q3:         Optional[float] = None
    q4:         Optional[float] = None
    trend:      TrendDirection

class AttendanceRecord(BaseModel):
    present:    int
    absent:     int
    late:       int
    total:      int
    rate:       float                  # computed: present/total * 100

class Insight(BaseModel):
    type:        InsightType
    message:     str
    quarter:     str
    created_at:  datetime
    model_version: str

class StudentProfile(BaseModel):
    """
    Full student profile — returned by GET /api/students/{id}
    This matches exactly what the React StudentDashboard expects.
    """
    id:           str
    student_id:   str                  # e.g. "STU-240142"
    name:         str
    grade:        str                  # e.g. "Grade 5"
    section:      str                  # e.g. "Mabini"
    school:       str
    sy:           str                  # e.g. "S.Y. 2024-2025"
    quarter:      str
    gwa:          float
    risk_level:   RiskLevel
    adviser_id:   str
    adviser_name: str

class StudentListItem(BaseModel):
    """Lighter version — used in the teacher roster view."""
    id:         str
    student_id: str
    name:       str
    gwa:        float
    q1:         Optional[float] = None
    q2:         Optional[float] = None
    q3:         Optional[float] = None
    attendance: float
    risk:       RiskLevel
    trend:      TrendDirection
    absent:     int

class StudentCreate(BaseModel):
    """Schema for creating a new student — used by admin."""
    name:       str = Field(..., min_length=2, max_length=100)
    grade:      str
    section:    str
    school_id:  str
    adviser_id: str
    birthday:   Optional[str] = None
    address:    Optional[str] = None