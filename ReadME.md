# HUSAI
### AI-Powered School Intelligence Platform
*High-Level Concept Document v1.0*
*Prepared for the Google.org × Claude.ai Build for Good Competition*

---

## 1. Executive Summary

Husai is an AI-powered school intelligence platform that solves the most persistent operational crisis in public education: teachers drowning in administrative work while student learning data disappears into a black hole.

A single public school teacher in the Philippines manages an average of 100+ students. Between maintaining class records, compliance reports, grading, and parent communication — teachers spend nearly **18 hours per week** on ancillary duties alone, almost double the 10 hours prescribed by DepEd (Walker, 2024). Meanwhile, student performance data is scattered, inconsistent, or simply never recorded.

Husai addresses both sides of this crisis simultaneously through four interconnected views:

- **Student View** — individual learning profiles with longitudinal progress tracking
- **Teacher View** — class-wide intelligence, at-risk flags, and auto-generated records
- **Admin View** — school-wide performance dashboard and early warning signals
- **DepEd View** *(future roadmap)* — national heatmap, solving the data black hole at scale

The Philippines is the beachhead. The problem is universal.

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

---

## 4. Product Views

### 👩‍🎓 Student View
**Audience:** K-12 students

- Personal learning profile — grades, attendance, and performance trends over time
- Subject-level breakdown showing areas of strength and areas needing improvement
- Quarter-over-quarter progress indicators, not just snapshots
- Accessible on mobile, no app install required, works on 3G connections

### 👩‍🏫 Teacher View
**Audience:** Public and private school teachers

- Entire class roster in a single view — 100+ students, fully organized
- AI-generated at-risk flags for students who are declining, frequently absent, or disengaging
- Quick data entry: quiz scores, attendance, observations — minimal taps required
- Auto-populated DepEd records (SF9, SF10) generated from existing data — no manual encoding
- Class-wide learning gap summary: which competencies are most students missing?
- Voice-to-text or typed teacher observations saved to individual student profiles

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

## 5. AI Architecture

Husai uses a **hybrid AI architecture** — combining a fine-tuned open-source LLM for language tasks with purpose-trained ML models for prediction and classification tasks. This approach maximizes accuracy, keeps costs manageable, and allows the system to improve over time as school data accumulates.

---

### 5.1 At-Risk Detection Engine (Custom-Trained ML Model)

**What it does:** Predicts which students are at risk of falling behind or dropping out, using attendance patterns, grade trends, submission rates, and behavioral signals.

**Why we train our own:** Research consistently shows that gradient boosting models — specifically XGBoost, LightGBM, and CatBoost — achieve the highest performance on structured tabular education data (Mduma, 2023; Bertolini et al., 2024). A hybrid model combining Logistic Regression and Neural Networks has been shown to achieve 96% accuracy in dropout prediction on structured student data (Ullah et al., 2024). Training our own model on Philippine school data lets us account for local context: class sizes, DepEd grading periods, promotion policies, and regional variance.

**Training data inputs:**
- Attendance records (daily/weekly patterns)
- Quarterly grade trajectories per subject
- Submission and quiz completion rates
- Teacher observation flags
- Historical dropout cohort data (where available from DepEd)

**Model selection strategy:** Begin with LightGBM as the baseline (strong performance on imbalanced datasets; Bertolini et al., 2024). Address class imbalance using SMOTE (Synthetic Minority Oversampling Technique). Add explainability layer using SHAP (SHapley Additive exPlanations) so teachers can understand *why* a student was flagged — not just that they were flagged (Ullah et al., 2024).

**Research backing:**
> Chung and Lee (2019) demonstrated the effectiveness of machine learning-based dropout early warning systems for high school students. Bertolini et al. (2024) found that boosting algorithms, particularly LightGBM and CatBoost with Optuna hyperparameter tuning, outperformed traditional classification methods in student dropout and success prediction. A systematic review by Mduma (2023) found Random Forest to be the most used algorithm for dropout prediction, achieving up to 99% accuracy in some configurations.

---

### 5.2 Report Generation Engine (Fine-Tuned LLM)

**What it does:** Automatically generates DepEd-formatted records (SF9, SF10), student progress narratives, and school health summaries from structured input data.

**Base model:** We will fine-tune **Llama 3** (Meta's open-source LLM) using LoRA (Low-Rank Adaptation) for parameter-efficient fine-tuning. This avoids the cost of training a model from scratch while achieving performance tailored to our specific document formats.

**Why fine-tune rather than use GPT-4 directly:**
- Data privacy: student records should not leave our infrastructure
- Cost control: inference costs at scale across thousands of schools require a self-hosted model
- Compliance format accuracy: off-the-shelf LLMs do not know DepEd SF9/SF10 formats natively; fine-tuning on our document templates achieves higher accuracy

**Why not train from scratch:** Training a language model from scratch requires billions of tokens and significant GPU compute. For our use case — structured-to-text generation within a narrow domain — fine-tuning a pre-trained model is the established best practice (Razafinirina et al., 2024).

**Fine-tuning approach:**
1. Collect anonymized DepEd record samples as training data
2. Format as instruction-following pairs: `{student data JSON} → {completed SF9 narrative}`
3. Fine-tune Llama 3 8B using LoRA on our document generation task
4. Validate output against DepEd format standards

**Research backing:**
> Studies by Guo et al. (2024) using fine-tuned BART models demonstrated that lightweight LLMs, when trained on domain-specific datasets, generate effective and accurate feedback evaluations for student reports. Research from ETH Zurich (Chowdhury et al., 2025) highlights LLMs' scalable architectures for educational tasks including automated feedback and content generation. Leveraging prompt-based LLMs has shown strong potential for automated scoring and personalized feedback in education at scale (ScienceDirect, 2025).

---

### 5.3 Learning Gap Analysis Engine (Lightweight Classification Model)

**What it does:** Identifies which competencies — not just which students — are most commonly missed across a class. Surfaces patterns like "70% of Grade 5-B students are failing fractions" so teachers can re-teach targeted concepts.

**Approach:** Item-level response analysis using a fine-tuned BERT classifier on quiz and assessment data. Maps incorrect responses to curriculum competency codes (aligned to DepEd's Most Essential Learning Competencies, or MELC framework).

---

### 5.4 Natural Language Query Interface (LLM via API)

**What it does:** Allows teachers and admins to ask plain-language questions — "Which students have been absent more than 5 times this month?" or "Which section has the lowest Math scores?" — without navigating dashboards.

**Approach:** Uses Claude API (Anthropic) or GPT-4 via prompt engineering with tool-calling to translate natural language into structured database queries. This component does not require training — it leverages existing frontier LLM capabilities with carefully designed system prompts and a narrow permission set.

**Why use an external API here:** Natural language understanding for ad-hoc queries is a task where frontier LLMs already excel. Training a bespoke model for query parsing is not cost-justified when APIs exist. Student data is never sent to the API — only schema definitions and sanitized query structures.

---

### 5.5 AI Architecture Summary

| Component | Approach | Rationale |
|---|---|---|
| At-Risk Detection | Custom-trained LightGBM + Neural Net | Best performance on structured tabular education data |
| Report Generation | Fine-tuned Llama 3 (LoRA) | Privacy, cost control, DepEd format accuracy |
| Learning Gap Analysis | Fine-tuned BERT classifier | Competency-level mapping requires domain-specific training |
| NL Query Interface | Claude / GPT-4 API via prompt engineering | Frontier LLMs already excel at NL-to-query tasks |
| Explainability | SHAP + LIME | Ensures teachers understand AI flags, builds trust |

---

## 6. Competition Alignment

### Google.org Focus Areas

| Focus Area | How Husai Addresses It |
|---|---|
| Knowledge, Skills & Learning | Directly expands access to quality education data for students, teachers, and policymakers — enabling better outcomes through visibility |
| Stronger Communities | Empowers schools and local government to identify and respond to educational crises before they compound across generations |
| Scientific Progress | Builds a national longitudinal education dataset — potentially the first unified one in the Philippines — enabling research-backed policy decisions |

### AI Awareness Among 1,000+ Community Members

- Teacher onboarding workshops in public schools — every teacher who uses Husai becomes an informed AI user
- Student-facing AI explanations — the platform surfaces why flags or suggestions were made, building AI literacy naturally
- Parent summaries in plain Filipino — AI-generated progress reports introduce parents to AI-assisted education
- DepEd pilot program — government partnership amplifies reach to thousands of schools rapidly

---

## 7. Impact Projections

### Short-Term (Year 1)
- Reduce teacher administrative time by an estimated 40–60% per grading period
- Give every enrolled student a documented longitudinal learning profile
- Enable schools to identify at-risk students weeks earlier than current manual processes allow
- Pilot with 10–50 public schools in Metro Manila

### Long-Term (Year 3–5)
- Scale to all 47,000+ public schools in the Philippines
- Provide DepEd with the first live, unified national education data layer
- Expand internationally to Indonesia, Vietnam, and India with localized compliance formats
- Become foundational infrastructure for evidence-based education policy in Southeast Asia

---

## 8. MVP Scope

| Feature | Included in MVP |
|---|---|
| Student View: profile, grades, attendance, subject breakdown | ✅ |
| Teacher View: roster, at-risk flags, quick data entry, SF9/SF10 draft generation | ✅ |
| Admin View: school dashboard, section comparisons, dropout radar | ✅ |
| At-risk ML model (LightGBM baseline) | ✅ |
| Report generation (Llama 3 fine-tuned) | ✅ |
| NL query interface (API-based) | ✅ |
| DepEd national heatmap view | 🔜 Roadmap |
| Multi-school / district federation | 🔜 Roadmap |

**Platform:** Responsive web application. Mobile-friendly, no install required, designed to work on 3G connections common in provincial Philippine schools. English and Filipino (Tagalog) interfaces for all teacher and student-facing views.

---

## 9. References

Abasola, 2024 as cited in:
- Global Scientific Journal (GSJ). (2025). *Public High School Teachers' Welfare and Quality of Teaching Upon Implementation of the Immediate Removal of Administrative Tasks in Candelaria, Zambales.* GSJ Volume 13, Issue 2. ISSN 2320-9186. https://www.globalscientificjournal.com/researchpaper/PUBLIC_HIGH_SCHOOL_TEACHERS_WELFARE_AND_QUALITY_OF_TEACHING_UPON_IMPLEMENTATION_OF_THE_IMMEDIATE_REMOVAL_OF_ADMINISTRATIVE_TASKS_IN_CANDELARIA_ZAMBALES.pdf

- Bertolini, R., et al. (2024). *Supervised machine learning algorithms for predicting student dropout and academic success: a comparative study.* Discover Artificial Intelligence, Springer Nature. https://link.springer.com/article/10.1007/s44163-023-00079-z

- Chowdhury, S. P., Daheim, N., Kochmar, E., Macina, J., Rooein, D., Sachan, M., & Sonkar, S. (2025). *Large Language Models for Education: Understanding the Needs of Stakeholders, Current Capabilities and the Path Forward.* ETH Zurich / TU Darmstadt / MBZUAI / Bocconi University / Rice University. Proceedings of the 20th Workshop on Innovative Use of NLP for Building Educational Applications. https://aclanthology.org/2025.bea-1.1.pdf

- Chung, J. Y., & Lee, S. (2019). *Dropout early warning systems for high school students using machine learning.* Children and Youth Services Review, 96, 346–353. https://doi.org/10.1016/j.childyouth.2018.11.030

- EDCOM 2. (2025). *Removing the Burden of Administration from Teachers.* Second Congressional Commission on Education. https://edcom2.gov.ph/publications/removing-the-burden-of-administration-from-teachers/

- Guo, X., et al. (2024). *Harnessing large language models to auto-evaluate student project reports.* Computers and Education: Artificial Intelligence. ScienceDirect. https://www.sciencedirect.com/science/article/pii/S2666920X24000717

- International Journal of Research and Innovation in Social Science (IJRISS). (2025). *Ancillary Duties and Their Impact on Filipino Teachers' Workload and Job Satisfaction.* IJRISS Volume 9, Issue 3, pp. 846–855. https://rsisinternational.org/journals/ijriss/Digital-Library/volume-9-issue-3/846-855.pdf

- Mduma, N. (2023). *Predicting Student Dropout Based on Machine Learning and Deep Learning: A Systematic Review.* EAI Endorsed Transactions on Scalable Information Systems. https://publications.eai.eu/index.php/sis/article/view/3586

- Razafinirina, M. A., et al. (2024). *Large Language Models for Education: Survey, Trends and Challenges.* Journal of Intelligent Learning Systems and Applications, 16, 448–480. SCIRP. https://www.scirp.org/pdf/jilsa2024164_79601651.pdf

- ScienceDirect. (2025). *Leveraging prompt-based LLMs for automated scoring and feedback generation in higher education.* Computers & Education: Artificial Intelligence. https://www.sciencedirect.com/science/article/pii/S0360131525002799

- Tarraya, H. (2023). *Teachers' Workload Policy: Its Impact on Philippine Public School Teachers.* Puissant, Vol. 4. https://puissant.stepacademic.net/puissant/article/view/246

- Ullah, I., et al. (2024). *A novel AI-driven model for student dropout risk analysis with explainable AI insights.* Computers and Education: Artificial Intelligence, ScienceDirect. https://www.sciencedirect.com/science/article/pii/S2666920X24001553

- Walker, S. (2024, December 26). *Filipino teachers need workload reform.* Philippine Daily Inquirer Opinion. IDInsight. https://opinion.inquirer.net/179491/filipino-teachers-need-workload-reform

---

*Husai — Every student deserves to be seen. Every teacher deserves to be supported.*
