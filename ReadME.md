# HUSAI
### AI-Powered School Intelligence Platform
*High-Level Concept Document v2.0*
*Prepared for the Google.org × Claude.ai Build for Good Competition*

---

## 1. Executive Summary

Husai is an AI-powered school intelligence platform that solves the most persistent operational crisis in public education: teachers drowning in administrative work while student learning data disappears into a black hole.

A single public school teacher in the Philippines manages an average of 100+ students. Between maintaining class records, compliance reports, grading, and parent communication — teachers spend nearly **18 hours per week** on ancillary duties alone, almost double the 10 hours prescribed by DepEd (Walker, 2024). Meanwhile, student performance data is scattered, inconsistent, or simply never recorded.

Husai addresses both sides of this crisis simultaneously through four interconnected views:

- **Student View** — individual learning profiles with longitudinal progress tracking and AI-generated personal insights
- **Teacher View** — class-wide intelligence, at-risk flags, auto-generated records, and Mahusai Insights
- **Admin View** — school-wide performance dashboard and early warning signals
- **DepEd View** *(future roadmap)* — national heatmap, solving the data black hole at scale

Beyond the school, Husai's long-term vision is to become **national education infrastructure** — a living dataset that powers urban planning, resource allocation, policy research, and societal prediction models at a scale never before possible in the Philippines.

The Philippines is the beachhead. The problem — and the opportunity — is universal.

---

## 2. The Problem

### 2.1 Teacher Administrative Overload

Philippine public school teachers frequently carry non-teaching duties that limit the time and energy they can dedicate to actual instruction (Abasola, 2024). A report by the Philippine Institute for Development Studies (PIDS) highlighted that Filipino teachers spend a significant portion of their working hours on non-teaching tasks, which limits their ability to focus on lesson planning and student engagement (Cigaral, 2019 as cited in GSJ, 2025).

Tarraya (2023) revealed that administrative workload is one of the leading causes of inefficiency in teaching. A study surveying over 2,000 schools and 15,000 teachers nationwide found that despite DepEd Order No. 002 s. 2024 — which mandates the immediate removal of administrative tasks from teachers — many teachers remain overburdened with non-teaching duties (Walker, 2024). Excessive ancillary duties often compromise instructional quality, forcing teachers to sacrifice lesson preparation and personal time (IJRISS, 2025). Reyes and Cruz found that excessive administrative burdens contribute to teacher attrition in the Philippines (as cited in IJRISS, 2025).

The EDCOM 2 report (2025) further confirmed that compliance with departmental orders has been challenging for schools as current levels of administrative work outweigh the availability of support staff, resulting in work falling back onto teachers.

### 2.2 The Student Data Black Hole

Because manual record-keeping is so burdensome, student performance data is either recorded inconsistently, never analyzed for trends, or lost entirely. A 2020 study by the Department of Education identified a negative relationship between teachers' workloads and student achievement, suggesting that teachers burdened with excessive work are less effective in delivering instruction (RA 9155 study as cited in Instabrightgazette, 2024).

A student who begins struggling in Grade 4 may not be identified until Grade 6 — if at all. At national scale, this compounds into systemic underperformance with no data trail to diagnose or address it.

### 2.3 The Problem Is Global

The Philippines is not an outlier. Teacher-to-student ratios, administrative overload, and fragmented recordkeeping systems are documented in Indonesia, India, sub-Saharan Africa, and underfunded schools across the United States and Europe. Husai is built with the Philippines as its first market and global scale as its design target.

---

## 3. The Solution

Husai is an AI administrative layer that sits quietly behind the scenes. Teachers do not change how they work. The platform intelligently collects, organizes, and surfaces the data that already exists in a school, then uses AI to turn that data into action.

**Core design principle:** zero new behavior required from teachers. If a teacher grades a quiz, that is a data point. If a teacher takes attendance, that is a data point. Husai aggregates all of it passively.

### 3.1 The JSON-First Data Architecture

Every piece of student and class data in Husai is normalized into a **single structured JSON snapshot** per student per quarter, and per class per quarter. This is the single source of truth that all downstream features consume — AI insights, UI rendering, SF9/SF10 generation, admin dashboards, and future DepEd exports all read from the same object.

```
DB → JSON Snapshot → (1) Mahusai Insights (Claude API)
                     (2) Student & Teacher UI rendering
                     (3) SF9 / SF10 auto-generation (Llama 3)
                     (4) Admin & school dashboards
                     (5) At-risk model inference (LightGBM)
                     (6) Future: DepEd national data pipeline
                     (7) Future: Urban planning & policy models
```

This architecture means adding a new feature never requires rebuilding the data layer — it just reads the JSON. The same snapshot that feeds a teacher's dashboard can feed a national planning model without duplication or reformatting.

**Student snapshot schema (abbreviated):**
```json
{
  "meta": { "student_id", "quarter", "school_year", "generated_at" },
  "profile": { "name", "grade", "section", "school", "adviser" },
  "grades": { "Math": { "q1", "q2", "q3", "trend" }, "..." },
  "gwa": { "q1", "q2", "q3" },
  "attendance": { "present", "absences", "rate", "status" },
  "flags": { "at_risk", "risk_score", "risk_factors" },
  "achievements": [ { "label", "subject", "quarter" } ],
  "insights": null
}
```

`insights` starts as `null` and is populated after the Claude API call, then written back into the snapshot. Everything else is generated directly from the database.

---

## 4. Product Views

### 👩‍🎓 Student View
**Audience:** K-12 students

- Personal learning profile — grades, attendance, and performance trends over time
- Subject-level breakdown showing areas of strength and areas needing improvement
- Quarter-over-quarter progress indicators, not just snapshots
- **Mahusai Insights** — AI-generated personal insight cards surfacing what the student is doing well and where they need to focus, referencing DepEd MELC codes where relevant
- Accessible on mobile, no app install required, works on 3G connections

### 👩‍🏫 Teacher View
**Audience:** Public and private school teachers

- Entire class roster in a single view — 100+ students, fully organized
- AI-generated at-risk flags: color-coded High / Medium risk based on GWA + absences
- Class statistics: total students, passing count, at-risk count, class GWA, attendance rate, perfect scores — all computed from the class JSON snapshot
- Quick data entry: quiz scores, attendance, observations — minimal taps required
- Auto-populated DepEd records (SF9, SF10) generated directly from the student JSON snapshot
- **Mahusai Class Intelligence** — AI-generated class-level insight cards surfacing MELC weaknesses, students needing immediate intervention, and class-wide wins

### 🏫 Admin View
**Audience:** School principals and administrators

- School-wide performance dashboard: passing rates, attendance trends, grade distributions
- Section-vs-section comparisons to identify high- and low-performing classes
- AI-generated monthly school health narrative, auto-produced for stakeholders
- Dropout risk radar: students flagged across multiple indicators simultaneously
- Historical trend analysis comparing current year to prior years

### 🇵🇭 DepEd View *(Future Roadmap)*
**Audience:** DepEd regional and national officers

- National school performance heatmap, visualized by region, province, and municipality
- Real-time identification of lowest-performing areas — not annual surveys
- Drill-down from national → regional → school → classroom → individual student
- Automated national reporting feeding directly into DepEd compliance systems
- Resource allocation intelligence: flag schools needing teacher deployment or intervention

---

## 5. Mahusai Insights

Mahusai Insights is Husai's AI-generated contextual intelligence layer — the feature visible in the student and teacher UI that translates raw data into plain-language, actionable observations.

### How It Works

```
JSON Snapshot → Structured prompt → Claude API → Parsed insight cards → Cached in DB
```

No student PII is ever sent to the API. The JSON passed to Claude contains only academic signals (grade trends, attendance rates, risk flags) — never names, IDs, or personal information.

### Student Insight Cards

Each student receives 3 insight cards per quarter:

| Card Type | Trigger Condition | Example Output |
|---|---|---|
| `alert` | Grade dropped 5+ points vs prior quarter | "Math score dropped 8 pts since Q1. Focus: fractions & word problems (MELC M5NS-IIf)." |
| `strength` | Consistent improvement or highest subject grade | "Filipino improved consistently — now at 91. Excellent reading performance." |
| `info` | Attendance note or neutral observation | "3 absences this quarter — at 90.4%, within DepEd's required threshold." |

### Teacher / Class Intelligence Cards

Teachers receive 4 class-level cards generated from the class JSON snapshot:

| Card Type | Trigger Condition |
|---|---|
| `critical` | Multiple students declining 2+ consecutive quarters |
| `warning` | A specific MELC competency with >50% of class scoring below 75 |
| `info` | Neutral observation with a recommendation |
| `positive` | Subject or metric where the class is measurably improving |

### Caching Strategy

Insights are cached alongside a hash of the source JSON. They regenerate only when underlying data changes or the teacher manually requests a refresh — keeping API costs predictable at scale.

### What Mahusai Insights Is Not

Mahusai Insights does not replace the at-risk ML model. The LightGBM model produces the `risk_score` and `risk_factors` written into the JSON snapshot. Mahusai Insights reads those outputs and translates them into language a teacher can act on. The ML model does the prediction; Mahusai Insights does the communication.

---

## 6. AI Architecture

Husai uses a **hybrid AI architecture** — purpose-trained ML models for prediction, a fine-tuned LLM for document generation, and a frontier LLM API for insight generation and natural language querying.

### 6.1 At-Risk Detection Engine (Custom-Trained LightGBM)

Predicts student dropout and academic decline risk from attendance, grade trends, submission rates, and behavioral signals. Outputs a 0–1 risk score and a SHAP explanation of contributing factors written into the JSON snapshot.

Training our own model captures Philippine-specific context: DepEd grading periods, class sizes of 100+, quarterly promotion policies, and regional variance that global datasets do not reflect. LightGBM with Optuna tuning outperforms all classical methods on structured student data (Bertolini et al., 2024). SMOTE handles class imbalance inherent in dropout datasets.

### 6.2 Report Generation Engine (Fine-Tuned Llama 3 via QLoRA)

Takes the student JSON snapshot as input and outputs DepEd-formatted narratives — SF9 remarks, progress reports, and school health summaries. Self-hosted via QLoRA fine-tuning so student data never leaves Husai's infrastructure.

Off-the-shelf LLMs do not know DepEd SF9/SF10 formats natively. Fine-tuning on instruction pairs formatted as `{student JSON} → {SF9 narrative}` achieves format compliance that prompt engineering alone cannot guarantee (Guo et al., 2024; Razafinirina et al., 2024).

### 6.3 Learning Gap Classifier (Fine-Tuned Multilingual BERT)

Maps quiz and assessment responses to DepEd MELC competency codes. Uses `bert-base-multilingual-cased` to handle Filipino and Taglish text in teacher notes alongside English subject content.

### 6.4 Mahusai Insights Engine (Claude API)

Generates student and class-level insight cards from the JSON snapshot. Prompt-engineered to reference MELC codes when flagging weaknesses, use a warm tone for students, and a direct professional tone for teachers. Only anonymized academic signals are sent — never PII.

### 6.5 Natural Language Query Interface (Claude API)

Translates plain-language questions from teachers and admins into structured DB queries via tool-calling. Only schema definitions are sent to the API — never student records.

### 6.6 AI Architecture Summary

| Component | Approach | Where It Runs |
|---|---|---|
| At-Risk Detection | Custom LightGBM + SHAP | Self-hosted |
| Report Generation | Fine-tuned Llama 3 8B (QLoRA) | Self-hosted |
| Learning Gap Analysis | Fine-tuned multilingual BERT | Self-hosted |
| Mahusai Insights | Claude API + JSON prompt | API (no PII sent) |
| NL Query Interface | Claude API + tool-calling | API (no PII sent) |
| Explainability | SHAP values → JSON snapshot | Self-hosted |

---

## 7. Long-Term Vision: From School Data to National Intelligence

The most consequential long-term opportunity in Husai is not the school product — it is the **national dataset** that the school product creates.

### 7.1 The Dataset Nobody Has

Every school using Husai contributes anonymized, structured, longitudinal data: student performance trends by grade level, subject, region, and demographic. As Husai scales to thousands of schools, it becomes the first unified, real-time education dataset in Philippine history. No government agency, research institution, or private company currently has this.

### 7.2 What This Data Enables Beyond Education

Once sufficient data accumulates at national scale, Husai's dataset becomes an input layer for models that go far beyond school performance:

**Urban Planning & Infrastructure**
Train models that predict which barangays will face school-age population surges, where classroom and teacher shortages will emerge before they become crises, and how to prioritize school construction. Education enrollment is one of the most reliable leading indicators of urban growth.

**Economic Mobility & Poverty Prediction**
Model the relationship between early learning performance signals and regional labor market outcomes. Identify communities at highest risk of persistent poverty cycles — informing where conditional cash transfers (4Ps) or targeted skills programs should be deployed.

**Public Health Correlation**
Cross-reference attendance pattern drops with DOH regional health data to detect early signals of illness outbreaks affecting school-age children — a real-time epidemiological signal that currently does not exist at this resolution.

**Workforce & Skills Forecasting**
Predict regional skills gaps 5–10 years out based on MELC performance trends by subject and grade. Inform TESDA and higher education institutions about which competencies need the most investment in specific regions before the gap becomes a crisis.

**Disaster & Climate Resilience**
Track which schools and communities show the sharpest learning disruption following typhoons, floods, or other climate events. Build an evidence base for education resilience policy and emergency learning continuity programs.

### 7.3 How It Works Technically

All models trained on national Husai data operate on **fully anonymized, aggregated data** — never individual student records:

```
School-level JSON snapshots
    → Anonymization & aggregation pipeline
        → National data warehouse
            → Research & policy prediction models
            → Urban planning APIs (consumed by LGUs and DPWH)
            → DepEd policy dashboard
            → Research partnerships (PIDS, UP, ADB, World Bank)
```

Data governance is built in from day one: schools own their data, DepEd has read access to aggregated national views, and no individual student record is ever exposed beyond the school level.

### 7.4 The Compounding Value Flywheel

```
More schools onboarded
    → More data accumulated
        → Better at-risk models       (benefits schools directly)
        → Better urban planning inputs (benefits LGUs and government)
        → Stronger policy evidence     (benefits DepEd and researchers)
        → More institutional buy-in
            → More schools onboarded
```

Each new school makes every existing model smarter. The data network effect is the compounding moat that makes Husai defensible at scale.

---

## 8. Competition Alignment

### Google.org Focus Areas

| Focus Area | How Husai Addresses It |
|---|---|
| Knowledge, Skills & Learning | Directly expands access to quality education data for students, teachers, and policymakers — enabling better outcomes through visibility and early intervention |
| Stronger Communities | Empowers schools and local government to respond to educational crises before they compound. National data layer enables urban planning and community resilience models that strengthen communities beyond the classroom. |
| Scientific Progress | Builds the first unified, real-time national education dataset in the Philippines — enabling research-backed policy decisions and cross-sector societal prediction models for urban planning, public health, and economic mobility |

### AI Awareness Among 1,000+ Community Members

- Teacher onboarding workshops — every teacher who uses Husai becomes an informed AI user
- Mahusai Insights for students — builds AI literacy naturally by surfacing why flags were made
- Parent summaries in plain Filipino — introduces parents to AI-assisted education
- DepEd pilot program — government partnership amplifies reach to thousands of schools rapidly
- LGU and research partnerships for the national data layer — extends AI awareness to urban planners and policymakers

---

## 9. Impact Projections

### Short-Term (Year 1)
- Reduce teacher administrative time by an estimated 40–60% per grading period
- Give every enrolled student a documented longitudinal learning profile
- Enable schools to identify at-risk students weeks earlier than current manual processes allow
- Pilot with 10–50 public schools in Metro Manila

### Medium-Term (Year 2–3)
- Scale to all 47,000+ public schools in the Philippines
- Provide DepEd with the first live, unified national education data layer
- Begin anonymized data partnerships with PIDS, UP, and ADB for policy research
- First urban planning and economic mobility models trained on Husai national dataset

### Long-Term (Year 4–5)
- Expand internationally to Indonesia, Vietnam, and India with localized compliance formats
- Become foundational infrastructure for evidence-based education policy in Southeast Asia
- National dataset powering urban planning, workforce forecasting, and public health correlation models
- First country-level education intelligence platform built bottom-up from classroom data

---

## 10. MVP Scope

| Feature | Included in MVP |
|---|---|
| Student View: profile, grades, attendance, subject breakdown | ✅ |
| Mahusai Insights: student insight cards (alert / strength / info) | ✅ |
| Teacher View: roster, at-risk flags, class statistics, quick data entry | ✅ |
| Mahusai Class Intelligence: class insight cards | ✅ |
| SF9/SF10 draft generation from JSON snapshot | ✅ |
| Admin View: school dashboard, section comparisons, dropout radar | ✅ |
| JSON-first data architecture (single snapshot per student/class) | ✅ |
| At-risk ML model (LightGBM + SHAP) | ✅ |
| Report generation (Llama 3 fine-tuned via QLoRA) | ✅ |
| NL query interface (Claude API) | ✅ |
| DepEd national heatmap view | 🔜 Roadmap |
| National data warehouse & anonymization pipeline | 🔜 Roadmap |
| Urban planning & policy prediction models | 🔜 Roadmap |
| Multi-country localization | 🔜 Roadmap |

**Platform:** Responsive web application. Mobile-friendly, no install required, designed to work on 3G connections. English and Filipino (Tagalog) interfaces for all teacher and student-facing views.

---

## 11. References

- Abasola, 2024 as cited in Global Scientific Journal (GSJ). (2025). *Public High School Teachers' Welfare and Quality of Teaching Upon Implementation of the Immediate Removal of Administrative Tasks in Candelaria, Zambales.* GSJ Volume 13, Issue 2. https://www.globalscientificjournal.com/researchpaper/PUBLIC_HIGH_SCHOOL_TEACHERS_WELFARE_AND_QUALITY_OF_TEACHING_UPON_IMPLEMENTATION_OF_THE_IMMEDIATE_REMOVAL_OF_ADMINISTRATIVE_TASKS_IN_CANDELARIA_ZAMBALES.pdf

- Bertolini, R., et al. (2024). *Supervised machine learning algorithms for predicting student dropout and academic success: a comparative study.* Discover Artificial Intelligence, Springer Nature. https://link.springer.com/article/10.1007/s44163-023-00079-z

- Chowdhury, S. P., et al. (2025). *Large Language Models for Education: Understanding the Needs of Stakeholders, Current Capabilities and the Path Forward.* Proceedings of the 20th Workshop on Innovative Use of NLP for Building Educational Applications. https://aclanthology.org/2025.bea-1.1.pdf

- Chung, J. Y., & Lee, S. (2019). *Dropout early warning systems for high school students using machine learning.* Children and Youth Services Review, 96, 346–353. https://doi.org/10.1016/j.childyouth.2018.11.030

- EDCOM 2. (2025). *Removing the Burden of Administration from Teachers.* Second Congressional Commission on Education. https://edcom2.gov.ph/publications/removing-the-burden-of-administration-from-teachers/

- Guo, X., et al. (2024). *Harnessing large language models to auto-evaluate student project reports.* Computers and Education: Artificial Intelligence. https://www.sciencedirect.com/science/article/pii/S2666920X24000717

- IJRISS. (2025). *Ancillary Duties and Their Impact on Filipino Teachers' Workload and Job Satisfaction.* IJRISS Volume 9, Issue 3, pp. 846–855. https://rsisinternational.org/journals/ijriss/Digital-Library/volume-9-issue-3/846-855.pdf

- Mduma, N. (2023). *Predicting Student Dropout Based on Machine Learning and Deep Learning: A Systematic Review.* EAI Endorsed Transactions on Scalable Information Systems. https://publications.eai.eu/index.php/sis/article/view/3586

- Razafinirina, M. A., et al. (2024). *Large Language Models for Education: Survey, Trends and Challenges.* Journal of Intelligent Learning Systems and Applications, 16, 448–480. https://www.scirp.org/pdf/jilsa2024164_79601651.pdf

- ScienceDirect. (2025). *Leveraging prompt-based LLMs for automated scoring and feedback generation in higher education.* Computers & Education: Artificial Intelligence. https://www.sciencedirect.com/science/article/pii/S0360131525002799

- Tarraya, H. (2023). *Teachers' Workload Policy: Its Impact on Philippine Public School Teachers.* Puissant, Vol. 4. https://puissant.stepacademic.net/puissant/article/view/246

- Ullah, I., et al. (2024). *A novel AI-driven model for student dropout risk analysis with explainable AI insights.* Computers and Education: Artificial Intelligence. https://www.sciencedirect.com/science/article/pii/S2666920X24001553

- Walker, S. (2024, December 26). *Filipino teachers need workload reform.* Philippine Daily Inquirer Opinion. IDInsight. https://opinion.inquirer.net/179491/filipino-teachers-need-workload-reform

---

*Husai v2.0 — Every student deserves to be seen. Every teacher deserves to be supported. Every community deserves to be understood.*
