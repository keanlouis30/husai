# Model-1 Integration — Implementation Notes

> **MVP Approach:** The real `at_risk_model.pkl` (LightGBM) is used for inference. Synthetic student data is generated randomly at request time instead of pulling from the database.

---

## What Changed

### 1. `backend/app/models/at_risk.py`

**Problem:** `MODEL_PATH` used a relative string `"app/models/at_risk_model.pkl"` which pointed to a non-existent path relative to the working directory.

**Fix — absolute path resolution:**
```python
_THIS_DIR = Path(__file__).resolve().parent      # .../backend/app/models
_REPO_ROOT = _THIS_DIR.parent.parent.parent      # .../husai  (repo root)
MODEL_PATH = _REPO_ROOT / "Models" / "Model-1" / "at_risk_model.pkl"
```

**New function — `predict_risk_model1(inputs: dict) -> dict`:**

Added a dedicated predict function that uses the **correct feature set** from `Models/Model-1/feature_names.json`:

| Feature | Type | Range |
|---|---|---|
| `avg_grade_s1` | float | 60–100 |
| `attendance_rate` | float | 0–100 |
| `assignment_completion` | float | 0–100 |
| `class_participation` | float | 0–100 |
| `gender` | int | 0 = Female, 1 = Male |

> [!NOTE]
> This is separate from the existing `predict_risk(student, grades, attendance)` function so nothing currently using it is broken.

Returns:
```json
{
  "risk_level": "medium",
  "risk_score": 0.4523,
  "model_type": "lightgbm",
  "features_used": ["avg_grade_s1", "attendance_rate", "assignment_completion", "class_participation", "gender"]
}
```

---

### 2. `backend/app/routers/ai.py`

**New endpoint — `GET /api/ai/model1/predict_synthetic`:**

```
GET http://localhost:8000/api/ai/model1/predict_synthetic
```

1. Generates random synthetic student profile within realistic ranges.
2. Calls `predict_risk_model1(synthetic_inputs)` — runs the actual LightGBM model.
3. Returns inputs + prediction together.

**Sample response:**
```json
{
  "note": "Synthetic student data — for MVP demo only",
  "synthetic_inputs": {
    "avg_grade_s1": 74.3,
    "attendance_rate": 62.8,
    "assignment_completion": 55.1,
    "class_participation": 48.7,
    "gender": 1,
    "gender_label": "Male"
  },
  "prediction": {
    "risk_level": "high",
    "risk_score": 0.8124,
    "model_type": "lightgbm",
    "features_used": ["avg_grade_s1", "attendance_rate", "assignment_completion", "class_participation", "gender"]
  },
  "generated_at": "2026-03-25T00:20:00.000000"
}
```

> [!IMPORTANT]
> The endpoint returns `503` if the `.pkl` file is not found, and `500` on model inference errors — both with descriptive messages.

---

### 3. `frontend/husai/src/pages/HusaiTeacherDashboard.jsx`

**New component — `Model1RiskPanel`:**

- Self-contained panel placed inside `StudentDrawer` (the student profile expansion), above "Teacher Observation".
- Has three states: **idle**, **loading**, **result**.
- Clicking **Run Model** calls `GET /api/ai/model1/predict_synthetic`.
- **Result view shows:**
  - Risk level badge (color-coded: red/amber/yellow/green).
  - Animated progress bar for risk probability %.
  - Synthetic input chips (Avg Grade, Attendance, Assignments, Participation, Gender).
  - Model type and timestamp footer.
- Clicking **Re-run** generates a new random synthetic sample each time.
- Error state if the backend is unreachable or the model is missing.

---

## How to Test

### Backend
```bash
cd backend
uvicorn app.main:app --reload
# Then visit: http://localhost:8000/docs
# Try: GET /api/ai/model1/predict_synthetic
```

Or directly:
```bash
curl http://localhost:8000/api/ai/model1/predict_synthetic
```

Verify the response contains `"model_type": "lightgbm"` — not `"rule_based"`.

### Frontend
```bash
cd frontend/husai
npm run dev
```

1. Open `http://localhost:5173`.
2. Navigate to the **Teacher Dashboard**.
3. Click any student row to open the **Student Drawer**.
4. Find the **🤖 Model-1 — At-Risk Analysis** panel.
5. Click **Run Model** and observe the real-time LightGBM prediction.

---

## Architecture Diagram

```
[Teacher Dashboard UI]
  └─ StudentDrawer
       └─ Model1RiskPanel (new)
            └─ fetch GET /api/ai/model1/predict_synthetic
                  └─ [FastAPI] ai.py
                        └─ predict_risk_model1()  [at_risk.py]
                              └─ Models/Model-1/at_risk_model.pkl  (real LightGBM)
```

---

## Next Steps (Post-MVP)

- [ ] Wire to a real selected student's data instead of synthetic random inputs.
- [ ] Add SHAP explainability using `Models/Model-1/shap_summary.png` or feature importances.
- [ ] Cache the loaded model in memory (avoid re-loading `.pkl` on every request).
- [ ] Expose a `POST /api/ai/model1/predict` endpoint that accepts real student input.
