import { useState } from "react";

// ── HUSAI TOKENS: White + Red (Admin/Principal Role) ──────────────────────────
const T = {
  red: "#CE1127",
  redMid: "#A50E1F",
  redDeep: "#7A0C18",
  redSoft: "#FEF2F4",
  redPale: "#FFF8F9",
  redBorder: "#F5A8B2",
  gold: "#F5C842",
  goldSoft: "#FDF3C8",
  goldBorder: "#EDD96A",
  blue: "#0038A8",
  blueSoft: "#EBF0FF",
  blueBorder: "#A8BFFF",
  green: "#22863A",
  greenSoft: "#F0FAF3",
  greenBorder: "#86EFAC",
  amber: "#B45309",
  amberSoft: "#FFFBEB",
  amberBorder: "#FCD34D",
  textPrimary: "#18181A",
  textMid: "#5C5C66",
  textSoft: "#9999A8",
  border: "#EBEBEE",
  surface: "#FFFFFF",
  page: "#FFF8F9",
};

// ── DATA ─────────────────────────────────────────────────────────────────────
const school = {
  name: "Mabini Elementary School",
  address: "Mabini St., Manila, NCR",
  id: "NCR-MNL-0042",
  principal: "Dr. Maria Reyes",
  avatar: "MR",
  sy: "S.Y. 2024–2025",
  quarter: "Q3",
  division: "Manila City Division",
};

const schoolStats = {
  enrolled: 1240,
  passing: 1074,
  atRisk: 87,
  dropout: 4,
  avgGwa: 83.7,
  attendance: 91.4,
  teachers: 38,
  sections: 34,
};

const sections = [
  {
    name: "Gr.6 Rizal",
    adviser: "Mr. Cruz",
    enrolled: 36,
    passing: 32,
    avgGwa: 86.2,
    attendance: 93,
    atRisk: 1,
    trend: "up",
  },
  {
    name: "Gr.6 Bonifacio",
    adviser: "Mrs. Lim",
    enrolled: 35,
    passing: 28,
    avgGwa: 81.4,
    attendance: 89,
    atRisk: 4,
    trend: "down",
  },
  {
    name: "Gr.5 Mabini",
    adviser: "Mrs. Santos",
    enrolled: 34,
    passing: 28,
    avgGwa: 83.4,
    attendance: 91,
    atRisk: 4,
    trend: "up",
  },
  {
    name: "Gr.5 Luna",
    adviser: "Mr. Garcia",
    enrolled: 35,
    passing: 31,
    avgGwa: 84.7,
    attendance: 92,
    atRisk: 2,
    trend: "stable",
  },
  {
    name: "Gr.4 Aguinaldo",
    adviser: "Mrs. Torres",
    enrolled: 36,
    passing: 30,
    avgGwa: 82.1,
    attendance: 88,
    atRisk: 5,
    trend: "down",
  },
  {
    name: "Gr.4 Del Pilar",
    adviser: "Mr. Bautista",
    enrolled: 33,
    passing: 28,
    avgGwa: 83.9,
    attendance: 90,
    atRisk: 3,
    trend: "stable",
  },
  {
    name: "Gr.3 Quezon",
    adviser: "Mrs. Reyes",
    enrolled: 37,
    passing: 34,
    avgGwa: 87.3,
    attendance: 95,
    atRisk: 1,
    trend: "up",
  },
  {
    name: "Gr.3 Osmeña",
    adviser: "Mr. Dela Cruz",
    enrolled: 36,
    passing: 27,
    avgGwa: 79.6,
    attendance: 85,
    atRisk: 7,
    trend: "down",
  },
  {
    name: "Gr.2 Laurel",
    adviser: "Mrs. Ocampo",
    enrolled: 38,
    passing: 35,
    avgGwa: 88.1,
    attendance: 96,
    atRisk: 1,
    trend: "up",
  },
  {
    name: "Gr.2 Recto",
    adviser: "Mr. Flores",
    enrolled: 36,
    passing: 29,
    avgGwa: 80.2,
    attendance: 87,
    atRisk: 5,
    trend: "down",
  },
  {
    name: "Gr.1 Ramos",
    adviser: "Mrs. Chua",
    enrolled: 40,
    passing: 36,
    avgGwa: 85.0,
    attendance: 93,
    atRisk: 2,
    trend: "stable",
  },
  {
    name: "Gr.1 Magsaysay",
    adviser: "Mr. Tan",
    enrolled: 38,
    passing: 30,
    avgGwa: 78.4,
    attendance: 84,
    atRisk: 7,
    trend: "down",
  },
];

const dropoutRisk = [
  {
    name: "Miguel Cruz",
    section: "Gr.6 Rizal",
    gwa: 62,
    attendance: 68,
    flags: ["Grades", "Absent", "Disengaged"],
    level: "critical",
  },
  {
    name: "Lani Torres",
    section: "Gr.5 Mabini",
    gwa: 71,
    attendance: 75,
    flags: ["Grades", "Absent"],
    level: "high",
  },
  {
    name: "Carlo Bautista",
    section: "Gr.5 Mabini",
    gwa: 73,
    attendance: 80,
    flags: ["Grades", "Declining"],
    level: "high",
  },
  {
    name: "Maria Santos",
    section: "Gr.5 Mabini",
    gwa: 67,
    attendance: 78,
    flags: ["Grades", "Absent", "Parent"],
    level: "critical",
  },
  {
    name: "Ben Dela Cruz",
    section: "Gr.3 Osmeña",
    gwa: 74,
    attendance: 82,
    flags: ["Grades", "Absent"],
    level: "high",
  },
  {
    name: "Rina Magsaysay",
    section: "Gr.1 Magsaysay",
    gwa: 70,
    attendance: 79,
    flags: ["Absent", "Disengaged"],
    level: "high",
  },
  {
    name: "Tom Recto",
    section: "Gr.2 Recto",
    gwa: 76,
    attendance: 85,
    flags: ["Declining"],
    level: "medium",
  },
  {
    name: "Ana Bonifacio",
    section: "Gr.6 Bonifacio",
    gwa: 74,
    attendance: 83,
    flags: ["Grades", "Declining"],
    level: "medium",
  },
];

const quarterlyTrend = [
  { label: "Q1 '23", gwa: 81.2, att: 89.1, pass: 83 },
  { label: "Q2 '23", gwa: 82.0, att: 90.3, pass: 84 },
  { label: "Q3 '23", gwa: 81.7, att: 88.7, pass: 83 },
  { label: "Q4 '23", gwa: 82.5, att: 90.8, pass: 85 },
  { label: "Q1 '24", gwa: 82.8, att: 90.2, pass: 85 },
  { label: "Q2 '24", gwa: 83.2, att: 91.0, pass: 86 },
  { label: "Q3 '24", gwa: 83.7, att: 91.4, pass: 87 },
];

const teacherLoad = [
  {
    name: "Mrs. Santos",
    section: "Gr.5 Mabini",
    atRisk: 4,
    adminHrs: 14,
    status: "overloaded",
  },
  {
    name: "Mr. Cruz",
    section: "Gr.6 Rizal",
    atRisk: 1,
    adminHrs: 8,
    status: "normal",
  },
  {
    name: "Mr. Dela Cruz",
    section: "Gr.3 Osmeña",
    atRisk: 7,
    adminHrs: 16,
    status: "overloaded",
  },
  {
    name: "Mr. Flores",
    section: "Gr.2 Recto",
    atRisk: 5,
    adminHrs: 15,
    status: "overloaded",
  },
  {
    name: "Mrs. Lim",
    section: "Gr.6 Bonifacio",
    atRisk: 4,
    adminHrs: 13,
    status: "elevated",
  },
  {
    name: "Mrs. Torres",
    section: "Gr.4 Aguinaldo",
    atRisk: 5,
    adminHrs: 12,
    status: "elevated",
  },
  {
    name: "Mrs. Reyes",
    section: "Gr.3 Quezon",
    atRisk: 1,
    adminHrs: 7,
    status: "normal",
  },
  {
    name: "Mrs. Ocampo",
    section: "Gr.2 Laurel",
    atRisk: 1,
    adminHrs: 9,
    status: "normal",
  },
];

const aiNarrative = `Mabini Elementary School's Q3 performance shows a positive upward trajectory. The school's General Weighted Average has improved to 83.7, up 0.5 points from Q2 and the highest recorded in the current school year. Attendance remains above DepEd's 90% threshold at 91.4%.

However, critical attention is needed in three areas: (1) Grade 1 Magsaysay and Grade 3 Osmeña sections are significantly below the school average in both GWA and attendance; (2) 4 students are flagged as critical dropout risks requiring immediate parent conferences and intervention plans; (3) Three teachers are carrying administrative workloads exceeding 14 hours per week, contrary to DepEd Order No. 002 s. 2024.

Recommended immediate actions: Deploy reading intervention for Grade 3 Osmeña (7 at-risk students), schedule parent conferences for the 4 critical dropout cases, and redistribute administrative duties per DepEd order.`;

// ── HELPERS ──────────────────────────────────────────────────────────────────
function gradeInfo(s) {
  if (s >= 90) return { label: "Outstanding", c: T.green };
  if (s >= 85) return { label: "Very Satisfactory", c: T.blue };
  if (s >= 80) return { label: "Satisfactory", c: "#C9A227" };
  if (s >= 75) return { label: "Fairly Satisfactory", c: T.amber };
  return { label: "Did Not Meet", c: T.red };
}

const trendMap = { up: "↑", down: "↓", stable: "→" };
const trendColor = { up: T.green, down: T.red, stable: T.amber };

const riskLevelCfg = {
  critical: {
    bg: "#FEF2F4",
    text: T.red,
    border: T.redBorder,
    dot: "#EF4444",
    label: "Critical",
  },
  high: {
    bg: "#FFFBEB",
    text: T.amber,
    border: T.amberBorder,
    dot: "#F59E0B",
    label: "High Risk",
  },
  medium: {
    bg: "#FEF9EE",
    text: "#92400E",
    border: "#FDE68A",
    dot: "#FCD34D",
    label: "Medium",
  },
};

const loadCfg = {
  overloaded: {
    bg: T.redSoft,
    text: T.red,
    border: T.redBorder,
    label: "Overloaded",
  },
  elevated: {
    bg: T.amberSoft,
    text: T.amber,
    border: T.amberBorder,
    label: "Elevated",
  },
  normal: {
    bg: T.greenSoft,
    text: T.green,
    border: T.greenBorder,
    label: "Normal",
  },
};

// ── SHARED COMPONENTS ────────────────────────────────────────────────────────
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

const StatCard = ({ label, value, sub, accent, valueColor }) => (
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
        background: accent || T.red,
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
        color: valueColor || T.textPrimary,
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

const AiBadge = () => (
  <span
    style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: ".06em",
      textTransform: "uppercase",
      padding: "3px 9px",
      borderRadius: 20,
      background: T.redSoft,
      color: T.red,
      border: `1px solid ${T.redBorder}`,
    }}
  >
    AI Generated
  </span>
);

const RiskPill = ({ level }) => {
  const c = riskLevelCfg[level] || riskLevelCfg.medium;
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: 20,
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {c.label}
    </span>
  );
};

// Mini sparkline bar chart
const SparkBar = ({ data, color = "#CE1127", height = 36 }) => {
  const min = Math.min(...data) - 1;
  const max = Math.max(...data) + 1;
  const w = 6,
    gap = 3;
  const totalW = data.length * (w + gap) - gap;
  return (
    <svg width={totalW} height={height} viewBox={`0 0 ${totalW} ${height}`}>
      {data.map((v, i) => {
        const barH = Math.max(2, ((v - min) / (max - min)) * (height - 4));
        const x = i * (w + gap);
        return (
          <rect
            key={i}
            x={x}
            y={height - barH}
            width={w}
            height={barH}
            rx="2"
            fill={i === data.length - 1 ? color : `${color}55`}
          />
        );
      })}
    </svg>
  );
};

// Trend line SVG
const TrendLine = ({ data, color = "#CE1127", width = 120, height = 40 }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * (width - 8) + 4;
      const y = height - 4 - ((v - min) / range) * (height - 12);
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * (width - 8) + 4;
        const y = height - 4 - ((v - min) / range) * (height - 12);
        return i === data.length - 1 ? (
          <circle key={i} cx={x} cy={y} r="3" fill={color} />
        ) : null;
      })}
    </svg>
  );
};

// Section comparison row
const SectionRow = ({ sec, rank, onClick, selected }) => {
  const g = gradeInfo(sec.avgGwa);
  const passPct = Math.round((sec.passing / sec.enrolled) * 100);
  return (
    <div
      onClick={onClick}
      style={{
        display: "grid",
        gridTemplateColumns: "24px 1fr 52px 52px 80px 70px 60px 20px",
        gap: 10,
        alignItems: "center",
        padding: "11px 16px",
        borderBottom: `1px solid ${T.border}`,
        cursor: "pointer",
        background: selected ? T.redPale : "transparent",
        transition: "background .12s",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: rank <= 3 ? T.red : T.textSoft,
          textAlign: "center",
        }}
      >
        #{rank}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>
          {sec.name}
        </div>
        <div style={{ fontSize: 10, color: T.textSoft, marginTop: 1 }}>
          {sec.adviser}
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            fontFamily: "'DM Serif Display',serif",
            fontSize: 17,
            color: g.c,
            fontWeight: 400,
          }}
        >
          {sec.avgGwa}
        </span>
      </div>
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: sec.attendance < 90 ? T.red : T.green,
          }}
        >
          {sec.attendance}%
        </span>
      </div>
      <div>
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
              width: `${passPct}%`,
              height: "100%",
              background:
                passPct < 80 ? T.red : passPct < 90 ? T.amber : T.green,
              borderRadius: 3,
            }}
          />
        </div>
        <div style={{ fontSize: 10, color: T.textSoft, textAlign: "right" }}>
          {sec.passing}/{sec.enrolled}
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "2px 7px",
            borderRadius: 6,
            background:
              sec.atRisk > 5
                ? T.redSoft
                : sec.atRisk > 2
                  ? T.amberSoft
                  : T.greenSoft,
            color: sec.atRisk > 5 ? T.red : sec.atRisk > 2 ? T.amber : T.green,
            border: `1px solid ${sec.atRisk > 5 ? T.redBorder : sec.atRisk > 2 ? T.amberBorder : T.greenBorder}`,
          }}
        >
          {sec.atRisk} at-risk
        </span>
      </div>
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: trendColor[sec.trend],
          }}
        >
          {trendMap[sec.trend]}
        </span>
      </div>
      <div style={{ fontSize: 10, color: T.textSoft }}>›</div>
    </div>
  );
};

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function HusaiAdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [selectedSec, setSelectedSec] = useState(null);
  const [sortCol, setSortCol] = useState("gwa");
  const [riskFilter, setRiskFilter] = useState("all");
  const [narrativeExpanded, setNarrativeExpanded] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "sections", label: `Sections (${sections.length})` },
    { id: "dropout", label: "Dropout Radar" },
    { id: "trend", label: "Historical Trend" },
    { id: "teachers", label: "Teacher Load" },
    { id: "narrative", label: "AI Report" },
  ];

  const sortedSections = [...sections].sort((a, b) => {
    if (sortCol === "gwa") return b.avgGwa - a.avgGwa;
    if (sortCol === "att") return b.attendance - a.attendance;
    if (sortCol === "risk") return b.atRisk - a.atRisk;
    return 0;
  });

  const filteredRisk =
    riskFilter === "all"
      ? dropoutRisk
      : dropoutRisk.filter((s) => s.level === riskFilter);

  const gwaHistory = quarterlyTrend.map((q) => q.gwa);
  const attHistory = quarterlyTrend.map((q) => q.att);
  const passHistory = quarterlyTrend.map((q) => q.pass);

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
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:none; } }
      `}</style>

      {/* ── NAV ── */}
      <header
        style={{
          background: T.surface,
          borderBottom: `1px solid ${T.border}`,
          height: 58,
          padding: "0 24px",
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
              {school.principal}
            </div>
            <div style={{ fontSize: 10, color: T.textSoft }}>
              {school.name} · Admin View
            </div>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: T.red,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 13,
              color: "white",
            }}
          >
            {school.avatar}
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <div
        style={{
          background: T.surface,
          borderBottom: `1px solid ${T.border}`,
          padding: "26px 24px 22px",
        }}
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
            color: T.red,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: T.red,
              display: "inline-block",
            }}
          />
          Principal Dashboard
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'DM Serif Display',serif",
                fontSize: 28,
                color: T.textPrimary,
                lineHeight: 1.1,
                letterSpacing: "-.3px",
                margin: 0,
              }}
            >
              {school.name}
            </h1>
            <p
              style={{ fontSize: 13, color: T.textSoft, margin: "5px 0 10px" }}
            >
              {school.address} · {school.division}
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[
                school.sy,
                school.quarter + " · DepEd",
                `ID: ${school.id}`,
                `${school.sections} sections`,
                `${school.teachers} teachers`,
              ].map((c) => (
                <span
                  key={c}
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    padding: "4px 10px",
                    borderRadius: 20,
                    background: T.redSoft,
                    color: T.red,
                    border: `1px solid ${T.redBorder}`,
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          {/* School GWA box */}
          <div
            style={{
              textAlign: "center",
              padding: "16px 24px",
              border: `1.5px solid ${T.redBorder}`,
              borderRadius: 16,
              background: T.redPale,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: T.red,
                marginBottom: 6,
              }}
            >
              School GWA
            </div>
            <div
              style={{
                fontFamily: "'DM Serif Display',serif",
                fontSize: 48,
                color: T.textPrimary,
                lineHeight: 1,
                letterSpacing: "-2px",
              }}
            >
              {schoolStats.avgGwa}
            </div>
            <div
              style={{
                fontSize: 12,
                color: T.red,
                fontWeight: 500,
                marginTop: 3,
              }}
            >
              {gradeInfo(schoolStats.avgGwa).label}
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div
        style={{
          background: T.surface,
          borderBottom: `1px solid ${T.border}`,
          padding: "0 24px",
          display: "flex",
          gap: 0,
          overflowX: "auto",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "13px 14px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: tab === t.id ? 700 : 500,
              color: tab === t.id ? T.textPrimary : T.textSoft,
              borderBottom: `2px solid ${tab === t.id ? T.red : "transparent"}`,
              transition: "all .15s",
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── MAIN ── */}
      <main
        style={{ maxWidth: 1000, margin: "0 auto", padding: "22px 24px 52px" }}
      >
        {/* ══ OVERVIEW ══ */}
        {tab === "overview" && (
          <>
            {/* Stat cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,minmax(0,1fr))",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <StatCard
                label="Total Enrolled"
                value={schoolStats.enrolled.toLocaleString()}
                sub="All grades"
                accent={T.red}
              />
              <StatCard
                label="Passing"
                value={schoolStats.passing.toLocaleString()}
                sub={`${Math.round((schoolStats.passing / schoolStats.enrolled) * 100)}% pass rate`}
                accent={T.green}
              />
              <StatCard
                label="At-Risk Students"
                value={schoolStats.atRisk}
                sub="Need intervention"
                accent={T.amber}
                valueColor={T.amber}
              />
              <StatCard
                label="Dropout Risk"
                value={schoolStats.dropout}
                sub="Critical flags"
                accent={T.red}
                valueColor={T.red}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,minmax(0,1fr))",
                gap: 10,
                marginBottom: 18,
              }}
            >
              <StatCard
                label="School Avg GWA"
                value={schoolStats.avgGwa}
                sub="↑ +0.5 from Q2"
                accent={T.red}
              />
              <StatCard
                label="Attendance Rate"
                value={`${schoolStats.attendance}%`}
                sub="Above 90% threshold"
                accent={T.green}
              />
              <StatCard
                label="Teaching Staff"
                value={schoolStats.teachers}
                sub={`${sections.length} sections`}
                accent={T.textSoft}
              />
              <StatCard
                label="Quarter"
                value={school.quarter}
                sub={school.sy}
                accent={T.goldBorder}
              />
            </div>

            {/* Husai AI Overview */}
            <Card>
              <CardHead
                left={
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 52 52" fill="none">
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
                    <span style={{ fontWeight: 700, fontSize: 13 }}>
                      Husai School Intelligence — {school.quarter}
                    </span>
                  </div>
                }
                right={<AiBadge />}
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
                    text: `4 students are at critical dropout risk. Immediate parent conferences and intervention plans required before Q4.`,
                  },
                  {
                    type: "amber",
                    text: `Gr.3 Osmeña and Gr.1 Magsaysay sections are significantly below the school GWA. Targeted support needed.`,
                  },
                  {
                    type: "blue",
                    text: `School GWA has improved steadily over 7 consecutive quarters — now at its highest point this academic year.`,
                  },
                  {
                    type: "green",
                    text: `Attendance is at 91.4%, above DepEd's 90% mandate. 3 sections still below threshold — follow-up required.`,
                  },
                ].map((ins, i) => {
                  const m = {
                    red: {
                      bg: T.redSoft,
                      text: T.red,
                      ib: "#FCA5A5",
                      it: "#7F1D1D",
                      icon: "!",
                    },
                    amber: {
                      bg: T.amberSoft,
                      text: T.amber,
                      ib: "#FDE68A",
                      it: "#92400E",
                      icon: "!",
                    },
                    blue: {
                      bg: T.blueSoft,
                      text: T.blue,
                      ib: "#BFDBFE",
                      it: "#1E40AF",
                      icon: "i",
                    },
                    green: {
                      bg: T.greenSoft,
                      text: T.green,
                      ib: "#BBF7D0",
                      it: "#166534",
                      icon: "✓",
                    },
                  }[ins.type];
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                        padding: "11px 14px",
                        borderRadius: 10,
                        background: m.bg,
                        color: m.text,
                        fontSize: 12.5,
                        lineHeight: 1.55,
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: m.ib,
                          color: m.it,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontSize: 11,
                          fontWeight: 700,
                          marginTop: 1,
                        }}
                      >
                        {m.icon}
                      </div>
                      <div>{ins.text}</div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* GWA Trend + Attendance at a glance */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <Card style={{ marginBottom: 0 }}>
                <CardHead
                  left={
                    <span style={{ fontWeight: 700, fontSize: 13 }}>
                      GWA Trend (7 Quarters)
                    </span>
                  }
                  right={
                    <span style={{ fontSize: 11, color: T.textSoft }}>
                      Last 7 quarters
                    </span>
                  }
                />
                <div style={{ padding: "16px 18px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "'DM Serif Display',serif",
                          fontSize: 32,
                          color: T.textPrimary,
                          lineHeight: 1,
                        }}
                      >
                        {schoolStats.avgGwa}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: T.green,
                          fontWeight: 600,
                          marginTop: 2,
                        }}
                      >
                        ↑ +0.5 from Q2 · Highest this SY
                      </div>
                    </div>
                    <TrendLine
                      data={gwaHistory}
                      color={T.red}
                      width={110}
                      height={44}
                    />
                  </div>
                  {quarterlyTrend.slice(-4).map((q, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "5px 0",
                        borderBottom: `0.5px solid ${T.border}`,
                        fontSize: 12,
                      }}
                    >
                      <span style={{ color: T.textMid }}>{q.label}</span>
                      <span
                        style={{ fontWeight: 600, color: gradeInfo(q.gwa).c }}
                      >
                        {q.gwa}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card style={{ marginBottom: 0 }}>
                <CardHead
                  left={
                    <span style={{ fontWeight: 700, fontSize: 13 }}>
                      Attendance Overview
                    </span>
                  }
                  right={
                    <span style={{ fontSize: 11, color: T.textSoft }}>
                      Q3 by section count
                    </span>
                  }
                />
                <div style={{ padding: "16px 18px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "'DM Serif Display',serif",
                          fontSize: 32,
                          color: T.textPrimary,
                          lineHeight: 1,
                        }}
                      >
                        {schoolStats.attendance}%
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: T.green,
                          fontWeight: 600,
                          marginTop: 2,
                        }}
                      >
                        Above DepEd 90% mandate
                      </div>
                    </div>
                    <TrendLine
                      data={attHistory}
                      color={T.green}
                      width={110}
                      height={44}
                    />
                  </div>
                  {[
                    {
                      label: "Above 95%",
                      n: sections.filter((s) => s.attendance >= 95).length,
                      c: T.green,
                    },
                    {
                      label: "90–94%",
                      n: sections.filter(
                        (s) => s.attendance >= 90 && s.attendance < 95,
                      ).length,
                      c: T.blue,
                    },
                    {
                      label: "Below 90%",
                      n: sections.filter((s) => s.attendance < 90).length,
                      c: T.red,
                    },
                  ].map((r) => (
                    <div
                      key={r.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{ fontSize: 12, color: T.textMid, width: 88 }}
                      >
                        {r.label}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 6,
                          background: "#F0F0F2",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${(r.n / sections.length) * 100}%`,
                            height: "100%",
                            background: r.c,
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: r.c,
                          width: 24,
                          textAlign: "right",
                        }}
                      >
                        {r.n}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}

        {/* ══ SECTIONS ══ */}
        {tab === "sections" && (
          <>
            {/* Sort controls */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 14,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{ fontSize: 12, color: T.textSoft, fontWeight: 500 }}
              >
                Sort by:
              </span>
              {[
                ["gwa", "GWA"],
                ["att", "Attendance"],
                ["risk", "At-Risk"],
              ].map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setSortCol(k)}
                  style={{
                    padding: "6px 14px",
                    border: `1px solid ${sortCol === k ? T.red : T.border}`,
                    borderRadius: 20,
                    background: sortCol === k ? T.redSoft : T.surface,
                    color: sortCol === k ? T.red : T.textMid,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {l}
                </button>
              ))}
              <span
                style={{ marginLeft: "auto", fontSize: 12, color: T.textSoft }}
              >
                {sections.length} sections · {schoolStats.enrolled} students
                total
              </span>
            </div>

            {/* Section summary cards (top 3) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 10,
                marginBottom: 14,
              }}
            >
              {[
                {
                  label: "Top Performing",
                  sec: [...sections].sort((a, b) => b.avgGwa - a.avgGwa)[0],
                  color: T.green,
                  icon: "↑",
                },
                {
                  label: "Most Improved",
                  sec: sections.find(
                    (s) =>
                      s.trend === "up" &&
                      s.name !== "Gr.2 Laurel" &&
                      s.name !== "Gr.3 Quezon",
                  ),
                  color: T.blue,
                  icon: "↗",
                },
                {
                  label: "Needs Attention",
                  sec: [...sections].sort((a, b) => a.avgGwa - b.avgGwa)[0],
                  color: T.red,
                  icon: "⚠",
                },
              ].map(
                (item) =>
                  item.sec && (
                    <div
                      key={item.label}
                      style={{
                        border: `1px solid ${T.border}`,
                        borderRadius: 14,
                        padding: "14px 16px",
                        background: T.surface,
                        borderTop: `3px solid ${item.color}`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: ".08em",
                          textTransform: "uppercase",
                          color: item.color,
                          marginBottom: 6,
                        }}
                      >
                        {item.icon} {item.label}
                      </div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          color: T.textPrimary,
                        }}
                      >
                        {item.sec.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: T.textSoft,
                          marginTop: 2,
                        }}
                      >
                        {item.sec.adviser}
                      </div>
                      <div
                        style={{
                          fontFamily: "'DM Serif Display',serif",
                          fontSize: 26,
                          color: gradeInfo(item.sec.avgGwa).c,
                          marginTop: 8,
                          lineHeight: 1,
                        }}
                      >
                        {item.sec.avgGwa}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: T.textSoft,
                          marginTop: 2,
                        }}
                      >
                        Avg GWA · {item.sec.attendance}% attendance
                      </div>
                    </div>
                  ),
              )}
            </div>

            {/* Full table */}
            <Card>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "24px 1fr 52px 52px 80px 70px 60px 20px",
                  gap: 10,
                  padding: "9px 16px",
                  background: "#FAFAFA",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                {[
                  "#",
                  "Section",
                  "GWA",
                  "Att",
                  "Pass Rate",
                  "At-Risk",
                  "Trend",
                  "",
                ].map((h, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: ".09em",
                      textTransform: "uppercase",
                      color: T.textSoft,
                      textAlign: i > 1 && i < 7 ? "center" : "left",
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>
              {sortedSections.map((sec, i) => (
                <div key={sec.name}>
                  <SectionRow
                    sec={sec}
                    rank={i + 1}
                    onClick={() =>
                      setSelectedSec(
                        selectedSec?.name === sec.name ? null : sec,
                      )
                    }
                    selected={selectedSec?.name === sec.name}
                  />
                  {selectedSec?.name === sec.name && (
                    <div
                      style={{
                        padding: "0 16px 16px",
                        animation: "fadeUp .2s ease",
                      }}
                    >
                      <div
                        style={{
                          border: `1.5px solid ${T.redBorder}`,
                          borderRadius: 14,
                          background: T.redPale,
                          padding: 18,
                          marginTop: 4,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            flexWrap: "wrap",
                            gap: 12,
                            marginBottom: 16,
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontWeight: 700,
                                fontSize: 16,
                                color: T.textPrimary,
                              }}
                            >
                              {sec.name}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: T.textMid,
                                marginTop: 3,
                              }}
                            >
                              Adviser: {sec.adviser} · {sec.enrolled} students
                              enrolled
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              style={{
                                background: T.red,
                                color: "white",
                                border: "none",
                                borderRadius: 9,
                                padding: "7px 14px",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              View Class Roster
                            </button>
                            <button
                              style={{
                                background: T.surface,
                                color: T.red,
                                border: `1.5px solid ${T.redBorder}`,
                                borderRadius: 9,
                                padding: "7px 14px",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Generate Report
                            </button>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4,1fr)",
                            gap: 10,
                          }}
                        >
                          {[
                            {
                              l: "Avg GWA",
                              v: sec.avgGwa,
                              c: gradeInfo(sec.avgGwa).c,
                            },
                            {
                              l: "Pass Rate",
                              v: `${Math.round((sec.passing / sec.enrolled) * 100)}%`,
                              c:
                                sec.passing / sec.enrolled >= 0.9
                                  ? T.green
                                  : T.amber,
                            },
                            {
                              l: "Attendance",
                              v: `${sec.attendance}%`,
                              c: sec.attendance >= 90 ? T.green : T.red,
                            },
                            {
                              l: "At-Risk",
                              v: sec.atRisk,
                              c:
                                sec.atRisk > 5
                                  ? T.red
                                  : sec.atRisk > 2
                                    ? T.amber
                                    : T.green,
                            },
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
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </Card>
            {/* Legend */}
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                padding: "4px 0",
              }}
            >
              {[
                { l: "Outstanding ≥90", c: T.green },
                { l: "Very Satisfactory ≥85", c: T.blue },
                { l: "Satisfactory ≥80", c: "#C9A227" },
                { l: "Fairly Satisfactory ≥75", c: T.amber },
                { l: "Did Not Meet <75", c: T.red },
              ].map((x) => (
                <div
                  key={x.l}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 10,
                    color: T.textSoft,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: x.c,
                    }}
                  />
                  {x.l}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ══ DROPOUT RADAR ══ */}
        {tab === "dropout" && (
          <>
            <div
              style={{
                background: T.redSoft,
                border: `1px solid ${T.redBorder}`,
                borderRadius: 14,
                padding: "14px 18px",
                marginBottom: 14,
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
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
                style={{ flexShrink: 0, marginTop: 1 }}
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div style={{ fontSize: 12.5, color: T.red, lineHeight: 1.6 }}>
                <strong>Dropout Risk Radar</strong> — Husai uses a
                multi-indicator AI model (grades, attendance, teacher
                observations, submission rates) to flag students at risk of
                non-promotion or dropping out. Flagged students should be
                prioritized for intervention.
              </div>
            </div>

            {/* Filter */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 14,
                flexWrap: "wrap",
              }}
            >
              {["all", "critical", "high", "medium"].map((f) => (
                <button
                  key={f}
                  onClick={() => setRiskFilter(f)}
                  style={{
                    padding: "6px 14px",
                    border: `1px solid ${riskFilter === f ? T.red : T.border}`,
                    borderRadius: 20,
                    background: riskFilter === f ? T.redSoft : T.surface,
                    color: riskFilter === f ? T.red : T.textMid,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {f === "all"
                    ? "All Flagged"
                    : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 12,
                  color: T.textSoft,
                  alignSelf: "center",
                }}
              >
                {filteredRisk.length} students flagged
              </span>
            </div>

            <Card>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 110px 52px 52px 1fr 90px",
                  gap: 10,
                  padding: "9px 16px",
                  background: "#FAFAFA",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                {[
                  "Student",
                  "Section",
                  "GWA",
                  "Att.",
                  "Risk Indicators",
                  "Level",
                ].map((h) => (
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
              </div>
              {filteredRisk.map((stu, i) => {
                const rc = riskLevelCfg[stu.level];
                return (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 110px 52px 52px 1fr 90px",
                      gap: 10,
                      alignItems: "center",
                      padding: "12px 16px",
                      borderBottom:
                        i < filteredRisk.length - 1
                          ? `1px solid ${T.border}`
                          : "none",
                      background:
                        stu.level === "critical" ? `${T.red}06` : "transparent",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 13,
                          color: T.textPrimary,
                        }}
                      >
                        {stu.name}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: T.textSoft,
                          marginTop: 1,
                        }}
                      >
                        {stu.level === "critical" && (
                          <span style={{ color: T.red, fontWeight: 700 }}>
                            ●{" "}
                          </span>
                        )}
                        Husai AI flag
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: T.textMid }}>
                      {stu.section}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: gradeInfo(stu.gwa).c,
                        }}
                      >
                        {stu.gwa}
                      </span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: stu.attendance < 80 ? T.red : T.amber,
                        }}
                      >
                        {stu.attendance}%
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {stu.flags.map((f) => (
                        <span
                          key={f}
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            padding: "2px 7px",
                            borderRadius: 5,
                            background: rc.bg,
                            color: rc.text,
                            border: `1px solid ${rc.border}`,
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                    <RiskPill level={stu.level} />
                  </div>
                );
              })}
            </Card>

            {/* Action card */}
            <Card>
              <CardHead
                left={
                  <span style={{ fontWeight: 700, fontSize: 13 }}>
                    Recommended Interventions
                  </span>
                }
                right={<AiBadge />}
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
                    action:
                      "Schedule parent conferences for Miguel Cruz and Maria Santos — critical level, multiple indicators triggered.",
                    tag: "Urgent",
                    tagC: T.red,
                  },
                  {
                    action:
                      "Assign home visit for students with attendance below 75% in Q3 — coordinate with guidance counselor.",
                    tag: "This Week",
                    tagC: T.amber,
                  },
                  {
                    action:
                      "Enroll Carlo Bautista and Lani Torres in remedial reading and Math tutoring programme.",
                    tag: "Intervention",
                    tagC: T.blue,
                  },
                  {
                    action:
                      "Issue formal written notice to parents of all 4 critical-level students per DepEd Child Protection Policy.",
                    tag: "DepEd Compliance",
                    tagC: T.textMid,
                  },
                ].map((a, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: "11px 14px",
                      borderRadius: 10,
                      background: "#FAFAFA",
                      border: `1px solid ${T.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: T.red,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
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
                        background: `${a.tagC}15`,
                        color: a.tagC,
                        border: `1px solid ${a.tagC}40`,
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

        {/* ══ HISTORICAL TREND ══ */}
        {tab === "trend" && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 14,
                marginBottom: 14,
              }}
            >
              {[
                {
                  label: "GWA Trend",
                  data: gwaHistory,
                  color: T.red,
                  current: schoolStats.avgGwa,
                  unit: "",
                  best: Math.max(...gwaHistory),
                },
                {
                  label: "Attendance Trend",
                  data: attHistory,
                  color: T.green,
                  current: schoolStats.attendance,
                  unit: "%",
                  best: Math.max(...attHistory),
                },
                {
                  label: "Pass Rate Trend",
                  data: passHistory,
                  color: T.blue,
                  current: passHistory[passHistory.length - 1],
                  unit: "%",
                  best: Math.max(...passHistory),
                },
              ].map((metric) => (
                <Card key={metric.label} style={{ marginBottom: 0 }}>
                  <div style={{ padding: "16px 18px" }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        color: T.textSoft,
                        marginBottom: 4,
                      }}
                    >
                      {metric.label}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'DM Serif Display',serif",
                          fontSize: 30,
                          color: T.textPrimary,
                          lineHeight: 1,
                        }}
                      >
                        {metric.current}
                        {metric.unit}
                      </div>
                      <TrendLine
                        data={metric.data}
                        color={metric.color}
                        width={100}
                        height={42}
                      />
                    </div>
                    {/* Quarter bars */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 4,
                        height: 44,
                      }}
                    >
                      {metric.data.map((v, i) => {
                        const min = Math.min(...metric.data);
                        const max = Math.max(...metric.data);
                        const h = Math.max(
                          4,
                          ((v - min) / (max - min || 1)) * 36,
                        );
                        return (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                height: h,
                                background:
                                  i === metric.data.length - 1
                                    ? metric.color
                                    : `${metric.color}44`,
                                borderRadius: 3,
                              }}
                            />
                            <div
                              style={{
                                fontSize: 8,
                                color: T.textSoft,
                                whiteSpace: "nowrap",
                                transform: "rotate(-40deg)",
                                transformOrigin: "center",
                                marginTop: 2,
                              }}
                            >
                              {quarterlyTrend[i].label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Quarter-by-quarter table */}
            <Card>
              <CardHead
                left={
                  <span style={{ fontWeight: 700, fontSize: 13 }}>
                    Quarter-by-Quarter Comparison
                  </span>
                }
                right={
                  <span style={{ fontSize: 11, color: T.textSoft }}>
                    S.Y. 2023–2025
                  </span>
                }
              />
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 12,
                  }}
                >
                  <thead>
                    <tr style={{ background: "#FAFAFA" }}>
                      {[
                        "Quarter",
                        "GWA",
                        "vs Prev",
                        "Attendance",
                        "Pass Rate",
                        "At-Risk Est.",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "9px 16px",
                            textAlign: "left",
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: ".08em",
                            textTransform: "uppercase",
                            color: T.textSoft,
                            borderBottom: `1px solid ${T.border}`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {quarterlyTrend.map((q, i) => {
                      const diff =
                        i === 0 ? null : q.gwa - quarterlyTrend[i - 1].gwa;
                      return (
                        <tr
                          key={i}
                          style={{
                            background:
                              i === quarterlyTrend.length - 1
                                ? T.redPale
                                : "transparent",
                            borderBottom: `1px solid ${T.border}`,
                          }}
                        >
                          <td
                            style={{
                              padding: "10px 16px",
                              fontWeight:
                                i === quarterlyTrend.length - 1 ? 700 : 500,
                              color: T.textPrimary,
                            }}
                          >
                            {q.label}{" "}
                            {i === quarterlyTrend.length - 1 && (
                              <span style={{ fontSize: 10, color: T.red }}>
                                (Current)
                              </span>
                            )}
                          </td>
                          <td
                            style={{
                              padding: "10px 16px",
                              fontWeight: 700,
                              color: gradeInfo(q.gwa).c,
                            }}
                          >
                            {q.gwa}
                          </td>
                          <td
                            style={{
                              padding: "10px 16px",
                              color:
                                diff === null
                                  ? "#ccc"
                                  : diff > 0
                                    ? T.green
                                    : T.red,
                              fontWeight: 600,
                            }}
                          >
                            {diff === null
                              ? "—"
                              : `${diff > 0 ? "+" : ""}${diff.toFixed(1)}`}
                          </td>
                          <td
                            style={{
                              padding: "10px 16px",
                              color: q.att >= 90 ? T.green : T.red,
                              fontWeight: 600,
                            }}
                          >
                            {q.att}%
                          </td>
                          <td
                            style={{
                              padding: "10px 16px",
                              fontWeight: 600,
                              color: T.textMid,
                            }}
                          >
                            {q.pass}%
                          </td>
                          <td
                            style={{ padding: "10px 16px", color: T.textMid }}
                          >
                            ~
                            {Math.round(
                              schoolStats.enrolled * (1 - q.pass / 100),
                            )}{" "}
                            students
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {/* ══ TEACHER LOAD ══ */}
        {tab === "teachers" && (
          <>
            <div
              style={{
                background: T.amberSoft,
                border: `1px solid ${T.amberBorder}`,
                borderRadius: 14,
                padding: "12px 16px",
                marginBottom: 14,
                fontSize: 12.5,
                color: "#78350F",
                lineHeight: 1.6,
              }}
            >
              <strong>DepEd Order No. 002 s. 2024</strong> mandates the
              immediate removal of administrative tasks from teachers. Husai
              tracks estimated admin hours per teacher weekly. Teachers
              exceeding 10 hours of admin work per week are flagged.
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <StatCard
                label="Overloaded"
                value={
                  teacherLoad.filter((t) => t.status === "overloaded").length
                }
                sub="14+ hrs admin/week"
                accent={T.red}
                valueColor={T.red}
              />
              <StatCard
                label="Elevated"
                value={
                  teacherLoad.filter((t) => t.status === "elevated").length
                }
                sub="10–13 hrs/week"
                accent={T.amber}
                valueColor={T.amber}
              />
              <StatCard
                label="Normal Load"
                value={teacherLoad.filter((t) => t.status === "normal").length}
                sub="Below 10 hrs/week"
                accent={T.green}
              />
            </div>

            <Card>
              <CardHead
                left={
                  <span style={{ fontWeight: 700, fontSize: 13 }}>
                    Teacher Administrative Load Monitor
                  </span>
                }
                right={<AiBadge />}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 130px 80px 90px 100px",
                  gap: 10,
                  padding: "9px 16px",
                  background: "#FAFAFA",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                {[
                  "Teacher",
                  "Section",
                  "At-Risk Stu.",
                  "Admin Hrs/wk",
                  "Status",
                ].map((h) => (
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
              </div>
              {teacherLoad.map((t, i) => {
                const lc = loadCfg[t.status];
                return (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 130px 80px 90px 100px",
                      gap: 10,
                      alignItems: "center",
                      padding: "11px 16px",
                      borderBottom:
                        i < teacherLoad.length - 1
                          ? `1px solid ${T.border}`
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: T.textPrimary,
                      }}
                    >
                      {t.name}
                    </div>
                    <div style={{ fontSize: 12, color: T.textMid }}>
                      {t.section}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color:
                            t.atRisk > 4
                              ? T.red
                              : t.atRisk > 2
                                ? T.amber
                                : T.green,
                        }}
                      >
                        {t.atRisk}
                      </span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          height: 4,
                          background: "#F0F0F2",
                          borderRadius: 3,
                          overflow: "hidden",
                          marginBottom: 3,
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(100, (t.adminHrs / 20) * 100)}%`,
                            height: "100%",
                            background: lc.text,
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: lc.text,
                        }}
                      >
                        {t.adminHrs} hrs
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: 20,
                        background: lc.bg,
                        color: lc.text,
                        border: `1px solid ${lc.border}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {lc.label}
                    </span>
                  </div>
                );
              })}
            </Card>

            {/* Husai suggestion */}
            <div
              style={{
                background: T.redSoft,
                border: `1px solid ${T.redBorder}`,
                borderRadius: 14,
                padding: "14px 18px",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 52 52"
                fill="none"
                style={{ flexShrink: 0, marginTop: 1 }}
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
              <div style={{ fontSize: 12.5, color: T.red, lineHeight: 1.6 }}>
                <strong style={{ color: T.redDeep }}>
                  Husai Recommendation:
                </strong>{" "}
                Mrs. Santos, Mr. Dela Cruz, and Mr. Flores are exceeding DepEd's
                recommended admin hour limit. Husai can auto-generate their
                SF9/SF10 records, class reports, and monthly narratives —
                reducing estimated admin load by 6–8 hours per week per teacher.
              </div>
            </div>
          </>
        )}

        {/* ══ AI NARRATIVE ══ */}
        {tab === "narrative" && (
          <>
            <Card>
              <CardHead
                left={
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 52 52" fill="none">
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
                    <span style={{ fontWeight: 700, fontSize: 13 }}>
                      AI-Generated Monthly School Health Narrative
                    </span>
                  </div>
                }
                right={<AiBadge />}
              />
              <div style={{ padding: "20px 22px" }}>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    marginBottom: 18,
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    ["School", school.name],
                    ["Period", "Q3 · " + school.sy],
                    ["Generated", "March 22, 2025"],
                    ["For", "DepEd Manila Division"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      style={{
                        padding: "8px 14px",
                        background: T.redSoft,
                        borderRadius: 10,
                        border: `1px solid ${T.redBorder}`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          color: T.red,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: ".06em",
                        }}
                      >
                        {k}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: T.textPrimary,
                          marginTop: 2,
                        }}
                      >
                        {v}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Narrative body */}
                <div
                  style={{
                    fontFamily: "'DM Serif Display',serif",
                    fontSize: 15,
                    color: T.textPrimary,
                    lineHeight: 1.8,
                    marginBottom: 16,
                  }}
                >
                  {narrativeExpanded
                    ? aiNarrative
                    : aiNarrative.slice(0, 320) + "…"}
                </div>
                <button
                  onClick={() => setNarrativeExpanded((p) => !p)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: T.red,
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                    padding: 0,
                    fontFamily: "inherit",
                  }}
                >
                  {narrativeExpanded ? "Show less ↑" : "Read full narrative ↓"}
                </button>

                <div
                  style={{
                    borderTop: `1px solid ${T.border}`,
                    marginTop: 20,
                    paddingTop: 20,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      marginBottom: 12,
                      color: T.textPrimary,
                    }}
                  >
                    Key Metrics Summary
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2,1fr)",
                      gap: 10,
                    }}
                  >
                    {[
                      [
                        "School GWA",
                        `${schoolStats.avgGwa}`,
                        gradeInfo(schoolStats.avgGwa).c,
                      ],
                      [
                        "Attendance Rate",
                        `${schoolStats.attendance}%`,
                        T.green,
                      ],
                      [
                        "Students Passing",
                        `${Math.round((schoolStats.passing / schoolStats.enrolled) * 100)}%`,
                        T.green,
                      ],
                      ["At-Risk Flagged", `${schoolStats.atRisk}`, T.amber],
                      [
                        "Critical Dropout Risk",
                        `${schoolStats.dropout}`,
                        T.red,
                      ],
                      [
                        "Admin Overloaded",
                        `${teacherLoad.filter((t) => t.status === "overloaded").length} teachers`,
                        T.red,
                      ],
                    ].map(([k, v, c]) => (
                      <div
                        key={k}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 12px",
                          background: "#FAFAFA",
                          borderRadius: 10,
                          border: `1px solid ${T.border}`,
                        }}
                      >
                        <span style={{ fontSize: 12, color: T.textMid }}>
                          {k}
                        </span>
                        <span
                          style={{ fontSize: 13, fontWeight: 700, color: c }}
                        >
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    style={{
                      background: T.red,
                      color: "white",
                      border: "none",
                      borderRadius: 10,
                      padding: "10px 20px",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Download PDF Report
                  </button>
                  <button
                    style={{
                      background: T.surface,
                      color: T.red,
                      border: `1.5px solid ${T.redBorder}`,
                      borderRadius: 10,
                      padding: "10px 20px",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Send to DepEd Division
                  </button>
                  <button
                    style={{
                      background: T.surface,
                      color: T.textMid,
                      border: `1px solid ${T.border}`,
                      borderRadius: 10,
                      padding: "10px 20px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Regenerate Narrative
                  </button>
                </div>
              </div>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
