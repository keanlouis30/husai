"""
HUSAI — Model 2: SF9 Report Generation Dataset Generator
=========================================================
Generates synthetic JSONL training data for fine-tuning Llama 3 via QLoRA.

Each record is an instruction pair:
  - instruction: "Generate an SF9 quarterly narrative for the following student."
  - input:       A full student JSON snapshot (matching Husai's schema)
  - output:      A DepEd-formatted SF9 quarterly narrative

Usage:
    python generate_dataset.py --count 500 --output husai_sf9_dataset.jsonl

Upload the output JSONL to Google Drive under /husai/ before training in Colab.
"""

import argparse
import json
import random
import uuid
from datetime import datetime, timedelta

# ─────────────────────────────────────────────
# Constants — Philippine school context
# ─────────────────────────────────────────────

FIRST_NAMES_M = [
    "Juan", "Carlos", "Miguel", "Rafael", "Andres", "Jose", "Marco",
    "Gabriel", "Luis", "Antonio", "Daniel", "Paolo", "Renz", "Jayden",
    "Ethan", "Nathaniel", "Elijah", "Joshua", "Mark", "Kenneth",
]
FIRST_NAMES_F = [
    "Maria", "Ana", "Sofia", "Isabella", "Gabriela", "Angela", "Patricia",
    "Jasmine", "Nicole", "Camille", "Bianca", "Hannah", "Althea", "Kyla",
    "Trisha", "Princess", "Angelica", "Andrea", "Sophia", "Ella",
]
LAST_NAMES = [
    "Santos", "Reyes", "Cruz", "Bautista", "Del Rosario", "Gonzales",
    "Ramos", "Aquino", "Mendoza", "Torres", "Garcia", "Rivera",
    "Fernandez", "Lopez", "Martinez", "Villanueva", "De Leon",
    "Castillo", "Navarro", "Mercado", "Dela Cruz", "Manalo",
    "Pascual", "Aguilar", "Francisco", "Salvador", "Santiago",
]

SCHOOLS = [
    "Rizal Elementary School", "Quezon City Central School",
    "Manila Science High School", "Bonifacio National High School",
    "Magsaysay Elementary School", "Mabini Integrated School",
    "Bagong Silang Elementary School", "Taguig City National High School",
    "Pasig City Science High School", "Caloocan North Elementary School",
]

SECTIONS = [
    "Mabini", "Rizal", "Bonifacio", "Aguinaldo", "Luna", "Del Pilar",
    "Silang", "Jacinto", "Balagtas", "Burgos", "Plaridel", "Tandang Sora",
]

ADVISERS = [
    "Mrs. Lourdes Reyes", "Mr. Ricardo Santos", "Mrs. Elena Cruz",
    "Mr. Jose Bautista", "Mrs. Carmen Gonzales", "Mr. Andres Ramos",
    "Mrs. Teresa Mendoza", "Mr. Fernando Torres", "Mrs. Rosario Garcia",
    "Mr. Alberto Rivera", "Mrs. Concepcion Lopez", "Mr. Ramon Martinez",
]

GRADE_LEVELS = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"]

SUBJECTS = [
    {"name": "Mathematics",           "code": "MATH"},
    {"name": "Science",               "code": "SCI"},
    {"name": "Filipino",              "code": "FIL"},
    {"name": "English",               "code": "ENG"},
    {"name": "Araling Panlipunan",    "code": "AP"},
    {"name": "MAPEH",                 "code": "MAPEH"},
    {"name": "Edukasyon sa Pagpapakatao", "code": "ESP"},
    {"name": "Technology and Livelihood Education", "code": "TLE"},
]

MELC_CODES = {
    "MATH":  ["M5NS-IIf", "M5ME-IVa", "M5GE-IIIb", "M5SP-IVd", "M5NS-Ia"],
    "SCI":   ["S5MT-Ia", "S5FE-IIa", "S5LT-IIIa", "S5ES-IVa", "S5MT-IIb"],
    "FIL":   ["F5RC-IIIa", "F5WC-IId", "F5PT-Ib", "F5RC-IVa", "F5OL-IIa"],
    "ENG":   ["EN5RC-Ia", "EN5WC-IIb", "EN5LC-IIIa", "EN5OL-IVa", "EN5RC-IIc"],
    "AP":    ["AP5KAP-Ia", "AP5PKK-IIa", "AP5HKS-IIIa", "AP5EKO-IVa"],
    "MAPEH": ["MA5PF-Ia", "MU5RH-IIa", "AR5EL-IIIa", "PE5GS-IVa"],
    "ESP":   ["ESP5P-Ia", "ESP5P-IIa", "ESP5P-IIIa", "ESP5P-IVa"],
    "TLE":   ["TLE5HE-0a", "TLE5IA-0b", "TLE5AG-0c", "TLE5ICT-0d"],
}

QUARTERS = ["Q1", "Q2", "Q3", "Q4"]

STRENGTH_PHRASES = {
    "MATH":  ["problem-solving", "number sense", "mathematical reasoning", "computation skills"],
    "SCI":   ["scientific inquiry", "analytical thinking", "experimentation skills", "observation"],
    "FIL":   ["pagbasa", "pagsulat", "pakikinig", "pagpapahayag"],
    "ENG":   ["reading comprehension", "writing fluency", "oral communication", "vocabulary"],
    "AP":    ["historical analysis", "civic awareness", "cultural understanding"],
    "MAPEH": ["physical fitness", "musical appreciation", "artistic expression", "health awareness"],
    "ESP":   ["values formation", "moral reasoning", "ethical decision-making"],
    "TLE":   ["practical skills", "entrepreneurial thinking", "technical competency"],
}

WEAKNESS_PHRASES = {
    "MATH":  ["fraction operations", "word problems", "decimal computation", "geometry concepts"],
    "SCI":   ["laboratory procedures", "scientific method application", "data interpretation"],
    "FIL":   ["pagsulat ng sanaysay", "gramatika", "pag-unawa sa binasa", "bokabularyo"],
    "ENG":   ["grammar and syntax", "essay writing", "reading comprehension", "vocabulary usage"],
    "AP":    ["timeline analysis", "map reading", "primary source interpretation"],
    "MAPEH": ["rhythmic exercises", "music theory", "art techniques", "sportsmanship"],
    "ESP":   ["self-reflection", "empathy in practice", "community awareness"],
    "TLE":   ["tool handling", "project planning", "safety protocols"],
}

ATTENDANCE_COMMENTS_GOOD = [
    "excellent at {present} out of {total} school days",
    "commendable at {present} out of {total} school days",
    "very good, having attended {present} out of {total} school days",
    "consistent, recording {present} days of attendance out of {total}",
]

ATTENDANCE_COMMENTS_OK = [
    "acceptable at {present} out of {total} school days, though improvement is encouraged",
    "adequate at {present} out of {total} school days, with some absences noted",
    "{present} out of {total} school days, which is within DepEd's required threshold",
]

ATTENDANCE_COMMENTS_BAD = [
    "a concern at only {present} out of {total} school days. Regular attendance is strongly encouraged",
    "below expectations with only {present} out of {total} school days attended. Consistent attendance is critical for academic progress",
    "significantly affected by {absent} absences out of {total} school days, which may impact overall performance",
]


# ─────────────────────────────────────────────
# Student snapshot generator
# ─────────────────────────────────────────────

def generate_student_snapshot(quarter: str) -> dict:
    """Generate a synthetic student JSON snapshot matching Husai's schema."""
    is_male = random.random() < 0.5
    first_name = random.choice(FIRST_NAMES_M if is_male else FIRST_NAMES_F)
    last_name = random.choice(LAST_NAMES)
    full_name = f"{first_name} {last_name}"
    grade = random.choice(GRADE_LEVELS)
    section = random.choice(SECTIONS)
    school = random.choice(SCHOOLS)
    adviser = random.choice(ADVISERS)
    school_year = "S.Y. 2024-2025"
    q_index = QUARTERS.index(quarter)

    # Determine student archetype for realistic grade distributions
    # archetypes: high-performer, average, struggling, at-risk
    archetype = random.choices(
        ["high", "average", "struggling", "at_risk"],
        weights=[0.20, 0.45, 0.25, 0.10],
        k=1
    )[0]

    grade_ranges = {
        "high":       (85, 99),
        "average":    (76, 89),
        "struggling": (70, 82),
        "at_risk":    (60, 76),
    }
    g_min, g_max = grade_ranges[archetype]

    # Generate subject grades
    subjects = []
    for subj in SUBJECTS:
        grades = {}
        base_grade = random.randint(g_min, g_max)
        for i, q in enumerate(QUARTERS[:q_index + 1]):
            drift = random.randint(-5, 5)
            grades[q.lower()] = max(60, min(99, base_grade + drift))

        # Determine trend
        filled_quarters = [grades[q.lower()] for q in QUARTERS[:q_index + 1]]
        if len(filled_quarters) >= 2:
            diff = filled_quarters[-1] - filled_quarters[-2]
            trend = "up" if diff > 2 else ("down" if diff < -2 else "stable")
        else:
            trend = "stable"

        melc_code = random.choice(MELC_CODES.get(subj["code"], ["N/A"]))

        subj_entry = {
            "name": subj["name"],
            "code": subj["code"],
            "melc": melc_code,
            **{q.lower(): grades.get(q.lower()) for q in QUARTERS},
            "trend": trend,
        }
        # Set future quarters to null
        for q in QUARTERS[q_index + 1:]:
            subj_entry[q.lower()] = None

        subjects.append(subj_entry)

    # GWA per quarter
    gwa = {}
    for q in QUARTERS[:q_index + 1]:
        q_grades = [s[q.lower()] for s in subjects if s[q.lower()] is not None]
        gwa[q.lower()] = round(sum(q_grades) / len(q_grades), 2) if q_grades else None
    for q in QUARTERS[q_index + 1:]:
        gwa[q.lower()] = None

    # Attendance
    total_days = random.choice([45, 48, 50, 52])
    if archetype == "high":
        present = random.randint(int(total_days * 0.93), total_days)
    elif archetype == "average":
        present = random.randint(int(total_days * 0.85), int(total_days * 0.95))
    elif archetype == "struggling":
        present = random.randint(int(total_days * 0.78), int(total_days * 0.90))
    else:
        present = random.randint(int(total_days * 0.60), int(total_days * 0.82))

    absent = total_days - present
    late = random.randint(0, min(5, absent))
    att_rate = round((present / total_days) * 100, 1)

    # Risk assessment
    current_gwa = gwa[quarter.lower()]
    if current_gwa and current_gwa < 75 or att_rate < 80:
        risk_level = "high"
        risk_score = round(random.uniform(0.7, 1.0), 3)
    elif current_gwa and current_gwa < 80 or att_rate < 85:
        risk_level = "medium"
        risk_score = round(random.uniform(0.4, 0.7), 3)
    elif current_gwa and current_gwa < 85:
        risk_level = "low"
        risk_score = round(random.uniform(0.1, 0.4), 3)
    else:
        risk_level = "none"
        risk_score = round(random.uniform(0.0, 0.15), 3)

    # Risk factors from weakest subjects
    sorted_subjs = sorted(subjects, key=lambda s: s.get(quarter.lower(), 100) or 100)
    risk_factors = []
    if risk_level in ("high", "medium"):
        for s in sorted_subjs[:2]:
            risk_factors.append({
                "feature": f"low_{s['code'].lower()}_grade",
                "impact": round(random.uniform(0.15, 0.45), 4),
            })
        if att_rate < 85:
            risk_factors.append({
                "feature": "low_attendance_rate",
                "impact": round(random.uniform(0.10, 0.35), 4),
            })

    # Achievements
    achievements = []
    if archetype == "high":
        best_subj = max(subjects, key=lambda s: s.get(quarter.lower(), 0) or 0)
        achievements.append({
            "label": f"Outstanding performance in {best_subj['name']}",
            "subject": best_subj["code"],
            "quarter": quarter,
        })
        if att_rate >= 95:
            achievements.append({
                "label": "Perfect or near-perfect attendance",
                "subject": "General",
                "quarter": quarter,
            })

    snapshot = {
        "meta": {
            "student_id": f"STU-{random.randint(100000, 999999)}",
            "quarter": quarter,
            "school_year": school_year,
            "generated_at": datetime.now().isoformat(),
        },
        "profile": {
            "name": full_name,
            "grade": grade,
            "section": section,
            "school": school,
            "adviser": adviser,
            "gender": "Male" if is_male else "Female",
        },
        "grades": {s["code"]: s for s in subjects},
        "gwa": gwa,
        "attendance": {
            "present": present,
            "absent": absent,
            "late": late,
            "total": total_days,
            "rate": att_rate,
        },
        "flags": {
            "at_risk": risk_level in ("high", "medium"),
            "risk_level": risk_level,
            "risk_score": risk_score,
            "risk_factors": risk_factors,
        },
        "achievements": achievements,
        "insights": None,
    }

    return snapshot


# ─────────────────────────────────────────────
# SF9 narrative generator
# ─────────────────────────────────────────────

def generate_sf9_narrative(snapshot: dict) -> str:
    """Generate a DepEd-formatted SF9 quarterly narrative from a student snapshot."""
    profile = snapshot["profile"]
    grades  = snapshot["grades"]
    gwa     = snapshot["gwa"]
    att     = snapshot["attendance"]
    flags   = snapshot["flags"]
    achievements = snapshot["achievements"]
    quarter = snapshot["meta"]["quarter"]
    q_key   = quarter.lower()

    name       = profile["name"]
    first_name = name.split()[0]
    grade_lvl  = profile["grade"]
    pronoun    = "He" if profile["gender"] == "Male" else "She"
    poss       = "His" if profile["gender"] == "Male" else "Her"
    obj        = "him" if profile["gender"] == "Male" else "her"

    quarter_label = quarter.replace("Q", "").strip()
    quarter_words = {"1": "First", "2": "Second", "3": "Third", "4": "Fourth"}
    quarter_name  = quarter_words.get(quarter_label, quarter_label)

    # Sort subjects by grade this quarter
    subj_list = list(grades.values())
    subj_list_sorted = sorted(subj_list, key=lambda s: s.get(q_key, 0) or 0, reverse=True)

    strongest  = subj_list_sorted[:2]
    weakest    = [s for s in subj_list_sorted if (s.get(q_key) or 0) < 80]
    current_gwa = gwa.get(q_key, 0)

    # ── Opening sentence ──
    if current_gwa and current_gwa >= 90:
        perf_adj = random.choice(["outstanding", "excellent", "exemplary", "remarkable"])
    elif current_gwa and current_gwa >= 85:
        perf_adj = random.choice(["very satisfactory", "commendable", "very good", "laudable"])
    elif current_gwa and current_gwa >= 80:
        perf_adj = random.choice(["satisfactory", "adequate", "good"])
    elif current_gwa and current_gwa >= 75:
        perf_adj = random.choice(["fairly satisfactory", "acceptable"])
    else:
        perf_adj = random.choice(["below expectations", "needs significant improvement"])

    opening = (
        f"{name} demonstrated {perf_adj} performance in {grade_lvl} "
        f"during the {quarter_name} Quarter of {snapshot['meta']['school_year'].replace('S.Y. ', '')}."
    )

    # ── Strengths ──
    strength_lines = []
    for s in strongest[:2]:
        g = s.get(q_key)
        if g and g >= 80:
            code = s["code"]
            phrase = random.choice(STRENGTH_PHRASES.get(code, ["subject competency"]))
            strength_lines.append(f"{s['name']} ({g})")

    if strength_lines:
        if len(strength_lines) == 2:
            strengths = (
                f"{pronoun} showed strength in {strength_lines[0]} "
                f"and {strength_lines[1]}."
            )
        else:
            strengths = f"{pronoun} showed strength in {strength_lines[0]}."
    else:
        strengths = ""

    # ── Trend commentary ──
    trend_commentary = ""
    improving = [s for s in subj_list if s.get("trend") == "up"]
    declining = [s for s in subj_list if s.get("trend") == "down"]

    if improving:
        subj_names = [s["name"] for s in improving[:2]]
        trend_commentary += (
            f" {pronoun} has shown consistent improvement in "
            f"{' and '.join(subj_names)}, which is encouraging."
        )
    if declining:
        subj_names = [s["name"] for s in declining[:2]]
        trend_commentary += (
            f" A declining trend was observed in "
            f"{' and '.join(subj_names)}, which requires attention."
        )

    # ── Weaknesses / areas for development ──
    weakness_text = ""
    if weakest:
        weak_subj = weakest[0]
        code = weak_subj["code"]
        phrase = random.choice(WEAKNESS_PHRASES.get(code, ["foundational concepts"]))
        melc = weak_subj.get("melc", "")
        melc_ref = f" ({melc})" if melc and melc != "N/A" else ""
        weakness_text = (
            f" Areas for continued development include {weak_subj['name']}, "
            f"particularly in {phrase}{melc_ref}, "
            f"where targeted review and additional practice are recommended."
        )
        if len(weakest) > 1:
            weak2 = weakest[1]
            phrase2 = random.choice(WEAKNESS_PHRASES.get(weak2["code"], ["skills development"]))
            weakness_text += (
                f" {weak2['name']} also warrants further attention, "
                f"specifically regarding {phrase2}."
            )

    # ── Attendance ──
    att_rate = att["rate"]
    present = att["present"]
    total   = att["total"]
    absent  = att["absent"]

    if att_rate >= 95:
        att_template = random.choice(ATTENDANCE_COMMENTS_GOOD)
    elif att_rate >= 85:
        att_template = random.choice(ATTENDANCE_COMMENTS_OK)
    else:
        att_template = random.choice(ATTENDANCE_COMMENTS_BAD)

    att_filled = att_template.format(present=present, total=total, absent=absent)
    attendance_text = f" {poss} attendance record was {att_filled}."

    # ── Risk / intervention note ──
    risk_text = ""
    if flags["risk_level"] == "high":
        risk_factors_desc = []
        for rf in flags.get("risk_factors", [])[:2]:
            feature = rf["feature"].replace("_", " ").replace("low ", "")
            risk_factors_desc.append(feature)
        factors_str = " and ".join(risk_factors_desc) if risk_factors_desc else "multiple academic indicators"
        risk_text = (
            f" Based on current performance data, {first_name} has been identified as "
            f"at-risk due to {factors_str}. "
            f"Immediate intervention and close monitoring by the class adviser and guidance office "
            f"are strongly recommended."
        )
    elif flags["risk_level"] == "medium":
        risk_text = (
            f" {first_name} is showing early warning signs that merit closer monitoring. "
            f"The class adviser is encouraged to provide additional support and communicate "
            f"with the parents or guardians regarding {poss.lower()} academic progress."
        )

    # ── Achievements ──
    achievement_text = ""
    if achievements:
        labels = [a["label"].lower() for a in achievements]
        achievement_text = (
            f" Notable achievements this quarter include {', '.join(labels)}."
        )

    # ── Closing ──
    if current_gwa and current_gwa >= 85:
        closing = random.choice([
            f" {first_name} is encouraged to maintain this level of performance and continue striving for excellence.",
            f" With continued dedication, {first_name} is well-positioned for academic success.",
            f" {poss} consistent effort and positive attitude in class are commendable.",
        ])
    elif current_gwa and current_gwa >= 75:
        closing = random.choice([
            f" With consistent effort and proper guidance, {first_name} can achieve significant improvement in the coming quarter.",
            f" {first_name} is encouraged to dedicate more time to reviewing weak areas and to seek help from {poss.lower()} teachers when needed.",
            f" Parent-teacher coordination is recommended to support {first_name}'s continued academic growth.",
        ])
    else:
        closing = (
            f" A parent-teacher conference is recommended to discuss a structured support plan "
            f"for {first_name}. Additional remedial sessions and individualized learning activities "
            f"should be considered to help {obj} meet the required competencies."
        )

    # ── Assemble narrative ──
    narrative = opening
    if strengths:
        narrative += " " + strengths
    narrative += trend_commentary
    narrative += weakness_text
    narrative += attendance_text
    narrative += risk_text
    narrative += achievement_text
    narrative += closing

    return narrative.strip()


# ─────────────────────────────────────────────
# Instruction variations
# ─────────────────────────────────────────────

INSTRUCTIONS = [
    "Generate an SF9 quarterly narrative for the following student.",
    "Write a DepEd SF9 narrative report for this student based on their academic data.",
    "Compose a quarterly progress narrative in DepEd SF9 format for the student below.",
    "Based on the student data provided, generate an SF9 quarterly remarks narrative.",
    "Create a formal SF9 quarterly report narrative describing this student's academic performance.",
    "Draft a DepEd-compliant SF9 narrative summarizing this student's quarterly performance.",
    "Using the student JSON snapshot below, write an SF9 narrative suitable for official school records.",
    "Generate a teacher's quarterly narrative for the student's SF9 report card.",
]


# ─────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────

def generate_dataset(count: int, output_path: str):
    """Generate the full JSONL dataset."""
    records = []

    for i in range(count):
        quarter = random.choice(QUARTERS)
        snapshot = generate_student_snapshot(quarter)
        narrative = generate_sf9_narrative(snapshot)

        record = {
            "instruction": random.choice(INSTRUCTIONS),
            "input": json.dumps(snapshot, ensure_ascii=False),
            "output": narrative,
        }
        records.append(record)

        if (i + 1) % 100 == 0:
            print(f"  Generated {i + 1}/{count} records...")

    with open(output_path, "w", encoding="utf-8") as f:
        for record in records:
            f.write(json.dumps(record, ensure_ascii=False) + "\n")

    print(f"\n✅ Dataset saved to: {output_path}")
    print(f"   Total records: {len(records)}")
    print(f"   Format: JSONL (instruction / input / output)")
    print(f"\n   Upload to Google Drive under /husai/ before training in Colab.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Generate synthetic SF9 training data for HUSAI Model 2"
    )
    parser.add_argument(
        "--count", "-n",
        type=int,
        default=500,
        help="Number of training examples to generate (default: 500)",
    )
    parser.add_argument(
        "--output", "-o",
        type=str,
        default="husai_sf9_dataset.jsonl",
        help="Output JSONL file path (default: husai_sf9_dataset.jsonl)",
    )
    parser.add_argument(
        "--seed", "-s",
        type=int,
        default=42,
        help="Random seed for reproducibility (default: 42)",
    )
    args = parser.parse_args()

    random.seed(args.seed)
    print(f"HUSAI — Model 2 Dataset Generator")
    print(f"  Generating {args.count} SF9 training examples...")
    print(f"  Seed: {args.seed}\n")

    generate_dataset(args.count, args.output)