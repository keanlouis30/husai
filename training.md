# HUSAI — AI Model Training Guide
*How to train each model, where to get the data, and how to run it all on Google Colab*

---

## Overview

Husai uses three custom-trained models and one API-based component. This document covers training steps for the two models you need to train yourself:

| Model | Type | Colab GPU Needed | Est. Training Time |
|---|---|---|---|
| **At-Risk Detection Engine** | LightGBM (custom-trained) | T4 (free tier) | 10–30 min |
| **Report Generation Engine** | Llama 3 8B fine-tuned via QLoRA | A100 (Colab Pro) or T4 with patience | 1–3 hrs |
| Learning Gap Classifier | Fine-tuned BERT | T4 (free tier) | 30–60 min |
| NL Query Interface | Claude / GPT-4 API | No training needed | — |

> **Colab tier recommendation:** Use **Colab Free** for LightGBM and BERT. Use **Colab Pro** (A100 40GB) for Llama 3 fine-tuning. If budget is tight, T4 + QLoRA + Unsloth works but will take longer.

---

## Model 1 — At-Risk Detection Engine (LightGBM)

### What It Does
Predicts which students are at risk of falling behind or dropping out based on attendance, grades, submission rates, and behavioral signals. Outputs a risk score (0–1) and a SHAP explanation of which factors drove the flag.

### Research Basis
Bertolini et al. (2024) found that boosting algorithms — particularly LightGBM and CatBoost with Optuna hyperparameter tuning — outperformed all traditional classification methods for student dropout prediction. SMOTE significantly improved model accuracy on imbalanced datasets (Bertolini et al., 2024). LightGBM achieved an F1-score of 0.840 in a university-scale study with 20,050 student records (Chung & Lee study replicated in Kim et al., 2023, MDPI Applied Sciences).

---

### Step 1 — Get the Datasets

Use all three datasets and merge them. More data = more robust generalization.

**Dataset A — Primary (UCI / Kaggle)**
- Name: *Predict Students' Dropout and Academic Success*
- Source: UCI Machine Learning Repository
- URL: https://archive.ics.uci.edu/dataset/697/predict+students+dropout+and+academic+success
- Also on Kaggle: https://www.kaggle.com/datasets/thedevastator/higher-education-predictors-of-student-retention
- Records: 4,424 students
- Features: Academic path, demographics, socioeconomic factors, semester grades
- License: CC BY 4.0
- Citation: Realinho, V., Vieira Martins, M., Machado, J., & Baptista, L. (2021). *Predict Students' Dropout and Academic Success* [Dataset]. UCI ML Repository. https://doi.org/10.24432/C5MC89

**Dataset B — Behavioral / Engagement Signals**
- Name: *Student Performance and Attendance Dataset*
- Source: Kaggle
- URL: https://www.kaggle.com/datasets/marvyaymanhalim/student-performance-and-attendance-dataset
- Features: Attendance, study hours, assignment completion, exam scores, final grades

**Dataset C — Extended Behavioral Dataset (14,003 records)**
- Name: *Student Performance and Learning Behavior Dataset*
- Source: Zenodo (open access)
- URL: https://zenodo.org/records/16459132
- Records: 14,003 students, 16 attributes
- Features: StudyHours, Attendance, AssignmentCompletion, Motivation, StressLevel, ExamScore, FinalGrade
- Note: Merged and anonymized, no PII

**Dataset D — xAPI Behavioral Data**
- Name: *Students' Academic Performance Dataset (xAPI-Edu-Data)*
- Source: Kaggle
- URL: https://www.kaggle.com/datasets/aljarah/xAPI-Edu-Data
- Features: Engagement signals, resource access, discussion participation, class performance

---

### Step 2 — Set Up Colab

```python
# Cell 1 — Install dependencies
!pip install lightgbm optuna shap imbalanced-learn scikit-learn pandas numpy matplotlib seaborn

# Cell 2 — Mount Google Drive (to save your model)
from google.colab import drive
drive.mount('/content/drive')
```

---

# HUSAI — Model 1: At-Risk Detection
# Step 3: Load, Clean, and Merge Your Datasets
# -----------------------------------------------
# Run each cell in order in Google Colab.
# Upload your CSV files to Colab first (see Cell 0).

# ─────────────────────────────────────────────
# CELL 0 — Upload your files to Colab
# ─────────────────────────────────────────────
from google.colab import files
from google.colab import drive

# Mount Drive so you can save progress
drive.mount('/content/drive')

# Upload all CSVs at once — a file picker will appear
uploaded = files.upload()

# After uploading, confirm what was received
import os
print("Files uploaded:")
for f in uploaded:
    print(f"  {f}")


# ─────────────────────────────────────────────
# CELL 1 — Install dependencies
# ─────────────────────────────────────────────
!pip install lightgbm optuna shap imbalanced-learn scikit-learn pandas numpy matplotlib seaborn --quiet


# ─────────────────────────────────────────────
# CELL 2 — Load Dataset A: at-risk-detection.csv
# (UCI Dropout dataset — your primary source)
# ─────────────────────────────────────────────
import pandas as pd
import numpy as np

# NOTE: This file uses semicolons as delimiters
df_uci = pd.read_csv('at-risk-detection.csv', delimiter=';')

print("=== UCI Dataset ===")
print(f"Shape: {df_uci.shape}")
print(f"Columns: {list(df_uci.columns)}")
print(f"\nTarget value counts:\n{df_uci['Target'].value_counts()}")
print(f"\nFirst row preview:\n{df_uci.head(1).T}")


# ─────────────────────────────────────────────
# CELL 3 — Process Dataset A
# Map Target → binary at_risk label
# ─────────────────────────────────────────────

# Target has 3 values: 'Dropout', 'Graduate', 'Enrolled'
# For Husai: Dropout = at risk (1), everything else = not at risk (0)
df_uci['at_risk'] = (df_uci['Target'] == 'Dropout').astype(int)

# Fix column name with tab/whitespace issue
df_uci.columns = df_uci.columns.str.strip()

# Select the features most relevant to Husai's school data inputs
uci_features = [
    'Age at enrollment',
    'Gender',
    'Scholarship holder',
    'Tuition fees up to date',
    'Displaced',
    'Debtor',
    'Curricular units 1st sem (enrolled)',
    'Curricular units 1st sem (approved)',
    'Curricular units 1st sem (grade)',
    'Curricular units 1st sem (evaluations)',
    'Curricular units 2nd sem (enrolled)',
    'Curricular units 2nd sem (approved)',
    'Curricular units 2nd sem (grade)',
    'Curricular units 2nd sem (evaluations)',
    'at_risk'
]

df_uci_clean = df_uci[uci_features].copy()

# Rename to generic names for merging
df_uci_clean = df_uci_clean.rename(columns={
    'Age at enrollment': 'age',
    'Gender': 'gender',
    'Scholarship holder': 'scholarship',
    'Tuition fees up to date': 'fees_up_to_date',
    'Displaced': 'displaced',
    'Debtor': 'debtor',
    'Curricular units 1st sem (enrolled)': 'units_enrolled_s1',
    'Curricular units 1st sem (approved)': 'units_approved_s1',
    'Curricular units 1st sem (grade)': 'avg_grade_s1',
    'Curricular units 1st sem (evaluations)': 'evaluations_s1',
    'Curricular units 2nd sem (enrolled)': 'units_enrolled_s2',
    'Curricular units 2nd sem (approved)': 'units_approved_s2',
    'Curricular units 2nd sem (grade)': 'avg_grade_s2',
    'Curricular units 2nd sem (evaluations)': 'evaluations_s2',
})

# Derived feature: approval rate (how many enrolled units did the student pass?)
df_uci_clean['approval_rate_s1'] = (
    df_uci_clean['units_approved_s1'] / df_uci_clean['units_enrolled_s1'].replace(0, np.nan)
).fillna(0)
df_uci_clean['approval_rate_s2'] = (
    df_uci_clean['units_approved_s2'] / df_uci_clean['units_enrolled_s2'].replace(0, np.nan)
).fillna(0)

# Tag source for traceability
df_uci_clean['source'] = 'uci'

print(f"\n=== Processed UCI Dataset ===")
print(f"Shape: {df_uci_clean.shape}")
print(f"At-risk distribution:\n{df_uci_clean['at_risk'].value_counts()}")


# ─────────────────────────────────────────────
# CELL 4 — Load Dataset B: merged_dataset.csv
# (Behavioral + engagement signals)
# ─────────────────────────────────────────────
df_behav = pd.read_csv('merged_dataset.csv', delimiter='\t')

print("=== Behavioral Dataset ===")
print(f"Shape: {df_behav.shape}")
print(f"FinalGrade distribution:\n{df_behav['FinalGrade'].value_counts()}")
print(f"\nFirst row preview:\n{df_behav.head(1).T}")


# ─────────────────────────────────────────────
# CELL 5 — Process Dataset B
# FinalGrade → binary at_risk label
# ─────────────────────────────────────────────

# Check what values FinalGrade has
print("Unique FinalGrade values:", df_behav['FinalGrade'].unique())

# If FinalGrade is a letter grade (A/B/C/D/F):
# at_risk = 1 if grade is D or F
if df_behav['FinalGrade'].dtype == object:
    df_behav['at_risk'] = df_behav['FinalGrade'].isin(['D', 'F']).astype(int)
# If FinalGrade is numeric (0-100):
else:
    df_behav['at_risk'] = (df_behav['FinalGrade'] < 60).astype(int)

# Encode categorical columns
df_behav['gender_enc'] = (df_behav['Gender'].str.lower() == 'male').astype(int)

# Map LearningStyle to numeric
learning_style_map = {'visual': 0, 'auditory': 1, 'kinesthetic': 2, 'reading': 3}
df_behav['learning_style_enc'] = df_behav['LearningStyle'].str.lower().map(learning_style_map).fillna(0)

# Select features
behav_features = [
    'StudyHours', 'Attendance', 'Motivation', 'AssignmentCompletion',
    'ExamScore', 'StressLevel', 'Discussions', 'OnlineCourses',
    'gender_enc', 'learning_style_enc', 'at_risk'
]

df_behav_clean = df_behav[behav_features].copy()

# Rename to match common schema
df_behav_clean = df_behav_clean.rename(columns={
    'StudyHours': 'study_hours',
    'Attendance': 'attendance_rate',
    'Motivation': 'motivation_score',
    'AssignmentCompletion': 'assignment_completion',
    'ExamScore': 'avg_grade_s1',           # Treat exam score as proxy for semester grade
    'StressLevel': 'stress_level',
    'Discussions': 'class_participation',
    'OnlineCourses': 'extra_resources',
    'gender_enc': 'gender',
    'learning_style_enc': 'learning_style',
})

df_behav_clean['source'] = 'behavioral'

print(f"\n=== Processed Behavioral Dataset ===")
print(f"Shape: {df_behav_clean.shape}")
print(f"At-risk distribution:\n{df_behav_clean['at_risk'].value_counts()}")


# ─────────────────────────────────────────────
# CELL 6 — Load & Aggregate Dataset C
# (behavioral-engagement-signals — 5 separate files)
# These have Student_ID as the join key
# ─────────────────────────────────────────────

df_students    = pd.read_csv('students.csv', delimiter='\t')
df_attendance  = pd.read_csv('attendance.csv', delimiter='\t')
df_homework    = pd.read_csv('homework.csv', delimiter='\t')
df_performance = pd.read_csv('performance.csv', delimiter='\t')

print("=== Raw file shapes ===")
print(f"students:    {df_students.shape}")
print(f"attendance:  {df_attendance.shape}")
print(f"homework:    {df_homework.shape}")
print(f"performance: {df_performance.shape}")


# ─────────────────────────────────────────────
# CELL 7 — Aggregate the 5-file dataset
# Roll everything up to one row per Student_ID
# ─────────────────────────────────────────────

# --- Attendance: calculate attendance rate per student ---
df_att_agg = df_attendance.groupby('Student_ID').apply(
    lambda x: (x['Attendance_Status'].str.lower() == 'present').sum() / len(x)
).reset_index()
df_att_agg.columns = ['Student_ID', 'attendance_rate']

# --- Homework: calculate completion rate and average grade ---
df_hw_agg = df_homework.groupby('Student_ID').agg(
    assignment_completion=('Status', lambda x: (x.str.lower() == 'submitted').mean()),
    avg_hw_grade=('Grade_Feedback', lambda x: pd.to_numeric(x, errors='coerce').mean())
).reset_index()

# --- Performance: average exam score and homework completion across subjects ---
df_perf_agg = df_performance.groupby('Student_ID').agg(
    avg_grade_s1=('Exam_Score', 'mean'),
    hw_completion_pct=('Homework_Completion_%', 'mean')
).reset_index()

# --- Merge all aggregated tables on Student_ID ---
df_engagement = df_students[['Student_ID', 'Grade_Level']].copy()
df_engagement = df_engagement.merge(df_att_agg, on='Student_ID', how='left')
df_engagement = df_engagement.merge(df_hw_agg, on='Student_ID', how='left')
df_engagement = df_engagement.merge(df_perf_agg, on='Student_ID', how='left')

# Fill missing values with column medians
df_engagement = df_engagement.fillna(df_engagement.median(numeric_only=True))

# Create at_risk label: at risk if avg exam score < 60 OR attendance < 80%
df_engagement['at_risk'] = (
    (df_engagement['avg_grade_s1'] < 60) |
    (df_engagement['attendance_rate'] < 0.8)
).astype(int)

# Select features
df_engagement_clean = df_engagement[[
    'attendance_rate', 'assignment_completion',
    'avg_hw_grade', 'avg_grade_s1', 'hw_completion_pct', 'at_risk'
]].copy()

df_engagement_clean['source'] = 'engagement'

print(f"\n=== Aggregated Engagement Dataset ===")
print(f"Shape: {df_engagement_clean.shape}")
print(f"At-risk distribution:\n{df_engagement_clean['at_risk'].value_counts()}")


# ─────────────────────────────────────────────
# CELL 8 — Load Dataset D: xAPI-Edu-Data.csv
# (Behavioral engagement signals — xAPI)
# ─────────────────────────────────────────────

df_xapi = pd.read_csv('xAPI-Edu-Data.csv')

print("=== xAPI Dataset ===")
print(f"Shape: {df_xapi.shape}")
print(f"Class (target) distribution:\n{df_xapi['Class'].value_counts()}")


# ─────────────────────────────────────────────
# CELL 9 — Process Dataset D
# Class: L (Low) = at risk, M/H = not at risk
# ─────────────────────────────────────────────

df_xapi['at_risk'] = (df_xapi['Class'] == 'L').astype(int)
df_xapi['gender_enc'] = (df_xapi['gender'] == 'M').astype(int)
df_xapi['absent_enc'] = (df_xapi['StudentAbsenceDays'] == 'Above-7').astype(int)
df_xapi['parent_engaged'] = (df_xapi['ParentAnsweringSurvey'] == 'Yes').astype(int)

df_xapi_clean = df_xapi[[
    'raisedhands', 'VisITedResources', 'AnnouncementsView',
    'Discussion', 'absent_enc', 'parent_engaged',
    'gender_enc', 'at_risk'
]].rename(columns={
    'raisedhands': 'class_participation',
    'VisITedResources': 'resources_accessed',
    'AnnouncementsView': 'announcements_viewed',
    'Discussion': 'discussion_posts',
    'absent_enc': 'high_absence',
    'parent_engaged': 'parent_engagement',
    'gender_enc': 'gender',
})

df_xapi_clean['source'] = 'xapi'

print(f"\n=== Processed xAPI Dataset ===")
print(f"Shape: {df_xapi_clean.shape}")
print(f"At-risk distribution:\n{df_xapi_clean['at_risk'].value_counts()}")


# ─────────────────────────────────────────────
# CELL 10 — Merge All 4 Datasets
# Use outer merge on shared columns, fill gaps with NaN
# ─────────────────────────────────────────────

# All datasets have 'at_risk' and 'source' — merge on shared feature columns
# Features common across most datasets:
SHARED_FEATURES = [
    'avg_grade_s1',       # Exam / semester grade
    'attendance_rate',    # Attendance percentage
    'assignment_completion',  # Homework / assignment completion
    'class_participation',    # Engagement in class
    'gender',             # Gender (encoded as 0/1)
    'at_risk',
    'source'
]

# Align each dataset to shared features (missing columns become NaN)
def align_df(df, features):
    for col in features:
        if col not in df.columns:
            df[col] = np.nan
    return df[features]

df_combined = pd.concat([
    align_df(df_uci_clean.copy(), SHARED_FEATURES),
    align_df(df_behav_clean.copy(), SHARED_FEATURES),
    align_df(df_engagement_clean.copy(), SHARED_FEATURES),
    align_df(df_xapi_clean.copy(), SHARED_FEATURES),
], ignore_index=True)

print(f"\n=== COMBINED DATASET ===")
print(f"Total records: {df_combined.shape[0]}")
print(f"Features: {df_combined.shape[1]}")
print(f"\nSource breakdown:\n{df_combined['source'].value_counts()}")
print(f"\nAt-risk distribution:\n{df_combined['at_risk'].value_counts()}")
print(f"\nMissing values per column:\n{df_combined.isnull().sum()}")


# ─────────────────────────────────────────────
# CELL 11 — Handle Missing Values
# ─────────────────────────────────────────────

# For numeric columns: fill with column median
numeric_cols = df_combined.select_dtypes(include=[np.number]).columns.tolist()
numeric_cols = [c for c in numeric_cols if c != 'at_risk']

df_combined[numeric_cols] = df_combined[numeric_cols].fillna(
    df_combined[numeric_cols].median()
)

# Drop source column before training
df_final = df_combined.drop(columns=['source'])

print(f"\n=== FINAL DATASET (ready for training) ===")
print(f"Shape: {df_final.shape}")
print(f"Missing values: {df_final.isnull().sum().sum()} (should be 0)")
print(f"\nAt-risk class balance:")
print(df_final['at_risk'].value_counts())
print(f"\nClass ratio: {df_final['at_risk'].mean():.2%} at-risk")


# ─────────────────────────────────────────────
# CELL 12 — Save merged dataset to Drive
# ─────────────────────────────────────────────

import os
os.makedirs('/content/drive/MyDrive/husai', exist_ok=True)

df_final.to_csv('/content/drive/MyDrive/husai/husai_merged_dataset.csv', index=False)
print("Saved to Google Drive: husai_merged_dataset.csv")
print("\nStep 3 complete. Proceed to Step 4 (SMOTE + Model Training).")

---

### Step 4 — Handle Class Imbalance with SMOTE

```python
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE

X = df.drop('at_risk', axis=1)
y = df['at_risk']

# Split BEFORE applying SMOTE — never apply SMOTE to test data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Apply SMOTE only on training data
smote = SMOTE(random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

print(f"Before SMOTE: {y_train.value_counts().to_dict()}")
print(f"After SMOTE:  {pd.Series(y_train_resampled).value_counts().to_dict()}")
```

---

### Step 5 — Train LightGBM with Optuna Hyperparameter Tuning

```python
import lightgbm as lgb
import optuna
from sklearn.metrics import f1_score, roc_auc_score, classification_report

def objective(trial):
    params = {
        'objective': 'binary',
        'metric': 'binary_logloss',
        'verbosity': -1,
        'boosting_type': 'gbdt',
        'num_leaves': trial.suggest_int('num_leaves', 20, 150),
        'max_depth': trial.suggest_int('max_depth', 3, 12),
        'learning_rate': trial.suggest_float('learning_rate', 1e-4, 0.3, log=True),
        'n_estimators': trial.suggest_int('n_estimators', 100, 1000),
        'min_child_samples': trial.suggest_int('min_child_samples', 5, 100),
        'subsample': trial.suggest_float('subsample', 0.5, 1.0),
        'colsample_bytree': trial.suggest_float('colsample_bytree', 0.5, 1.0),
        'reg_alpha': trial.suggest_float('reg_alpha', 1e-8, 10.0, log=True),
        'reg_lambda': trial.suggest_float('reg_lambda', 1e-8, 10.0, log=True),
    }

    model = lgb.LGBMClassifier(**params, random_state=42)
    model.fit(X_train_resampled, y_train_resampled)
    preds = model.predict(X_test)
    return f1_score(y_test, preds)

# Run Optuna — 50 trials is a good starting point
study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=50, show_progress_bar=True)

print(f"\nBest F1: {study.best_value:.4f}")
print(f"Best params: {study.best_params}")
```

---

### Step 6 — Train Final Model and Evaluate

```python
# Train with best params
best_model = lgb.LGBMClassifier(**study.best_params, random_state=42)
best_model.fit(X_train_resampled, y_train_resampled)

# Evaluate
y_pred = best_model.predict(X_test)
y_prob = best_model.predict_proba(X_test)[:, 1]

print(classification_report(y_test, y_pred, target_names=['Not At Risk', 'At Risk']))
print(f"ROC-AUC: {roc_auc_score(y_test, y_prob):.4f}")
```

---

### Step 7 — Add SHAP Explainability

This is critical for Husai — teachers need to understand *why* a student was flagged.

```python
import shap
import matplotlib.pyplot as plt

explainer = shap.TreeExplainer(best_model)
shap_values = explainer.shap_values(X_test)

# Summary plot — shows which features matter most globally
shap.summary_plot(shap_values[1], X_test, plot_type="bar")
plt.savefig('/content/drive/MyDrive/husai/shap_summary.png', bbox_inches='tight')

# For a single student explanation (what you'll show in the teacher view)
def explain_student(student_index):
    shap.force_plot(
        explainer.expected_value[1],
        shap_values[1][student_index],
        X_test.iloc[student_index],
        matplotlib=True
    )
    plt.savefig(f'/content/drive/MyDrive/husai/student_{student_index}_explanation.png')
```

---

### Step 8 — Save the Model

```python
import joblib

# Save model
joblib.dump(best_model, '/content/drive/MyDrive/husai/at_risk_model.pkl')
print("Model saved.")

# Save feature names for inference
import json
with open('/content/drive/MyDrive/husai/feature_names.json', 'w') as f:
    json.dump(list(X.columns), f)
```

---

### Expected Performance Targets
Based on Bertolini et al. (2024) and Kim et al. (2023):

| Metric | Target |
|---|---|
| F1-Score | > 0.84 |
| ROC-AUC | > 0.90 |
| Recall (at-risk class) | > 0.85 |
| Precision | > 0.80 |

> **Note on recall vs precision:** For Husai, we prioritize **recall** (catching all at-risk students) over precision (avoiding false positives). A missed at-risk student is worse than a false flag that a teacher can dismiss.

---

---

## Model 2 — Report Generation Engine (Llama 3 QLoRA Fine-Tune)

### What It Does
Takes structured student data as input (grades, attendance, teacher notes) and outputs a filled DepEd-formatted narrative — SF9 remarks, progress reports, and school health summaries. Teachers review and approve in seconds instead of writing from scratch.

### Research Basis
Fine-tuning a pre-trained LLM on domain-specific instruction pairs is the established best practice for narrow document generation tasks (Razafinirina et al., 2024). QLoRA — loading the model in 4-bit and training only low-rank adapter matrices — achieves performance comparable to full fine-tuning while fitting in a single Colab GPU (Dettmers et al., 2023, via Unsloth implementation). Guo et al. (2024) demonstrated that fine-tuned LLMs on structured student data can generate effective and accurate evaluation narratives.

### Why QLoRA over Full Fine-Tuning
Full fine-tuning of Llama 3 8B requires multiple 80GB A100s and weeks of training. QLoRA reduces memory by ~4× through 4-bit quantization and trains only ~1% of parameters via LoRA adapters — making it feasible on a single T4 or A100 Colab GPU (Unsloth benchmarks: 13.7%–73.8% memory savings vs. standard training).

---

### Step 1 — Prepare Your Training Dataset

You need to build this dataset yourself — it doesn't exist publicly because DepEd formats are specific to the Philippines. This is your competitive moat.

**Format:** JSONL instruction pairs. Each record looks like this:

```json
{
  "instruction": "Generate an SF9 quarterly narrative for the following student.",
  "input": "Name: Maria Santos | Grade: 5 | Section: Rizal | Quarter: Q1 | Math: 85 | Science: 78 | Filipino: 90 | English: 82 | MAPEH: 88 | Attendance: 44/45 days | Teacher notes: Participates actively in class discussions. Needs improvement in fractions.",
  "output": "Maria Santos demonstrated satisfactory performance in Grade 5 during the First Quarter. She showed strength in Filipino and MAPEH, earning grades of 90 and 88, respectively. Her attendance record was excellent at 44 out of 45 school days. Areas for continued development include Mathematics, particularly in fraction operations, where targeted review is recommended. Maria's active participation in class discussions is commendable and contributes positively to classroom dynamics."
}
```

**How to build 500+ training pairs quickly:**
1. Collect 20–30 sample DepEd SF9 narratives from willing teachers (anonymized)
2. Use Claude API to generate synthetic variations: *"Given this student data JSON, generate 10 different SF9 narrative variations in DepEd format"*
3. Clean and format into JSONL
4. Aim for 500–1,000 pairs minimum; 2,000+ for best results

**Save as:** `husai_sf9_dataset.jsonl` and upload to your Google Drive.

---

### Step 2 — Set Up Colab (Use A100 Runtime if on Colab Pro)

```
Runtime → Change runtime type → GPU → A100 (Colab Pro)
```

```python
# Cell 1 — Install Unsloth (fastest QLoRA library for Colab)
!pip install unsloth[cu118] -U
!pip install accelerate bitsandbytes transformers trl datasets

# Cell 2 — Mount Drive
from google.colab import drive
drive.mount('/content/drive')
```

---

### Step 3 — Load Llama 3 8B in 4-bit (QLoRA)

```python
from unsloth import FastLanguageModel
import torch

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Meta-Llama-3.1-8B-Instruct",
    max_seq_length=2048,
    dtype=None,           # Auto-detect: float16 for T4, bfloat16 for A100
    load_in_4bit=True,    # QLoRA: cuts VRAM by ~4x
)

print(f"Model loaded. GPU memory used: {torch.cuda.memory_allocated() / 1e9:.2f} GB")
```

---

### Step 4 — Add LoRA Adapters

```python
model = FastLanguageModel.get_peft_model(
    model,
    r=16,                  # LoRA rank — higher = more capacity, more memory
    lora_alpha=16,         # Scaling factor — usually set equal to r
    lora_dropout=0,        # 0 is optimized for Unsloth
    bias="none",
    target_modules=[
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj"
    ],
    use_gradient_checkpointing="unsloth",  # Reduces VRAM by ~30%
    random_state=42,
)

# Check trainable parameters
trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
total = sum(p.numel() for p in model.parameters())
print(f"Trainable params: {trainable:,} / {total:,} ({100 * trainable / total:.2f}%)")
# Expected: ~1% trainable — that's correct for LoRA
```

---

### Step 5 — Load and Format Your Dataset

```python
from datasets import load_dataset

# Load your JSONL dataset from Drive
dataset = load_dataset(
    'json',
    data_files='/content/drive/MyDrive/husai/husai_sf9_dataset.jsonl',
    split='train'
)

# Format as instruction prompt
alpaca_prompt = """Below is an instruction that describes a task, paired with input data. Write a response that appropriately completes the request.

### Instruction:
{}

### Input:
{}

### Response:
{}"""

EOS_TOKEN = tokenizer.eos_token

def format_prompts(examples):
    instructions = examples["instruction"]
    inputs = examples["input"]
    outputs = examples["output"]
    texts = []
    for inst, inp, out in zip(instructions, inputs, outputs):
        text = alpaca_prompt.format(inst, inp, out) + EOS_TOKEN
        texts.append(text)
    return {"text": texts}

dataset = dataset.map(format_prompts, batched=True)
print(f"Dataset size: {len(dataset)} examples")
```

---

### Step 6 — Train

```python
from trl import SFTTrainer
from transformers import TrainingArguments

trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset,
    dataset_text_field="text",
    max_seq_length=2048,
    dataset_num_proc=2,
    packing=False,
    args=TrainingArguments(
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,     # Effective batch size = 8
        warmup_steps=10,
        num_train_epochs=3,
        learning_rate=2e-4,
        fp16=not torch.cuda.is_bf16_supported(),
        bf16=torch.cuda.is_bf16_supported(),
        logging_steps=10,
        optim="adamw_8bit",
        lr_scheduler_type="cosine",
        output_dir="/content/drive/MyDrive/husai/llama3_sf9_checkpoints",
        save_strategy="epoch",
        report_to="none",
    ),
)

# Start training
trainer_stats = trainer.train()
print(f"\nTraining complete. Loss: {trainer_stats.training_loss:.4f}")
```

---

### Step 7 — Test the Model

```python
FastLanguageModel.for_inference(model)

test_input = alpaca_prompt.format(
    "Generate an SF9 quarterly narrative for the following student.",
    "Name: Juan dela Cruz | Grade: 6 | Quarter: Q2 | Math: 72 | Science: 68 | Filipino: 85 | English: 74 | Attendance: 38/45 | Teacher notes: Struggles with reading comprehension. Attendance has declined this quarter.",
    ""  # Leave blank — model will generate this
)

inputs = tokenizer([test_input], return_tensors="pt").to("cuda")
outputs = model.generate(
    **inputs,
    max_new_tokens=300,
    temperature=0.7,
    do_sample=True,
)
print(tokenizer.decode(outputs[0], skip_special_tokens=True).split("### Response:")[-1])
```

---

### Step 8 — Save and Export

```python
# Save LoRA adapter weights only (small — a few hundred MB)
model.save_pretrained("/content/drive/MyDrive/husai/llama3_sf9_lora")
tokenizer.save_pretrained("/content/drive/MyDrive/husai/llama3_sf9_lora")

# Optional: Merge and export as full model (larger — ~16GB)
model.save_pretrained_merged(
    "/content/drive/MyDrive/husai/llama3_sf9_merged",
    tokenizer,
    save_method="merged_16bit"
)
print("Model saved.")
```

---

### Expected Performance Targets

| Metric | Target |
|---|---|
| Training loss | < 1.0 after 3 epochs |
| Narrative coherence (human eval) | > 4/5 by 3 teacher reviewers |
| DepEd format compliance | 100% (all required fields filled) |
| Generation time per student | < 3 seconds |

---

---

## Model 3 — Learning Gap Classifier (BERT)

### What It Does
Maps incorrect quiz and assessment responses to DepEd MELC (Most Essential Learning Competency) codes. Identifies *which specific competency* a student is missing — not just that they failed a subject.

### Dataset

**Dataset — Student Assessment / Quiz Performance**
- Name: *Student Performance Data Set (Math, Portuguese)*
- Source: UCI / Kaggle
- URL: https://www.kaggle.com/datasets/larsen0966/student-performance-data-set
- Features: Subject grades broken into component scores, study habits, absences
- Original paper: Cortez, P. & Silva, A. (2008). Using Data Mining to Predict Secondary School Student Performance. EUROSIS.

You will also need to create a small MELC mapping file manually — a CSV that maps quiz topic tags to DepEd MELC codes. This is straightforward since DepEd publishes the MELC framework publicly at: https://www.deped.gov.ph/

---

### Training Steps (Abbreviated)

```python
# Install
!pip install transformers datasets scikit-learn torch

from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments
from datasets import Dataset
import torch

# Load BERT
tokenizer = BertTokenizer.from_pretrained('bert-base-multilingual-cased')
# Use multilingual BERT — it handles Filipino/Tagalog text in teacher notes
model = BertForSequenceClassification.from_pretrained(
    'bert-base-multilingual-cased',
    num_labels=NUM_MELC_CODES  # Set to number of MELC competency codes in your mapping
)

# Format: input = quiz question text + student answer tag
# label = MELC competency code index
def tokenize(examples):
    return tokenizer(examples['text'], truncation=True, padding='max_length', max_length=128)

# Train using HuggingFace Trainer (same pattern as Llama, but much lighter)
training_args = TrainingArguments(
    output_dir='/content/drive/MyDrive/husai/bert_melc',
    num_train_epochs=5,
    per_device_train_batch_size=16,
    learning_rate=2e-5,
    evaluation_strategy='epoch',
    save_strategy='epoch',
    fp16=True,
)
```

> Full BERT training for classification on T4 Colab takes ~30–60 minutes with a dataset of 5,000+ examples. The MELC mapping CSV you create is the most important artifact here — time spent on that is time well spent.

---

---

## Colab Runtime Guide

| Model | Recommended Runtime | Free Tier Viable? | Notes |
|---|---|---|---|
| LightGBM (Model 1) | T4 GPU or CPU | ✅ Yes | Fast even on CPU |
| Llama 3 QLoRA (Model 2) | A100 (Colab Pro) | ⚠️ T4 works but slow | Use Unsloth for T4 |
| BERT Classifier (Model 3) | T4 GPU | ✅ Yes | Trains in < 1 hr |

**Tips for managing Colab sessions:**
- Mount Google Drive at the start of every session — Colab resets storage
- Save checkpoints every epoch (`save_strategy="epoch"`) so you never lose progress on a disconnect
- For Llama 3 on T4: reduce `per_device_train_batch_size` to 1 and increase `gradient_accumulation_steps` to 8 to avoid OOM errors
- Use `torch.cuda.empty_cache()` between cells if you're running out of VRAM

---

## Summary: Dataset Directory

| Dataset | Model | Source | License |
|---|---|---|---|
| UCI Dropout & Academic Success | At-Risk (Model 1) | https://archive.ics.uci.edu/dataset/697 | CC BY 4.0 |
| Student Performance & Attendance | At-Risk (Model 1) | https://www.kaggle.com/datasets/marvyaymanhalim/student-performance-and-attendance-dataset | Kaggle |
| Zenodo Learning Behavior (14k records) | At-Risk (Model 1) | https://zenodo.org/records/16459132 | Open Access |
| xAPI Edu-Data | At-Risk (Model 1) | https://www.kaggle.com/datasets/aljarah/xAPI-Edu-Data | CC BY 4.0 |
| Student Performance (Math/Portuguese) | BERT (Model 3) | https://www.kaggle.com/datasets/larsen0966/student-performance-data-set | CC BY 4.0 |
| SF9/SF10 instruction pairs | Llama 3 (Model 2) | **Build yourself** — collect from teachers + synthetic generation | Proprietary |
| DepEd MELC Framework | BERT labels | https://www.deped.gov.ph/ | Public domain |

---

## References

- Bertolini, R., et al. (2024). *Supervised machine learning algorithms for predicting student dropout and academic success: a comparative study.* Discover Artificial Intelligence, Springer Nature. https://link.springer.com/article/10.1007/s44163-023-00079-z

- Dettmers, T., et al. (2023). *QLoRA: Efficient Finetuning of Quantized LLMs.* arXiv:2305.14314. https://arxiv.org/abs/2305.14314

- Guo, X., et al. (2024). *Harnessing large language models to auto-evaluate student project reports.* Computers and Education: Artificial Intelligence. https://www.sciencedirect.com/science/article/pii/S2666920X24000717

- Hu, E. J., et al. (2021). *LoRA: Low-Rank Adaptation of Large Language Models.* arXiv:2106.09685. https://arxiv.org/abs/2106.09685

- Kim, J., et al. (2023). *A Study on Dropout Prediction for University Students Using Machine Learning.* Applied Sciences, 13(21), 12004. MDPI. https://www.mdpi.com/2076-3417/13/21/12004

- Masood, S. W., et al. (2024). *Optimised SMOTE-based Imbalanced Learning for Student Dropout Prediction.* Arabian Journal for Science and Engineering. https://doi.org/10.1007/s13369-024-09026-1

- Razafinirina, M. A., et al. (2024). *Large Language Models for Education: Survey, Trends and Challenges.* Journal of Intelligent Learning Systems and Applications, 16, 448–480. https://www.scirp.org/pdf/jilsa2024164_79601651.pdf

- Realinho, V., et al. (2021). *Predict Students' Dropout and Academic Success* [Dataset]. UCI ML Repository. https://doi.org/10.24432/C5MC89

- Ullah, I., et al. (2024). *A novel AI-driven model for student dropout risk analysis with explainable AI insights.* Computers and Education: Artificial Intelligence. https://www.sciencedirect.com/science/article/pii/S2666920X24001553

---

*Husai Training Guide v1.0 — For internal use*
