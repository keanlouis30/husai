# app/models/at_risk.py

import numpy as np
import os
import pickle
from pathlib import Path

# Resolve model path relative to the repo root (Models/Model-1/at_risk_model.pkl)
# This file lives at: backend/app/models/at_risk.py
# The .pkl lives at:  Models/Model-1/at_risk_model.pkl  (two levels above `backend/`)
_THIS_DIR = Path(__file__).resolve().parent          # .../backend/app/models
_REPO_ROOT = _THIS_DIR.parent.parent.parent          # .../husai (repo root)
MODEL_PATH = _REPO_ROOT / "Models" / "Model-1" / "at_risk_model.pkl"
_FEATURE_NAMES_PATH = _REPO_ROOT / "Models" / "Model-1" / "feature_names.json"

# Model-1 expected features (from feature_names.json):
# ["avg_grade_s1", "attendance_rate", "assignment_completion", "class_participation", "gender"]

def predict_risk_model1(inputs: dict) -> dict:
    """
    Predict at-risk status using the actual Model-1 LightGBM .pkl file.

    Args:
        inputs: dict with keys matching Model-1 feature names:
            - avg_grade_s1       (float, 60-100)
            - attendance_rate    (float, 0-100)
            - assignment_completion (float, 0-100)
            - class_participation  (float, 0-100)
            - gender             (int, 0=Female, 1=Male)

    Returns:
        dict with risk_level, risk_score, model_type, and used features.
    """
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model-1 not found at {MODEL_PATH}. "
            "Please ensure at_risk_model.pkl is in Models/Model-1/."
        )

    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)

    # Build feature vector in the exact order Model-1 was trained on
    feature_order = ["avg_grade_s1", "attendance_rate", "assignment_completion",
                     "class_participation", "gender"]
    X = np.array([[inputs[feat] for feat in feature_order]])

    risk_score = float(model.predict_proba(X)[0][1])

    if risk_score >= 0.7:
        risk_level = "high"
    elif risk_score >= 0.4:
        risk_level = "medium"
    elif risk_score >= 0.2:
        risk_level = "low"
    else:
        risk_level = "none"

    return {
        "risk_level":  risk_level,
        "risk_score":  round(risk_score, 4),
        "model_type":  "lightgbm",
        "features_used": feature_order,
    }

def predict_risk(student: dict, grades: list, attendance: dict) -> dict:
    """
    Predict at-risk level for a student using LightGBM.
    
    For the hackathon: uses a rule-based fallback if the model isn't trained yet.
    For production: train the model on historical DepEd data and load it here.
    
    Returns:
        {
            "risk_level": "high" | "medium" | "low" | "none",
            "risk_score": 0.0 to 1.0,
            "trend": "up" | "down" | "stable",
            "factors": ["low_attendance", "declining_grades"]  # for explainability
        }
    """
    # Try to load the trained model
    if MODEL_PATH.exists():
        return _predict_with_model(student, grades, attendance)
    else:
        # Fallback: rule-based logic for hackathon demo
        return _predict_rule_based(student, grades, attendance)


def _predict_rule_based(student: dict, grades: list, attendance: dict) -> dict:
    """
    Rule-based at-risk prediction.
    Used when the ML model hasn't been trained yet (e.g. during hackathon).
    Based on DepEd promotion policies.
    """
    gwa = student.get("gwa", 0)
    att_rate = attendance.get("attendance_rate", 100)
    absent = attendance.get("absent", 0)

    risk_score = 0.0
    factors = []

    # GWA below 75 = failing
    if gwa < 75:
        risk_score += 0.5
        factors.append("gwa_below_threshold")
    elif gwa < 80:
        risk_score += 0.2
        factors.append("low_gwa")

    # Attendance below 80% = serious concern
    if att_rate < 80:
        risk_score += 0.4
        factors.append("low_attendance")
    elif att_rate < 90:
        risk_score += 0.15
        factors.append("attendance_below_deped_threshold")

    # More than 10 absences = red flag
    if absent > 10:
        risk_score += 0.2
        factors.append("high_absence_count")

    # Check for declining trend across quarters
    if grades:
        q_scores = []
        for g in grades:
            if g.get("q1_score") and g.get("q3_score"):
                if g["q3_score"] < g["q1_score"] - 5:  # Dropped more than 5 points
                    q_scores.append(True)

        if len(q_scores) > len(grades) * 0.5:  # More than half of subjects declining
            risk_score += 0.2
            factors.append("declining_grades")

    # Cap at 1.0
    risk_score = min(risk_score, 1.0)

    # Map score to risk level
    if risk_score >= 0.7:
        risk_level = "high"
    elif risk_score >= 0.4:
        risk_level = "medium"
    elif risk_score >= 0.2:
        risk_level = "low"
    else:
        risk_level = "none"

    # Determine trend
    if grades:
        improving = sum(1 for g in grades if g.get("q3_score", 0) > g.get("q1_score", 0))
        declining = sum(1 for g in grades if g.get("q3_score", 0) < g.get("q1_score", 0))
        if improving > declining:
            trend = "up"
        elif declining > improving:
            trend = "down"
        else:
            trend = "stable"
    else:
        trend = "stable"

    return {
        "risk_level":  risk_level,
        "risk_score":  round(risk_score, 3),
        "trend":       trend,
        "factors":     factors,
        "model_type":  "rule_based"  # Flag so you know ML isn't running yet
    }


def _predict_with_model(student: dict, grades: list, attendance: dict) -> dict:
    """
    Predict using the trained LightGBM model.
    Call train_model() below first to create it.
    """
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)

    # Build the feature vector — same features used during training
    features = _build_features(student, grades, attendance)
    X = np.array([features])

    # Predict probability of being at-risk
    risk_score = float(model.predict_proba(X)[0][1])

    if risk_score >= 0.7:
        risk_level = "high"
    elif risk_score >= 0.4:
        risk_level = "medium"
    elif risk_score >= 0.2:
        risk_level = "low"
    else:
        risk_level = "none"

    return {
        "risk_level": risk_level,
        "risk_score": round(risk_score, 3),
        "trend":      _compute_trend(grades),
        "factors":    [],
        "model_type": "lightgbm"
    }


def _build_features(student: dict, grades: list, attendance: dict) -> list:
    """Convert student data into the feature vector the model expects."""
    gwa = student.get("gwa", 0)
    att_rate = attendance.get("attendance_rate", 100)
    absent = attendance.get("absent", 0)

    # Average Q1 vs Q3 score across all subjects
    q1_avg = np.mean([g.get("q1_score", gwa) for g in grades]) if grades else gwa
    q3_avg = np.mean([g.get("q3_score", gwa) for g in grades]) if grades else gwa

    return [
        gwa,               # Current GWA
        att_rate,          # Attendance rate
        absent,            # Absence count
        q1_avg,            # Q1 average
        q3_avg,            # Q3 average
        q3_avg - q1_avg,   # Grade trend (negative = declining)
        len(grades),       # Number of subjects
    ]


def _compute_trend(grades: list) -> str:
    if not grades:
        return "stable"
    improving = sum(1 for g in grades if g.get("q3_score", 0) > g.get("q1_score", 0))
    declining  = sum(1 for g in grades if g.get("q3_score", 0) < g.get("q1_score", 0))
    if improving > declining: return "up"
    if declining > improving: return "down"
    return "stable"


def train_model(training_data_path: str):
    """
    Train the LightGBM model on historical student data.
    
    Run this once from the command line:
      python -c "from app.models.at_risk import train_model; train_model('data/students.csv')"
    
    After training, the model is saved to MODEL_PATH and loaded automatically.
    """
    import lightgbm as lgb
    import pandas as pd
    from sklearn.model_selection import train_test_split

    df = pd.read_csv(training_data_path)

    # Features and label
    # 'at_risk_label' = 1 if student failed or dropped out, 0 if not
    feature_cols = ["gwa", "attendance_rate", "absent_count",
                    "q1_avg", "q3_avg", "grade_trend", "subject_count"]
    X = df[feature_cols]
    y = df["at_risk_label"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    model = lgb.LGBMClassifier(
        n_estimators=100,
        learning_rate=0.1,
        num_leaves=31,
    )
    model.fit(X_train, y_train)

    # Save the trained model
    MODEL_PATH.parent.mkdir(exist_ok=True)
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    accuracy = model.score(X_test, y_test)
    print(f"Model trained. Accuracy: {accuracy:.2%}")
    print(f"Saved to: {MODEL_PATH}")