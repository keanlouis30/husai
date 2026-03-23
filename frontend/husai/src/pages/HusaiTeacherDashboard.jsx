import { useState } from "react";

// ── HUSAI TOKENS: White + Blue (Teacher Role) ─────────────────────────────────
const T = {
  blue: "#0038A8",
  blueSoft: "#EBF0FF",
  bluePale: "#F5F8FF",
  blueBorder: "#A8BFFF",
  blueMid: "#2952CC",
  blueDeep: "#002880",
  gold: "#F5C842",
  goldSoft: "#FDF3C8",
  red: "#C0392B",
  redSoft: "#FDF3F2",
  redBorder: "#F5B8B3",
  amber: "#B45309",
  amberSoft: "#FFFBEB",
  amberBorder: "#FCD34D",
  green: "#22863A",
  greenSoft: "#F0FAF3",
  greenBorder: "#86EFAC",
  textPrimary: "#18181A",
  textMid: "#5C5C66",
  textSoft: "#9999A8",
  border: "#EBEBEE",
  surface: "#FFFFFF",
  page: "#F8FAFF",
};

// ── SAMPLE DATA ───────────────────────────────────────────────────────────────
const teacher = {
  name: "Mrs. Ana Santos",
  subject: "Grade 5 Adviser",
  section: "Section Mabini",
  school: "Mabini Elementary School",
  avatar: "AS",
  quarter: "Q3",
  sy: "S.Y. 2024–2025",
};

const classStats = {
  total: 34,
  passing: 28,
  atRisk: 4,
  perfect: 3,
  avgGwa: 83.4,
  attendance: 91.2,
};

const learningGaps = [
  {
    competency: "Fractions & Word Problems",
    code: "M5NS-IIf",
    subject: "Math",
    affected: 22,
    pct: 65,
    severity: "high",
  },
  {
    competency: "Reading Comprehension",
    code: "EN5RC-Ih",
    subject: "English",
    affected: 15,
    pct: 44,
    severity: "medium",
  },
  {
    competency: "Scientific Method",
    code: "S5MT-Ia",
    subject: "Science",
    affected: 12,
    pct: 35,
    severity: "medium",
  },
  {
    competency: "Kasaysayan ng Pilipinas",
    code: "AP5PKB-Ig",
    subject: "AP",
    affected: 8,
    pct: 24,
    severity: "low",
  },
  {
    competency: "Expository Writing",
    code: "EN5WC-Ih",
    subject: "English",
    affected: 7,
    pct: 21,
    severity: "low",
  },
];

const students = [
  {
    id: 1,
    name: "Maria Santos",
    gwa: 67,
    q1: 72,
    q2: 69,
    q3: 67,
    attendance: 78,
    trend: "down",
    risk: "high",
    absent: 11,
    obs: "Frequently distracted. Parent not responsive.",
  },
  {
    id: 2,
    name: "Pedro Reyes",
    gwa: 74,
    q1: 80,
    q2: 77,
    q3: 74,
    attendance: 88,
    trend: "down",
    risk: "medium",
    absent: 6,
    obs: "Struggling with Math fractions.",
  },
  {
    id: 3,
    name: "Lani Torres",
    gwa: 76,
    q1: 78,
    q2: 77,
    q3: 76,
    attendance: 85,
    trend: "stable",
    risk: "medium",
    absent: 8,
    obs: "Inconsistent output. Needs motivation.",
  },
  {
    id: 4,
    name: "Carlo Bautista",
    gwa: 73,
    q1: 79,
    q2: 76,
    q3: 73,
    attendance: 80,
    trend: "down",
    risk: "high",
    absent: 10,
    obs: "At-risk of non-promotion. Needs intervention.",
  },
  {
    id: 5,
    name: "Juan dela Rosa",
    gwa: 84,
    q1: 80,
    q2: 82,
    q3: 84,
    attendance: 90,
    trend: "up",
    risk: "none",
    absent: 3,
    obs: "Consistent improvement in all subjects.",
  },
  {
    id: 6,
    name: "Ana Lim",
    gwa: 95,
    q1: 93,
    q2: 94,
    q3: 95,
    attendance: 98,
    trend: "up",
    risk: "none",
    absent: 1,
    obs: "Top performer. Excellent across all areas.",
  },
  {
    id: 7,
    name: "Jose Mendoza",
    gwa: 88,
    q1: 87,
    q2: 88,
    q3: 88,
    attendance: 96,
    trend: "stable",
    risk: "none",
    absent: 2,
    obs: "Strong in Science and Math.",
  },
  {
    id: 8,
    name: "Rosa Garcia",
    gwa: 91,
    q1: 90,
    q2: 91,
    q3: 91,
    attendance: 95,
    trend: "up",
    risk: "none",
    absent: 2,
    obs: "Excellent leadership in group activities.",
  },
  {
    id: 9,
    name: "Miguel Cruz",
    gwa: 79,
    q1: 82,
    q2: 80,
    q3: 79,
    attendance: 87,
    trend: "down",
    risk: "low",
    absent: 5,
    obs: "Minor decline. Monitor next quarter.",
  },
  {
    id: 10,
    name: "Clara Ramos",
    gwa: 86,
    q1: 85,
    q2: 86,
    q3: 86,
    attendance: 93,
    trend: "stable",
    risk: "none",
    absent: 3,
    obs: "Reliable and consistent.",
  },
  {
    id: 11,
    name: "Ben Aquino",
    gwa: 82,
    q1: 81,
    q2: 83,
    q3: 82,
    attendance: 90,
    trend: "stable",
    risk: "none",
    absent: 4,
    obs: "Good participation in class discussions.",
  },
  {
    id: 12,
    name: "Sofia Dela Cruz",
    gwa: 90,
    q1: 88,
    q2: 89,
    q3: 90,
    attendance: 97,
    trend: "up",
    risk: "none",
    absent: 2,
    obs: "Strong Filipino and English skills.",
  },
];

const rosterFull = [
  ...students,
  ...Array.from({ length: 22 }, (_, i) => ({
    id: i + 13,
    name: `Student ${i + 13}`,
    gwa: 75 + Math.floor(Math.random() * 18),
    q1: 76,
    q2: 78,
    q3: 75 + Math.floor(Math.random() * 18),
    attendance: 88 + Math.floor(Math.random() * 10),
    trend: "stable",
    risk: "none",
    absent: Math.floor(Math.random() * 5),
    obs: "No notes.",
  })),
];

const recentActivity = [
  {
    time: "Today 9:12 AM",
    icon: "quiz",
    text: "Math quiz scores recorded for 34 students — class avg 71.",
  },
  {
    time: "Today 7:45 AM",
    icon: "att",
    text: "Attendance taken — 32 present, 2 absent (Reyes, Santos).",
  },
  {
    time: "Yesterday",
    icon: "ai",
    text: "Husai flagged Maria Santos — 3rd consecutive week of decline.",
  },
  {
    time: "Yesterday",
    icon: "sf",
    text: "SF9 auto-generated for Q2 — ready for review and printing.",
  },
  {
    time: "Mar 18",
    icon: "obs",
    text: 'Observation saved for Pedro Reyes: "Struggles with fractions."',
  },
  {
    time: "Mar 17",
    icon: "ai",
    text: "Learning gap alert: 65% of class below threshold in Fractions.",
  },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function gradeInfo(s) {
  if (s >= 90) return { label: "Outstanding", c: T.green };
  if (s >= 85) return { label: "Very Satisfactory", c: T.blue };
  if (s >= 80) return { label: "Satisfactory", c: "#C9A227" };
  if (s >= 75) return { label: "Fairly Satisfactory", c: T.amber };
  return { label: "Did Not Meet", c: T.red };
}

const riskConfig = {
  high: {
    label: "High Risk",
    bg: T.redSoft,
    text: T.red,
    border: T.redBorder,
    dot: "#EF4444",
  },
  medium: {
    label: "Med Risk",
    bg: T.amberSoft,
    text: T.amber,
    border: T.amberBorder,
    dot: "#F59E0B",
  },
  low: {
    label: "Low Risk",
    bg: "#FFFBEB",
    text: "#92400E",
    border: "#FDE68A",
    dot: "#FCD34D",
  },
  none: {
    label: "On Track",
    bg: T.greenSoft,
    text: T.green,
    border: T.greenBorder,
    dot: "#4ADE80",
  },
};

const trendMap = {
  up: { a: "↑", c: T.green },
  down: { a: "↓", c: T.red },
  stable: { a: "→", c: T.amber },
};

const actIcon = { quiz: "Q", att: "A", ai: "H", sf: "S", obs: "O" };
const actColor = {
  quiz: T.blue,
  att: T.green,
  ai: "#18181A",
  sf: T.amber,
  obs: T.textMid,
};

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────────
const HusaiLogo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
    <svg width="34" height="34" viewBox="0 0 52 52" fill="none">
      <rect width="52" height="52" rx="12" fill="#18181A" />
      <circle
        cx="26"
        cy="26"
        r="9"
        fill="none"
        stroke={T.gold}
        strokeWidth="2.2"
      />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const r = (Math.PI * deg) / 180;
        return (
          <line
            key={i}
            x1={26 + 22 * Math.cos(r)}
            y1={26 + 22 * Math.sin(r)}
            x2={26 + 15 * Math.cos(r)}
            y2={26 + 15 * Math.sin(r)}
            stroke={T.gold}
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}
      <line
        x1="21"
        y1="20"
        x2="21"
        y2="32"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <line
        x1="31"
        y1="20"
        x2="31"
        y2="32"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <line
        x1="21"
        y1="26"
        x2="31"
        y2="26"
        stroke={T.gold}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
    <div>
      <div
        style={{
          fontFamily: "'DM Serif Display',Georgia,serif",
          fontSize: 22,
          color: T.textPrimary,
          lineHeight: 1,
          letterSpacing: "-.5px",
        }}
      >
        husai
      </div>
      <div
        style={{
          fontSize: 9,
          letterSpacing: ".18em",
          textTransform: "uppercase",
          color: T.textSoft,
          fontWeight: 500,
          marginTop: 1,
        }}
      >
        School Intelligence
      </div>
    </div>
  </div>
);

const StatCard = ({ label, value, sub, accent, dim }) => (
  <div
    style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: "16px 16px 14px",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        borderRadius: "14px 14px 0 0",
        background: accent || T.blue,
      }}
    />
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: ".1em",
        textTransform: "uppercase",
        color: T.textSoft,
        marginBottom: 8,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontFamily: "'DM Serif Display',serif",
        fontSize: 28,
        color: dim ? T.red : T.textPrimary,
        lineHeight: 1,
        letterSpacing: "-.5px",
      }}
    >
      {value}
    </div>
    {sub && (
      <div style={{ fontSize: 11, color: T.textSoft, marginTop: 4 }}>{sub}</div>
    )}
  </div>
);

const Card = ({ children, style = {} }) => (
  <div
    style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      overflow: "hidden",
      marginBottom: 14,
      ...style,
    }}
  >
    {children}
  </div>
);

const CardHead = ({ left, right }) => (
  <div
    style={{
      padding: "13px 18px",
      borderBottom: `1px solid ${T.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    {left}
    {right}
  </div>
);

const Badge = ({ label, bg, text, border }) => (
  <span
    style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: ".06em",
      textTransform: "uppercase",
      padding: "3px 9px",
      borderRadius: 20,
      background: bg || T.blueSoft,
      color: text || T.blue,
      border: `1px solid ${border || T.blueBorder}`,
    }}
  >
    {label}
  </span>
);

// Risk pill
const RiskPill = ({ risk }) => {
  const r = riskConfig[risk] || riskConfig.none;
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: 20,
        background: r.bg,
        color: r.text,
        border: `1px solid ${r.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {r.label}
    </span>
  );
};

// Student row in roster
const StudentRow = ({ stu, onSelect, selected }) => {
  const g = gradeInfo(stu.gwa);
  const tr = trendMap[stu.trend] || trendMap.stable;
  const rc = riskConfig[stu.risk] || riskConfig.none;
  return (
    <div
      onClick={() => onSelect(stu)}
      className="t-roster-row"
      style={{
        borderBottom: `1px solid ${T.border}`,
        cursor: "pointer",
        background: selected ? T.bluePale : "transparent",
        transition: "background .12s",
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: rc.dot,
          margin: "0 auto",
        }}
      />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>
          {stu.name}
        </div>
        {stu.risk !== "none" && (
          <div style={{ fontSize: 10, color: rc.text, marginTop: 2 }}>
            {stu.absent} abs.
          </div>
        )}
      </div>
      <div className="t-col-q1" style={{ textAlign: "center" }}>
        <span
          style={{ fontSize: 12, fontWeight: 700, color: gradeInfo(stu.q1).c }}
        >
          {stu.q1}
        </span>
      </div>
      <div className="t-col-q2" style={{ textAlign: "center" }}>
        <span
          style={{ fontSize: 12, fontWeight: 700, color: gradeInfo(stu.q2).c }}
        >
          {stu.q2}
        </span>
      </div>
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            padding: "2px 7px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            background: `${g.c}14`,
            color: g.c,
            border: `1px solid ${g.c}30`,
          }}
        >
          {stu.q3}
        </span>
      </div>
      <div className="t-col-att">
        <div
          style={{
            height: 4,
            background: "#F0F0F2",
            borderRadius: 3,
            overflow: "hidden",
            marginBottom: 2,
          }}
        >
          <div
            style={{
              width: `${stu.attendance}%`,
              height: "100%",
              background:
                stu.attendance < 80
                  ? T.red
                  : stu.attendance < 90
                    ? T.amber
                    : T.green,
              borderRadius: 3,
            }}
          />
        </div>
        <div style={{ fontSize: 10, color: T.textSoft, textAlign: "right" }}>
          {stu.attendance}%
        </div>
      </div>
      <div className="t-col-risk-full">
        <RiskPill risk={stu.risk} />
      </div>
      <div className="t-col-risk-compact" style={{ display: "flex" }}>
        <RiskPill risk={stu.risk} />
      </div>
      <div
        className="t-col-trend"
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: tr.c,
          textAlign: "center",
        }}
      >
        {tr.a}
      </div>
    </div>
  );
};

// Student detail drawer
const StudentDrawer = ({ stu, onClose, onSaveObs }) => {
  const [obs, setObs] = useState(stu.obs);
  const [saved, setSaved] = useState(false);
  const g = gradeInfo(stu.gwa);
  const rc = riskConfig[stu.risk] || riskConfig.none;

  const save = () => {
    onSaveObs(stu.id, obs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      style={{
        border: `1.5px solid ${T.blueBorder}`,
        borderRadius: 16,
        background: T.bluePale,
        padding: 20,
        marginTop: 12,
        animation: "fadeUp .2s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: T.blueSoft,
              border: `2px solid ${T.blueBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 15,
              color: T.blue,
            }}
          >
            {stu.name
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <div
              style={{ fontWeight: 700, fontSize: 16, color: T.textPrimary }}
            >
              {stu.name}
            </div>
            <div style={{ fontSize: 12, color: T.textMid, marginTop: 2 }}>
              Grade 5 — Section Mabini
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <RiskPill risk={stu.risk} />
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#EBEBEE",
              borderRadius: 8,
              padding: "5px 12px",
              cursor: "pointer",
              fontSize: 12,
              color: T.textMid,
              fontFamily: "inherit",
            }}
          >
            Close
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 10,
          marginBottom: 16,
        }}
      >
        {[
          { l: "GWA", v: stu.gwa, c: g.c },
          { l: "Q1", v: stu.q1, c: gradeInfo(stu.q1).c },
          { l: "Q2", v: stu.q2, c: gradeInfo(stu.q2).c },
          { l: "Q3", v: stu.q3, c: gradeInfo(stu.q3).c },
        ].map((x) => (
          <div
            key={x.l}
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              padding: "10px 12px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: T.textSoft,
                marginBottom: 4,
              }}
            >
              {x.l}
            </div>
            <div
              style={{
                fontFamily: "'DM Serif Display',serif",
                fontSize: 26,
                color: x.c,
                lineHeight: 1,
              }}
            >
              {x.v}
            </div>
            <div style={{ fontSize: 9, color: x.c, marginTop: 2 }}>
              {gradeInfo(x.v).label}
            </div>
          </div>
        ))}
      </div>

      {/* Attendance */}
      <div
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          padding: "12px 14px",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: T.textMid }}>
            Attendance this quarter
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color:
                stu.attendance < 80
                  ? T.red
                  : stu.attendance < 90
                    ? T.amber
                    : T.green,
            }}
          >
            {stu.attendance}%
          </span>
        </div>
        <div
          style={{
            height: 6,
            background: "#F0F0F2",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${stu.attendance}%`,
              height: "100%",
              background:
                stu.attendance < 80
                  ? T.red
                  : stu.attendance < 90
                    ? T.amber
                    : T.green,
              borderRadius: 4,
            }}
          />
        </div>
        <div style={{ fontSize: 11, color: T.textSoft, marginTop: 5 }}>
          {stu.absent} absences recorded ·{" "}
          {stu.attendance >= 90
            ? "Within DepEd threshold"
            : "Below 90% threshold — action needed"}
        </div>
      </div>

      {/* AI Insight */}
      {stu.risk !== "none" && (
        <div
          style={{
            background: "#18181A",
            borderRadius: 12,
            padding: "12px 14px",
            marginBottom: 14,
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 52 52"
            fill="none"
            style={{ flexShrink: 0, marginTop: 1 }}
          >
            <rect width="52" height="52" rx="10" fill="#333" />
            <line
              x1="21"
              y1="18"
              x2="21"
              y2="34"
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <line
              x1="31"
              y1="18"
              x2="31"
              y2="34"
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <line
              x1="21"
              y1="26"
              x2="31"
              y2="26"
              stroke={T.gold}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <div style={{ fontSize: 12, color: "#E5E5E5", lineHeight: 1.55 }}>
            <span style={{ color: T.gold, fontWeight: 700 }}>Husai: </span>
            {stu.risk === "high" &&
              `${stu.name} is flagged as high-risk. Declining grades across 3 quarters + high absence count. Recommend parent conference and intervention plan.`}
            {stu.risk === "medium" &&
              `${stu.name} shows a moderate downward trend. Monitor closely — target the specific MELC competencies where scores are lowest.`}
            {stu.risk === "low" &&
              `${stu.name} has a minor decline. A brief check-in this week may help prevent further drop.`}
          </div>
        </div>
      )}

      {/* Observation */}
      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: T.textMid,
            marginBottom: 6,
          }}
        >
          Teacher Observation
        </div>
        <textarea
          value={obs}
          onChange={(e) => setObs(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            borderRadius: 10,
            border: `1px solid ${T.border}`,
            padding: "10px 12px",
            fontSize: 12,
            fontFamily: "inherit",
            color: T.textPrimary,
            background: T.surface,
            resize: "vertical",
            outline: "none",
            lineHeight: 1.6,
          }}
          placeholder="Add your observation for this student…"
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 8,
          }}
        >
          {saved && (
            <span style={{ fontSize: 12, color: T.green, alignSelf: "center" }}>
              ✓ Saved to student profile
            </span>
          )}
          <button
            onClick={save}
            style={{
              background: T.blue,
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "8px 18px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Save Observation
          </button>
        </div>
      </div>
    </div>
  );
};

// Learning gap row
const GapRow = ({ gap }) => {
  const sev = {
    high: { c: T.red, bg: T.redSoft, border: T.redBorder },
    medium: { c: T.amber, bg: T.amberSoft, border: T.amberBorder },
    low: { c: "#92400E", bg: "#FFFBEB", border: "#FDE68A" },
  };
  const sv = sev[gap.severity] || sev.low;
  return (
    <div
      className="t-gap-row"
      style={{ padding: "12px 0", borderBottom: `1px solid ${T.border}` }}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: 13, color: T.textPrimary }}>
          {gap.competency}
        </div>
        <div style={{ fontSize: 11, color: T.textSoft, marginTop: 2 }}>
          {gap.subject} · {gap.code}
        </div>
      </div>
      <div>
        <div
          style={{
            height: 6,
            background: "#F0F0F2",
            borderRadius: 3,
            overflow: "hidden",
            marginBottom: 3,
          }}
        >
          <div
            style={{
              width: `${gap.pct}%`,
              height: "100%",
              background: sv.c,
              borderRadius: 3,
            }}
          />
        </div>
        <div style={{ fontSize: 10, color: T.textSoft, textAlign: "right" }}>
          {gap.affected} students
        </div>
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: sv.c,
          textAlign: "center",
        }}
      >
        {gap.pct}%
      </div>
      <span
        className="t-col-sev"
        style={{
          fontSize: 10,
          fontWeight: 700,
          padding: "3px 8px",
          borderRadius: 20,
          background: sv.bg,
          color: sv.c,
          border: `1px solid ${sv.border}`,
          textTransform: "uppercase",
          letterSpacing: ".05em",
          whiteSpace: "nowrap",
          textAlign: "center",
        }}
      >
        {gap.severity}
      </span>
    </div>
  );
};

// Quick data entry modal
const QuickEntry = ({ onClose }) => {
  const [mode, setMode] = useState("quiz");
  const [subject, setSubject] = useState("Mathematics");
  const [scores, setScores] = useState({});

  const sampleNames = [
    "Maria Santos",
    "Pedro Reyes",
    "Ana Lim",
    "Juan dela Rosa",
    "Rosa Garcia",
    "Jose Mendoza",
  ];

  return (
    <div
      style={{
        border: `1.5px solid ${T.blueBorder}`,
        borderRadius: 16,
        background: T.surface,
        padding: 20,
        marginBottom: 14,
        animation: "fadeUp .2s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 15, color: T.textPrimary }}>
          Quick Data Entry
        </div>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "#EBEBEE",
            borderRadius: 8,
            padding: "5px 12px",
            cursor: "pointer",
            fontSize: 12,
            color: T.textMid,
            fontFamily: "inherit",
          }}
        >
          Close
        </button>
      </div>

      {/* Mode toggle */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 16,
          background: "#F4F4F6",
          borderRadius: 10,
          padding: 4,
        }}
      >
        {["quiz", "attendance", "observation"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              flex: 1,
              padding: "7px 0",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "inherit",
              background: mode === m ? T.surface : "transparent",
              color: mode === m ? T.blue : T.textMid,
              transition: "all .15s",
            }}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {mode === "quiz" && (
        <>
          <div className="t-entry-row" style={{ marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.textMid,
                  marginBottom: 5,
                }}
              >
                Subject
              </div>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: `1px solid ${T.border}`,
                  fontSize: 12,
                  fontFamily: "inherit",
                  color: T.textPrimary,
                  background: T.surface,
                }}
              >
                {[
                  "Mathematics",
                  "Filipino",
                  "Science",
                  "English",
                  "Araling Panlipunan",
                  "MAPEH",
                  "ESP",
                  "TLE",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.textMid,
                  marginBottom: 5,
                }}
              >
                Assessment type
              </div>
              <select
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: `1px solid ${T.border}`,
                  fontSize: 12,
                  fontFamily: "inherit",
                  color: T.textPrimary,
                  background: T.surface,
                }}
              >
                <option>Quiz</option>
                <option>Long Test</option>
                <option>Performance Task</option>
                <option>Quarterly Exam</option>
              </select>
            </div>
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: T.textMid,
              marginBottom: 8,
            }}
          >
            Enter scores (showing first 6 of 34)
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: 6 }}
          >
            {sampleNames.map((n) => (
              <div key={n} style={{ display: "contents" }}>
                <div
                  style={{
                    fontSize: 12,
                    color: T.textPrimary,
                    display: "flex",
                    alignItems: "center",
                    padding: "6px 10px",
                    background: "#F8FAFF",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                  }}
                >
                  {n}
                </div>
                <input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="—"
                  value={scores[n] || ""}
                  onChange={(e) =>
                    setScores((p) => ({ ...p, [n]: e.target.value }))
                  }
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "inherit",
                    textAlign: "center",
                    color: T.blue,
                    outline: "none",
                  }}
                />
              </div>
            ))}
          </div>
          <button
            style={{
              width: "100%",
              marginTop: 14,
              background: T.blue,
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "10px 0",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Save Scores to {subject}
          </button>
        </>
      )}

      {mode === "attendance" && (
        <>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: T.textMid,
              marginBottom: 10,
            }}
          >
            Mark attendance —{" "}
            {new Date().toLocaleDateString("en-PH", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {sampleNames.map((n) => (
              <div
                key={n}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  background: "#F8FAFF",
                  borderRadius: 8,
                  border: `1px solid ${T.border}`,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: T.textPrimary,
                  }}
                >
                  {n}
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  {["Present", "Late", "Absent"].map((s) => (
                    <label
                      key={s}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 11,
                        cursor: "pointer",
                        color:
                          s === "Present"
                            ? T.green
                            : s === "Late"
                              ? T.amber
                              : T.red,
                      }}
                    >
                      <input
                        type="radio"
                        name={n}
                        style={{
                          accentColor:
                            s === "Present"
                              ? T.green
                              : s === "Late"
                                ? T.amber
                                : T.red,
                        }}
                        defaultChecked={s === "Present"}
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            style={{
              width: "100%",
              marginTop: 14,
              background: T.green,
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "10px 0",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Submit Attendance
          </button>
        </>
      )}

      {mode === "observation" && (
        <>
          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: T.textMid,
                marginBottom: 5,
              }}
            >
              Select student
            </div>
            <select
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: `1px solid ${T.border}`,
                fontSize: 12,
                fontFamily: "inherit",
                color: T.textPrimary,
                background: T.surface,
              }}
            >
              {sampleNames.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: T.textMid,
                marginBottom: 5,
              }}
            >
              Observation note
            </div>
            <textarea
              rows={4}
              placeholder="Type or use voice-to-text…"
              style={{
                width: "100%",
                borderRadius: 10,
                border: `1px solid ${T.border}`,
                padding: "10px 12px",
                fontSize: 12,
                fontFamily: "inherit",
                color: T.textPrimary,
                background: T.surface,
                resize: "vertical",
                outline: "none",
              }}
            />
          </div>
          <button
            style={{
              width: "100%",
              marginTop: 12,
              background: T.blue,
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "10px 0",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Save Observation
          </button>
        </>
      )}
    </div>
  );
};

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function HusaiTeacherDashboard() {
  const [tab, setTab] = useState("overview");
  const [selectedStu, setSelectedStu] = useState(null);
  const [showEntry, setShowEntry] = useState(false);
  const [rosterData, setRosterData] = useState(rosterFull);
  const [filterRisk, setFilterRisk] = useState("all");
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState("risk");

  const atRisk = rosterFull.filter(
    (s) => s.risk === "high" || s.risk === "medium",
  );

  const filteredRoster = rosterData
    .filter((s) => (filterRisk === "all" ? true : s.risk === filterRisk))
    .filter((s) =>
      search ? s.name.toLowerCase().includes(search.toLowerCase()) : true,
    )
    .sort((a, b) => {
      if (sortCol === "risk") {
        const o = { high: 0, medium: 1, low: 2, none: 3 };
        return o[a.risk] - o[b.risk];
      }
      if (sortCol === "gwa") return b.gwa - a.gwa;
      if (sortCol === "att") return b.attendance - a.attendance;
      return 0;
    });

  const saveObs = (id, obs) =>
    setRosterData((prev) => prev.map((s) => (s.id === id ? { ...s, obs } : s)));

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "roster", label: `Roster (${classStats.total})` },
    { id: "gaps", label: "Learning Gaps" },
    { id: "entry", label: "Quick Entry" },
    { id: "records", label: "SF9 / SF10" },
  ];

  return (
    <div
      style={{
        fontFamily: "'DM Sans',system-ui,sans-serif",
        background: T.page,
        minHeight: "100vh",
        color: T.textPrimary,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');
        *{box-sizing:border-box;}
        button{font-family:inherit;}
        textarea:focus,select:focus,input:focus{border-color:${T.blueBorder} !important;box-shadow:0 0 0 3px ${T.blueSoft};}
        @keyframes fadeUp{from{opacity:0;transform:translateY(5px);}to{opacity:1;transform:none;}}

        /* ── MOBILE RESPONSIVE ── */

        /* Nav/hero/tabs padding: tight on mobile */
        .t-px { padding-left:16px; padding-right:16px; }
        .t-py-hero { padding-top:18px; padding-bottom:16px; }
        .t-py-main { padding-top:16px; padding-bottom:48px; }
        @media(min-width:640px){
          .t-px { padding-left:32px; padding-right:32px; }
          .t-py-hero { padding-top:26px; padding-bottom:22px; }
          .t-py-main { padding-top:22px; padding-bottom:52px; }
        }

        /* Stat grid: 2-col mobile → 3-col tablet → 6-col desktop */
        .t-stat-grid {
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:10px; margin-bottom:16px;
        }
        @media(min-width:540px){ .t-stat-grid { grid-template-columns:repeat(3,minmax(0,1fr)); } }
        @media(min-width:900px){ .t-stat-grid { grid-template-columns:repeat(6,minmax(0,1fr)); gap:12px; margin-bottom:20px; } }

        /* Overview: stacked mobile → 2-col desktop */
        .t-overview-grid {
          display:grid;
          grid-template-columns:1fr;
          gap:14px;
        }
        @media(min-width:960px){ .t-overview-grid { grid-template-columns:1fr 320px; } }

        /* Hero: stack on mobile */
        .t-hero-row {
          display:flex;
          align-items:flex-end;
          justify-content:space-between;
          gap:16px;
          flex-wrap:wrap;
        }

        /* Quick actions: stack on small mobile */
        .t-actions { display:flex; gap:8px; flex-wrap:wrap; }
        .t-actions button { flex:1; min-width:140px; justify-content:center; }

        /* Tabs: scroll on mobile, hide scrollbar */
        .t-tabs {
          display:flex; gap:0; overflow-x:auto;
          -webkit-overflow-scrolling:touch; scrollbar-width:none;
        }
        .t-tabs::-webkit-scrollbar{ display:none; }

        /* Roster table: hide some columns on mobile */
        .t-roster-header, .t-roster-row {
          display:grid;
          grid-template-columns:16px 1fr 48px 48px 90px;
          gap:8px; align-items:center; padding:9px 14px;
        }
        .t-col-q1,.t-col-q2,.t-col-att,.t-col-risk-full,.t-col-trend{ display:none; }
        .t-col-risk-compact{ display:flex; }
        @media(min-width:560px){
          .t-roster-header,.t-roster-row{
            grid-template-columns:16px 1fr 42px 42px 42px 88px 78px 20px;
            gap:10px; padding:10px 16px;
          }
          .t-col-q1,.t-col-q2{ display:block; }
          .t-col-att{ display:block; }
          .t-col-risk-full{ display:block; }
          .t-col-risk-compact{ display:none; }
          .t-col-trend{ display:block; }
        }

        /* Quick entry inputs full-width on mobile */
        .t-entry-row { display:flex; gap:10px; flex-wrap:wrap; }
        .t-entry-row > div { flex:1; min-width:140px; }

        /* SF record grid: 1-col mobile → 2-col desktop */
        .t-sf-grid { display:grid; grid-template-columns:1fr; gap:12px; }
        @media(min-width:600px){ .t-sf-grid { grid-template-columns:1fr 1fr; } }

        /* Gap analysis grid columns: hide code on mobile */
        .t-gap-header, .t-gap-row {
          display:grid;
          grid-template-columns:1fr 76px 32px;
          gap:10px; align-items:center;
        }
        .t-col-sev{ display:none; }
        @media(min-width:560px){
          .t-gap-header,.t-gap-row{ grid-template-columns:1fr 76px 32px 68px; }
          .t-col-sev{ display:block; }
        }

        /* At-risk card items: hide score detail on small mobile */
        .t-risk-item {
          display:flex; align-items:center; gap:10px;
          padding:9px 12px; background:${T.surface};
          border:1px solid ${T.redBorder}; border-radius:10px;
          cursor:pointer;
        }
        .t-risk-score{ display:none; }
        @media(min-width:480px){ .t-risk-score{ display:block; } }
      `}</style>

      {/* ── NAV ── */}
      <header
        className="t-px"
        style={{
          background: T.surface,
          borderBottom: `1px solid ${T.border}`,
          height: 58,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <HusaiLogo />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ textAlign: "right" }}>
            <div
              style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}
            >
              {teacher.name}
            </div>
            <div style={{ fontSize: 10, color: T.textSoft }}>
              {teacher.section} · {teacher.quarter} · Teacher View
            </div>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: T.blue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 13,
              color: "white",
            }}
          >
            {teacher.avatar}
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <div
        className="t-px t-py-hero"
        style={{ background: T.surface, borderBottom: `1px solid ${T.border}` }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: T.blue,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: T.blue,
              display: "inline-block",
            }}
          />
          Teacher Dashboard
        </div>
        <div className="t-hero-row">
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                fontFamily: "'DM Serif Display',serif",
                fontSize: "clamp(20px,4vw,28px)",
                color: T.textPrimary,
                lineHeight: 1.1,
                letterSpacing: "-.3px",
                margin: 0,
              }}
            >
              {teacher.name}
            </h1>
            <p
              style={{ fontSize: 13, color: T.textSoft, margin: "5px 0 10px" }}
            >
              {teacher.subject} · {teacher.school}
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[
                teacher.section,
                teacher.sy,
                `${classStats.total} students`,
                teacher.quarter + " · DepEd",
              ].map((c) => (
                <span
                  key={c}
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    padding: "4px 10px",
                    borderRadius: 20,
                    background: T.blueSoft,
                    color: T.blue,
                    border: `1px solid ${T.blueBorder}`,
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          {/* Quick actions */}
          <div className="t-actions">
            <button
              onClick={() => {
                setTab("entry");
                setShowEntry(true);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: T.blue,
                color: "white",
                border: "none",
                borderRadius: 10,
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Quick Entry
            </button>
            <button
              onClick={() => setTab("records")}
              style={{
                background: T.surface,
                color: T.blue,
                border: `1.5px solid ${T.blueBorder}`,
                borderRadius: 10,
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Generate SF9 / SF10
            </button>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div
        className="t-tabs t-px"
        style={{ background: T.surface, borderBottom: `1px solid ${T.border}` }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "13px 16px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: tab === t.id ? 700 : 500,
              color: tab === t.id ? T.textPrimary : T.textSoft,
              borderBottom: `2px solid ${tab === t.id ? T.blue : "transparent"}`,
              transition: "all .15s",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── MAIN ── */}
      <main className="t-px t-py-main">
        {/* ══ OVERVIEW ══ */}
        {tab === "overview" && (
          <>
            {/* Stat cards: 2-col mobile → 3-col tablet → 6-col desktop */}
            <div className="t-stat-grid">
              <StatCard
                label="Total Students"
                value={classStats.total}
                sub="Section Mabini"
                accent={T.blue}
              />
              <StatCard
                label="Passing"
                value={classStats.passing}
                sub="Above 75 GWA"
                accent={T.green}
              />
              <StatCard
                label="At-Risk"
                value={classStats.atRisk}
                sub="Need intervention"
                accent={T.red}
                dim
              />
              <StatCard
                label="Class Avg GWA"
                value={classStats.avgGwa}
                sub="This quarter"
                accent={T.blueMid}
              />
              <StatCard
                label="Attendance"
                value={`${classStats.attendance}%`}
                sub="Class average"
                accent={T.blueBorder}
              />
              <StatCard
                label="Perfect Scores"
                value={classStats.perfect}
                sub="This quarter"
                accent={T.gold}
              />
            </div>

            {/* 2-col on desktop: main content left, activity feed right */}
            <div className="t-overview-grid">
              {/* LEFT COLUMN */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {/* At-risk alert */}
                {atRisk.length > 0 && (
                  <div
                    style={{
                      background: T.redSoft,
                      border: `1px solid ${T.redBorder}`,
                      borderRadius: 14,
                      padding: "14px 18px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={T.red}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      <span
                        style={{ fontWeight: 700, fontSize: 13, color: T.red }}
                      >
                        Students Needing Immediate Attention
                      </span>
                      <Badge
                        label={`${atRisk.filter((s) => s.risk === "high").length} high · ${atRisk.filter((s) => s.risk === "medium").length} medium`}
                        bg={T.redSoft}
                        text={T.red}
                        border={T.redBorder}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      {atRisk.slice(0, 4).map((s) => (
                        <div
                          key={s.id}
                          onClick={() => {
                            setTab("roster");
                            setSelectedStu(s);
                          }}
                          className="t-risk-item"
                        >
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: riskConfig[s.risk].dot,
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              flex: 1,
                              fontWeight: 600,
                              fontSize: 13,
                              color: T.textPrimary,
                            }}
                          >
                            {s.name}
                          </span>
                          <span
                            className="t-risk-score"
                            style={{ fontSize: 12, color: T.textSoft }}
                          >
                            GWA {s.q3} · {s.absent} absences
                          </span>
                          <RiskPill risk={s.risk} />
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: trendMap[s.trend].c,
                            }}
                          >
                            {trendMap[s.trend].a}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Husai AI Insights */}
                <Card>
                  <CardHead
                    left={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 52 52"
                          fill="none"
                        >
                          <rect width="52" height="52" rx="10" fill="#18181A" />
                          <line
                            x1="21"
                            y1="18"
                            x2="21"
                            y2="34"
                            stroke="white"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <line
                            x1="31"
                            y1="18"
                            x2="31"
                            y2="34"
                            stroke="white"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <line
                            x1="21"
                            y1="26"
                            x2="31"
                            y2="26"
                            stroke={T.gold}
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 13,
                            color: T.textPrimary,
                          }}
                        >
                          Husai Class Intelligence — {teacher.quarter}
                        </span>
                      </div>
                    }
                    right={<Badge label="AI Generated" />}
                  />
                  <div
                    style={{
                      padding: "16px 18px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {[
                      {
                        type: "red",
                        msg: "4 students flagged for grade decline across 2+ consecutive quarters. Recommend structured intervention before Q4 final exams.",
                      },
                      {
                        type: "amber",
                        msg: "68% of the class scored below 75 in Fractions (MELC M5NS-IIf). A targeted re-teaching session is strongly recommended.",
                      },
                      {
                        type: "blue",
                        msg: "Class average GWA improved by 1.2 points vs Q2. Filipino and Science show the most consistent gains.",
                      },
                      {
                        type: "green",
                        msg: "Attendance is at 91.2% — above the DepEd 90% threshold. 3 students still below 80%. Follow-up needed.",
                      },
                    ].map((ins, i) => {
                      const cfg = {
                        red: {
                          bg: T.redSoft,
                          text: T.red,
                          icon: "!",
                          ib: "#FCA5A5",
                          it: "#7F1D1D",
                        },
                        amber: {
                          bg: T.amberSoft,
                          text: T.amber,
                          icon: "!",
                          ib: "#FDE68A",
                          it: "#92400E",
                        },
                        blue: {
                          bg: T.blueSoft,
                          text: T.blue,
                          icon: "i",
                          ib: "#BFDBFE",
                          it: "#1E40AF",
                        },
                        green: {
                          bg: T.greenSoft,
                          text: T.green,
                          icon: "✓",
                          ib: "#BBF7D0",
                          it: "#166534",
                        },
                      };
                      const c = cfg[ins.type];
                      return (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "flex-start",
                            padding: "11px 14px",
                            borderRadius: 10,
                            background: c.bg,
                            color: c.text,
                            fontSize: 12.5,
                            lineHeight: 1.55,
                          }}
                        >
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              background: c.ib,
                              color: c.it,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              fontSize: 11,
                              fontWeight: 700,
                              marginTop: 1,
                            }}
                          >
                            {c.icon}
                          </div>
                          <div>{ins.msg}</div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* RIGHT COLUMN — Recent Activity */}
              <Card style={{ marginBottom: 0, alignSelf: "start" }}>
                <CardHead
                  left={
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: T.textPrimary,
                      }}
                    >
                      Recent Activity
                    </span>
                  }
                  right={
                    <span style={{ fontSize: 11, color: T.textSoft }}>
                      Section Mabini
                    </span>
                  }
                />
                <div>
                  {recentActivity.map((a, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "11px 16px",
                        borderBottom:
                          i < recentActivity.length - 1
                            ? `1px solid ${T.border}`
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: `${actColor[a.icon]}18`,
                          color: actColor[a.icon],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {actIcon[a.icon]}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 12,
                            color: T.textPrimary,
                            lineHeight: 1.5,
                          }}
                        >
                          {a.text}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: T.textSoft,
                            marginTop: 2,
                          }}
                        >
                          {a.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}

        {/* ══ ROSTER ══ */}
        {tab === "roster" && (
          <>
            {/* Filters */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 14,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <input
                placeholder="Search student…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 180,
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: `1px solid ${T.border}`,
                  fontSize: 13,
                  fontFamily: "inherit",
                  color: T.textPrimary,
                  background: T.surface,
                  outline: "none",
                }}
              />
              {["all", "high", "medium", "low", "none"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterRisk(f)}
                  style={{
                    padding: "7px 14px",
                    border: `1px solid ${filterRisk === f ? T.blue : T.border}`,
                    borderRadius: 20,
                    background: filterRisk === f ? T.blueSoft : T.surface,
                    color: filterRisk === f ? T.blue : T.textMid,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    whiteSpace: "nowrap",
                  }}
                >
                  {f === "all"
                    ? "All Students"
                    : f === "none"
                      ? "On Track"
                      : `${f.charAt(0).toUpperCase() + f.slice(1)} Risk`}
                </button>
              ))}
              <select
                value={sortCol}
                onChange={(e) => setSortCol(e.target.value)}
                style={{
                  padding: "7px 10px",
                  borderRadius: 10,
                  border: `1px solid ${T.border}`,
                  fontSize: 12,
                  fontFamily: "inherit",
                  color: T.textPrimary,
                  background: T.surface,
                }}
              >
                <option value="risk">Sort: Risk</option>
                <option value="gwa">Sort: GWA</option>
                <option value="att">Sort: Attendance</option>
              </select>
            </div>

            <Card>
              {/* Header */}
              <div
                className="t-roster-header"
                style={{
                  background: "#FAFAFA",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: ".09em",
                    textTransform: "uppercase",
                    color: T.textSoft,
                  }}
                ></span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: ".09em",
                    textTransform: "uppercase",
                    color: T.textSoft,
                  }}
                >
                  Student
                </span>
                <span
                  className="t-col-q1"
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: T.textSoft,
                    textAlign: "center",
                  }}
                >
                  Q1
                </span>
                <span
                  className="t-col-q2"
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: T.textSoft,
                    textAlign: "center",
                  }}
                >
                  Q2
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: T.blue,
                    textAlign: "center",
                  }}
                >
                  Q3 ▾
                </span>
                <span
                  className="t-col-att"
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: T.textSoft,
                  }}
                >
                  Attendance
                </span>
                <span
                  className="t-col-risk-full"
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: T.textSoft,
                  }}
                >
                  Risk
                </span>
                <span
                  className="t-col-trend"
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: T.textSoft,
                  }}
                >
                  ▲
                </span>
              </div>
              {filteredRoster.map((stu, i) => (
                <div key={stu.id}>
                  <StudentRow
                    stu={stu}
                    onSelect={(s) =>
                      setSelectedStu(selectedStu?.id === s.id ? null : s)
                    }
                    selected={selectedStu?.id === stu.id}
                  />
                  {selectedStu?.id === stu.id && (
                    <div style={{ padding: "0 16px 14px" }}>
                      <StudentDrawer
                        stu={selectedStu}
                        onClose={() => setSelectedStu(null)}
                        onSaveObs={saveObs}
                      />
                    </div>
                  )}
                </div>
              ))}
              {filteredRoster.length === 0 && (
                <div
                  style={{
                    padding: "32px 0",
                    textAlign: "center",
                    color: T.textSoft,
                    fontSize: 13,
                  }}
                >
                  No students match the current filter.
                </div>
              )}
            </Card>

            {/* Legend */}
            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                padding: "8px 0",
              }}
            >
              {Object.entries(riskConfig).map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 11,
                    color: T.textSoft,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: v.dot,
                    }}
                  />
                  {v.label}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ══ LEARNING GAPS ══ */}
        {tab === "gaps" && (
          <>
            <div
              style={{
                marginBottom: 14,
                padding: "14px 18px",
                background: T.blueSoft,
                border: `1px solid ${T.blueBorder}`,
                borderRadius: 14,
                fontSize: 12.5,
                color: T.blueDeep,
                lineHeight: 1.6,
              }}
            >
              <strong>Husai Learning Gap Analysis:</strong> Based on Q3 quiz and
              assessment data across all 34 students. Competencies are mapped to
              DepEd's Most Essential Learning Competencies (MELC) framework.
              Percentages indicate the share of students who scored below the
              75% mastery threshold.
            </div>

            <Card>
              <CardHead
                left={
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: T.textPrimary,
                    }}
                  >
                    Class-Wide MELC Gap Summary
                  </span>
                }
                right={<Badge label="Q3 · Auto-Analyzed" />}
              />
              <div style={{ padding: "4px 18px 10px" }}>
                <div
                  className="t-gap-header"
                  style={{
                    padding: "8px 0",
                    borderBottom: `1px solid ${T.border}`,
                  }}
                >
                  {["Competency", "Affected", "Gap%"].map((h) => (
                    <span
                      key={h}
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: ".09em",
                        textTransform: "uppercase",
                        color: T.textSoft,
                      }}
                    >
                      {h}
                    </span>
                  ))}
                  <span
                    className="t-col-sev"
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: ".09em",
                      textTransform: "uppercase",
                      color: T.textSoft,
                    }}
                  >
                    Severity
                  </span>
                </div>
                {learningGaps.map((g, i) => (
                  <GapRow key={i} gap={g} />
                ))}
              </div>
            </Card>

            <Card>
              <CardHead
                left={
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: T.textPrimary,
                    }}
                  >
                    Recommended Actions
                  </span>
                }
                right={<Badge label="AI Suggested" />}
              />
              <div
                style={{
                  padding: "14px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {[
                  {
                    n: 1,
                    action:
                      "Schedule a 2-session re-teaching block for Fractions (M5NS-IIf) — 22 students affected.",
                    tag: "High Priority",
                  },
                  {
                    n: 2,
                    action:
                      "Pair top English readers (Ana Lim, Rosa Garcia) with struggling peers for guided reading sessions.",
                    tag: "Peer Support",
                  },
                  {
                    n: 3,
                    action:
                      "Assign Maria Santos and Carlo Bautista for individualized intervention — contact parents this week.",
                    tag: "Urgent",
                  },
                  {
                    n: 4,
                    action:
                      "Auto-generate SF9 records for Q2 — pending teacher review before printing.",
                    tag: "DepEd Record",
                  },
                ].map((a) => (
                  <div
                    key={a.n}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: "11px 14px",
                      borderRadius: 10,
                      background: "#F8FAFF",
                      border: `1px solid ${T.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: T.blue,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {a.n}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        fontSize: 12.5,
                        color: T.textPrimary,
                        lineHeight: 1.5,
                      }}
                    >
                      {a.action}
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: 20,
                        background: T.blueSoft,
                        color: T.blue,
                        border: `1px solid ${T.blueBorder}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {a.tag}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* ══ QUICK ENTRY ══ */}
        {tab === "entry" && (
          <>
            {!showEntry && (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div
                  style={{
                    fontFamily: "'DM Serif Display',serif",
                    fontSize: 22,
                    color: T.textPrimary,
                    marginBottom: 8,
                  }}
                >
                  Quick Data Entry
                </div>
                <div
                  style={{ fontSize: 13, color: T.textSoft, marginBottom: 20 }}
                >
                  Record quiz scores, attendance, or teacher observations in
                  seconds.
                </div>
                <button
                  onClick={() => setShowEntry(true)}
                  style={{
                    background: T.blue,
                    color: "white",
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 28px",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Open Entry Form
                </button>
              </div>
            )}
            {showEntry && <QuickEntry onClose={() => setShowEntry(false)} />}
          </>
        )}

        {/* ══ SF9 / SF10 ══ */}
        {tab === "records" && (
          <>
            <div className="t-sf-grid" style={{ marginBottom: 14 }}>
              {[
                {
                  form: "SF9",
                  title: "School Form 9 — Learner's Progress Report",
                  desc: "Quarterly grades per subject for each student. Auto-populated from Husai grade data.",
                  status: "Ready",
                  statusC: T.green,
                  badge: "Q2 Complete",
                },
                {
                  form: "SF10",
                  title: "School Form 10 — Learner's Permanent Academic Record",
                  desc: "Cumulative academic record across all grade levels. Pulls from longitudinal student profile.",
                  status: "Partial",
                  statusC: T.amber,
                  badge: "Pending Q3 Final",
                },
              ].map((f) => (
                <Card key={f.form} style={{ marginBottom: 0 }}>
                  <div style={{ padding: "16px 18px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: 22,
                          color: T.blue,
                          fontFamily: "'DM Serif Display',serif",
                        }}
                      >
                        {f.form}
                      </div>
                      <Badge
                        label={f.badge}
                        bg={f.status === "Ready" ? T.greenSoft : T.amberSoft}
                        text={f.status === "Ready" ? T.green : T.amber}
                        border={
                          f.status === "Ready" ? T.greenBorder : T.amberBorder
                        }
                      />
                    </div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: T.textPrimary,
                        marginBottom: 4,
                      }}
                    >
                      {f.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: T.textMid,
                        lineHeight: 1.5,
                        marginBottom: 14,
                      }}
                    >
                      {f.desc}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        style={{
                          flex: 1,
                          background: T.blue,
                          color: "white",
                          border: "none",
                          borderRadius: 10,
                          padding: "9px 0",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        Preview {f.form}
                      </button>
                      <button
                        style={{
                          flex: 1,
                          background: T.surface,
                          color: T.blue,
                          border: `1.5px solid ${T.blueBorder}`,
                          borderRadius: 10,
                          padding: "9px 0",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card>
              <CardHead
                left={
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: T.textPrimary,
                    }}
                  >
                    Record Status — All Students
                  </span>
                }
                right={<Badge label={`${classStats.total} students`} />}
              />
              <div>
                {students.slice(0, 8).map((stu, i) => (
                  <div
                    key={stu.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "10px 18px",
                      borderBottom: i < 7 ? `1px solid ${T.border}` : "none",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        flex: 1,
                        color: T.textPrimary,
                      }}
                    >
                      {stu.name}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {["Q1", "Q2", "Q3"].map((q, qi) => (
                        <span
                          key={q}
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: qi < 2 ? T.greenSoft : T.blueSoft,
                            color: qi < 2 ? T.green : T.blue,
                            border: `1px solid ${qi < 2 ? T.greenBorder : T.blueBorder}`,
                          }}
                        >
                          {q} {qi < 2 ? "✓" : "Pending"}
                        </span>
                      ))}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: T.textSoft,
                        minWidth: 60,
                        textAlign: "right",
                      }}
                    >
                      GWA {stu.gwa}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    padding: "10px 18px",
                    fontSize: 12,
                    color: T.textSoft,
                    textAlign: "center",
                  }}
                >
                  + {classStats.total - 8} more students · All SF9 Q2 records
                  auto-generated
                </div>
              </div>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
