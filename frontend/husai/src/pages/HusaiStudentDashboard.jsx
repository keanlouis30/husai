import { useState, useEffect } from "react";
import { studentsApi } from "../api/husai";

// ── HUSAI TOKENS: White + Gold (Student Role) ─────────────────────────────────
const T = {
  gold: "#F5C842",
  goldSoft: "#FDF3C8",
  goldPale: "#FEFCF0",
  goldBorder: "#EDD96A",
  goldDeep: "#C9A227",
  textPrimary: "#18181A",
  textMid: "#5C5C66",
  textSoft: "#9999A8",
  border: "#EBEBEE",
  surface: "#FFFFFF",
  page: "#FAFAF8",
  green: "#22863A",
  greenBg: "#F0FAF3",
  red: "#C0392B",
  redBg: "#FDF3F2",
  blue: "#1A56A0",
  blueBg: "#F0F6FF",
  amber: "#B45309",
  amberBg: "#FFFBEB",
};

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
// studentId would come from your router in production
// e.g. const { studentId } = useParams() if using React Router

// ── HELPERS ───────────────────────────────────────────────────────────────────
function gradeInfo(s) {
  if (s >= 90) return { label: "Outstanding", c: T.green };
  if (s >= 85) return { label: "Very Satisfactory", c: T.blue };
  if (s >= 80) return { label: "Satisfactory", c: T.goldDeep };
  if (s >= 75) return { label: "Fairly Satisfactory", c: T.amber };
  return { label: "Did Not Meet", c: T.red };
}

const trendMap = {
  up: { a: "↑", c: T.green },
  down: { a: "↓", c: T.red },
  stable: { a: "→", c: T.amber },
};

const actStyle = {
  ok: { dot: T.green, bg: T.greenBg, text: "#14532D" },
  warn: { dot: T.amber, bg: T.amberBg, text: "#78350F" },
  bad: { dot: T.red, bg: T.redBg, text: "#7F1D1D" },
  info: { dot: T.blue, bg: T.blueBg, text: "#1E3A5F" },
};

// ── LOGO ─────────────────────────────────────────────────────────────────────
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

// ── STAT CARD ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, accent }) => (
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
        background: accent || T.gold,
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
        color: T.textPrimary,
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

// ── INSIGHT CARD ──────────────────────────────────────────────────────────────
const Insight = ({ type, msg }) => {
  const map = {
    warn: {
      bg: T.amberBg,
      text: "#78350F",
      iconBg: "#FDE68A",
      iconText: "#92400E",
      icon: "!",
    },
    ok: {
      bg: T.greenBg,
      text: "#14532D",
      iconBg: "#BBF7D0",
      iconText: "#166534",
      icon: "✓",
    },
    info: {
      bg: T.blueBg,
      text: "#1E3A5F",
      iconBg: "#BFDBFE",
      iconText: "#1E40AF",
      icon: "i",
    },
  };
  const m = map[type] || map.info;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
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
          background: m.iconBg,
          color: m.iconText,
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
      <div>{msg}</div>
    </div>
  );
};

// ── ADVISER LINK ──────────────────────────────────────────────────────────────
// Backend: clicking navigates to GET /api/teachers/:teacherId profile page
const AdviserLink = ({ adviser, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      color: T.blue,
      fontWeight: 600,
      fontSize: 12,
      textDecoration: "underline",
      textDecorationStyle: "dotted",
      textUnderlineOffset: 2,
      fontFamily: "inherit",
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
    }}
  >
    {adviser.name}
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  </button>
);

// ── SUBJECT ROW (responsive: hides MELC + trend on mobile via CSS class) ──────
const SubjectRow = ({ subj, active, onClick }) => {
  const g = gradeInfo(subj.q3);
  const tr = trendMap[subj.trend] || trendMap.stable;
  const pct = Math.max(0, ((subj.q3 - 60) / 40) * 100);
  return (
    <div
      onClick={onClick}
      className="subj-table-row"
      style={{
        borderBottom: `1px solid ${T.border}`,
        cursor: "pointer",
        background: active ? T.goldPale : "transparent",
        transition: "background .12s",
      }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>
          {subj.name}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 3,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 3,
              background: "#F0F0F2",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background: g.c,
                borderRadius: 3,
              }}
            />
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: g.c,
              whiteSpace: "nowrap",
            }}
          >
            {g.label}
          </span>
        </div>
      </div>
      {[subj.q1, subj.q2, subj.q3].map((sc, i) => {
        const gc = gradeInfo(sc);
        return (
          <div key={i} style={{ textAlign: "center" }}>
            <span
              style={{
                display: "inline-block",
                padding: "2px 7px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                background: `${gc.c}14`,
                color: gc.c,
                border: `1px solid ${gc.c}30`,
              }}
            >
              {sc}
            </span>
          </div>
        );
      })}
      <div
        className="subj-col-melc"
        style={{ fontSize: 11, color: T.textSoft, lineHeight: 1.3 }}
      >
        {subj.melc}
      </div>
      <div
        className="subj-col-trend"
        style={{
          fontSize: 14,
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

// ── QUARTER DETAIL ────────────────────────────────────────────────────────────
const QuarterDetail = ({ subj }) => {
  const qs = [
    { q: "Q1", v: subj.q1 },
    { q: "Q2", v: subj.q2 },
    { q: "Q3", v: subj.q3 },
  ];
  return (
    <div
      style={{
        marginTop: 12,
        border: `1.5px solid ${T.goldBorder}`,
        borderRadius: 14,
        padding: 18,
        background: T.goldPale,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary }}>
            {subj.name}
          </div>
          <div style={{ fontSize: 11, color: T.textMid, marginTop: 3 }}>
            MELC Focus: {subj.melc}
          </div>
        </div>
        <svg width="140" height="68" viewBox="0 0 140 68">
          {qs.map((b, i) => {
            const bh = Math.max(4, ((b.v - 60) / 40) * 50);
            const x = i * 44 + 4;
            const g = gradeInfo(b.v);
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={52 - bh}
                  width="34"
                  height={bh}
                  rx="5"
                  fill={i === 2 ? T.gold : "#EBEBEE"}
                />
                <text
                  x={x + 17}
                  y={52 - bh - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill={g.c}
                  fontFamily="DM Sans,sans-serif"
                >
                  {b.v}
                </text>
                <text
                  x={x + 17}
                  y="65"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#9999A8"
                  fontFamily="DM Sans,sans-serif"
                >
                  {b.q}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 10,
        }}
      >
        {qs.map((b, i) => {
          const g = gradeInfo(b.v);
          return (
            <div
              key={i}
              style={{
                borderRadius: 12,
                padding: "12px 10px",
                textAlign: "center",
                border: `1px solid ${i === 2 ? T.goldBorder : T.border}`,
                background: T.surface,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: T.textSoft,
                  marginBottom: 5,
                }}
              >
                {b.q}
              </div>
              <div
                style={{
                  fontFamily: "'DM Serif Display',serif",
                  fontSize: 30,
                  lineHeight: 1,
                  color: g.c,
                }}
              >
                {b.v}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  marginTop: 3,
                  color: g.c,
                }}
              >
                {g.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── PROFILE MODAL ─────────────────────────────────────────────────────────────
// Triggered by clicking the avatar in the top-right nav.
// Contains: personal page (Facebook-style) + Harvard resume generator.
// Backend notes:
//   Profile data:     GET /api/students/:id/profile
//   Resume generate:  POST /api/students/:id/resume  → returns .docx blob
//   RPA trigger:      POST /api/rpa/resume  → queues UiPath job, returns job_id
//   RPA status poll:  GET  /api/rpa/jobs/:job_id     → { status, download_url }

const RESUME_SECTIONS = ["education", "awards", "extracurricular", "skills"];

const skillLevelColor = {
  Advanced: { bg: "#EAF3DE", text: "#3B6D11", border: "#97C459" },
  Proficient: { bg: T.blueBg, text: T.blue, border: T.blueBg },
  Developing: { bg: T.amberBg, text: T.amber, border: T.amberBg },
};

const ProfileModal = ({ onClose }) => {
  const [view, setView] = useState("profile"); // "profile" | "resume"
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [photoHover, setPhotoHover] = useState(false);

  // Simulate RPA resume generation
  // Real flow: POST /api/rpa/resume → poll GET /api/rpa/jobs/:id → download
  const handleGenerateResume = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2800);
  };

  const gwa = student.gwa;
  const g = gradeInfo(gwa);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.5)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        zIndex: 300,
        padding: 0,
      }}
    >
      {/* Panel slides in from top-right */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 480,
          height: "100vh",
          background: T.surface,
          overflowY: "auto",
          boxShadow: "-4px 0 32px rgba(0,0,0,.18)",
          display: "flex",
          flexDirection: "column",
          animation: "slideInRight .25s ease",
        }}
      >
        {/* ── PANEL HEADER ── */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            background: T.surface,
            zIndex: 10,
          }}
        >
          {/* View toggle */}
          <div
            style={{
              display: "flex",
              gap: 4,
              background: "#F4F4F6",
              borderRadius: 10,
              padding: 3,
            }}
          >
            {[
              ["profile", "Profile"],
              ["resume", "Resume"],
            ].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: "6px 16px",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "inherit",
                  background: view === v ? T.surface : "transparent",
                  color: view === v ? T.textPrimary : T.textSoft,
                  transition: "all .15s",
                }}
              >
                {l}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#F4F4F6",
              border: "none",
              borderRadius: 8,
              padding: "6px 12px",
              cursor: "pointer",
              fontSize: 13,
              color: T.textMid,
              fontFamily: "inherit",
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* ══ PROFILE VIEW ══ */}
        {view === "profile" && (
          <div style={{ flex: 1 }}>
            {/* Cover banner */}
            <div
              style={{
                height: 110,
                background: `linear-gradient(135deg, ${T.gold} 0%, #F9A825 100%)`,
                position: "relative",
              }}
            >
              {/* Pattern overlay */}
              <svg
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0.12,
                }}
                viewBox="0 0 200 100"
                preserveAspectRatio="xMidYMid slice"
              >
                {[0, 1, 2, 3, 4, 5].map((i) =>
                  [0, 1, 2, 3].map((j) => (
                    <circle
                      key={`${i}-${j}`}
                      cx={i * 40}
                      cy={j * 30}
                      r="20"
                      fill="white"
                    />
                  )),
                )}
              </svg>
            </div>

            {/* Avatar + name */}
            <div style={{ padding: "0 20px", position: "relative" }}>
              {/* Avatar — floats over cover */}
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  marginTop: -40,
                  marginBottom: 10,
                }}
              >
                <div
                  onMouseEnter={() => setPhotoHover(true)}
                  onMouseLeave={() => setPhotoHover(false)}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${T.gold}, #F9A825)`,
                    border: `3px solid ${T.surface}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 26,
                    color: "#7A5900",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    transition: "opacity .15s",
                  }}
                >
                  {student.avatar}
                  {/* Upload overlay */}
                  {photoHover && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                  )}
                </div>
                {/* Online dot */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: T.green,
                    border: `2px solid ${T.surface}`,
                  }}
                />
              </div>

              {/* Name + status */}
              <div style={{ marginBottom: 16 }}>
                <h2
                  style={{
                    fontFamily: "'DM Serif Display',serif",
                    fontSize: 22,
                    color: T.textPrimary,
                    margin: "0 0 3px",
                    letterSpacing: "-.3px",
                  }}
                >
                  {student.name}
                </h2>
                {/* Status line — academic standing */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: g.c }}>
                    {g.label}
                  </span>
                  <span style={{ color: T.border }}>·</span>
                  <span style={{ fontSize: 13, color: T.textMid }}>
                    {student.grade}, {student.section}
                  </span>
                </div>
                {/* Bio / status */}
                <div
                  style={{
                    fontSize: 13,
                    color: T.textMid,
                    lineHeight: 1.6,
                    padding: "10px 12px",
                    background: T.goldPale,
                    borderRadius: 10,
                    border: `1px solid ${T.goldBorder}`,
                  }}
                >
                  "{profile.bio}"
                </div>
              </div>

              {/* Quick stats row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                {[
                  { label: "GWA", value: gwa, color: g.c },
                  {
                    label: "Att. Rate",
                    value: `${Math.round((attendance.present / attendance.total) * 100)}%`,
                    color: T.green,
                  },
                  {
                    label: "Awards",
                    value: profile.awards.length,
                    color: T.blue,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      textAlign: "center",
                      padding: "10px 6px",
                      border: `1px solid ${T.border}`,
                      borderRadius: 12,
                      background: "#FAFAF8",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'DM Serif Display',serif",
                        fontSize: 22,
                        color: item.color,
                        lineHeight: 1,
                      }}
                    >
                      {item.value}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: T.textSoft,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: ".08em",
                        marginTop: 3,
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Personal info */}
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: T.textSoft,
                    marginBottom: 10,
                  }}
                >
                  Personal Info
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 0 }}
                >
                  {[
                    ["Student ID", student.studentId],
                    ["Birthday", profile.birthday],
                    ["Age", `${profile.age} years old`],
                    ["Address", profile.address],
                    ["Nationality", profile.nationality],
                    ["School", student.school],
                    ["Adviser", student.adviser.name],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom: `1px solid ${T.border}`,
                        fontSize: 12,
                      }}
                    >
                      <span style={{ color: T.textSoft, minWidth: 90 }}>
                        {k}
                      </span>
                      <span
                        style={{
                          fontWeight: 600,
                          color: T.textPrimary,
                          textAlign: "right",
                        }}
                      >
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extracurricular */}
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: T.textSoft,
                    marginBottom: 10,
                  }}
                >
                  Activities & Organizations
                </div>
                {profile.extracurricular.map((ec, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "9px 0",
                      borderBottom: `1px solid ${T.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: T.goldSoft,
                        border: `1px solid ${T.goldBorder}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: 14,
                      }}
                    >
                      ⭐
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: T.textPrimary,
                        }}
                      >
                        {ec.name}
                      </div>
                      <div style={{ fontSize: 11, color: T.textSoft }}>
                        {ec.role} · {ec.year}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Awards */}
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: T.textSoft,
                    marginBottom: 10,
                  }}
                >
                  Awards & Honors
                </div>
                {profile.awards.map((aw, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "9px 0",
                      borderBottom: `1px solid ${T.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: "#FDF3C8",
                        border: `1px solid ${T.goldBorder}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: 14,
                      }}
                    >
                      🏅
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: T.textPrimary,
                        }}
                      >
                        {aw.title}
                      </div>
                      <div style={{ fontSize: 11, color: T.textSoft }}>
                        {aw.issuer} · {aw.year}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div style={{ marginBottom: 28 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: T.textSoft,
                    marginBottom: 10,
                  }}
                >
                  Skills & Competencies
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  {profile.skills.map((sk, i) => {
                    const lc =
                      skillLevelColor[sk.level] || skillLevelColor.Developing;
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "7px 10px",
                          borderRadius: 9,
                          background: "#FAFAF8",
                          border: `1px solid ${T.border}`,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            color: T.textPrimary,
                            fontWeight: 500,
                          }}
                        >
                          {sk.name}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 20,
                            background: lc.bg,
                            color: lc.text,
                          }}
                        >
                          {sk.level}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA to resume */}
              <button
                onClick={() => setView("resume")}
                style={{
                  width: "100%",
                  marginBottom: 24,
                  padding: "12px 0",
                  background: T.textPrimary,
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Generate Harvard Resume →
              </button>
            </div>
          </div>
        )}

        {/* ══ RESUME VIEW ══ */}
        {view === "resume" && (
          <div style={{ flex: 1, padding: "20px" }}>
            {/* What the RPA does — info strip */}
            <div
              style={{
                padding: "11px 14px",
                background: T.blueBg,
                border: `1px solid ${T.blueBg}`,
                borderRadius: 10,
                marginBottom: 18,
                fontSize: 12,
                color: "#1E3A5F",
                lineHeight: 1.6,
              }}
            >
              <strong>How it works:</strong> Husai collects your academic data →
              Claude API formats it into Harvard resume structure → RPA (UiPath)
              fills the official .docx template → you download the PDF. No
              manual typing.
            </div>

            {/* Harvard Resume Preview */}
            <div
              style={{
                border: `1.5px solid ${T.border}`,
                borderRadius: 14,
                overflow: "hidden",
                marginBottom: 18,
                background: T.surface,
              }}
            >
              {/* Header strip */}
              <div
                style={{
                  padding: "14px 18px",
                  background: T.textPrimary,
                  color: "white",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 2,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 52 52" fill="none">
                    <rect width="52" height="52" rx="8" fill="#333" />
                    <line
                      x1="21"
                      y1="18"
                      x2="21"
                      y2="34"
                      stroke="white"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <line
                      x1="31"
                      y1="18"
                      x2="31"
                      y2="34"
                      stroke="white"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <line
                      x1="21"
                      y1="26"
                      x2="31"
                      y2="26"
                      stroke={T.gold}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: T.gold,
                    }}
                  >
                    Husai · Harvard Format Resume
                  </span>
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.45)" }}>
                  Auto-generated ·{" "}
                  {new Date().toLocaleDateString("en-PH", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>

              {/* Resume body — Harvard style */}
              <div
                style={{
                  padding: "20px 22px",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                }}
              >
                {/* Name + contact — centered, Harvard style */}
                <div
                  style={{
                    textAlign: "center",
                    paddingBottom: 12,
                    marginBottom: 14,
                    borderBottom: "2px solid #18181A",
                  }}
                >
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: T.textPrimary,
                      letterSpacing: ".02em",
                    }}
                  >
                    {student.name.toUpperCase()}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: T.textMid,
                      marginTop: 4,
                      lineHeight: 1.6,
                    }}
                  >
                    {profile.address} · {profile.contact}
                    <br />
                    {student.school} · {student.studentId}
                  </div>
                </div>

                {/* Education */}
                <ResumeSection title="EDUCATION">
                  {profile.education.map((ed, i) => (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: T.textPrimary,
                          }}
                        >
                          {ed.school}
                        </span>
                        <span style={{ fontSize: 11, color: T.textMid }}>
                          {ed.from} – {ed.to}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: T.textMid,
                          fontStyle: "italic",
                        }}
                      >
                        {ed.level} Education · {ed.address}
                      </div>
                      <div
                        style={{ fontSize: 12, color: T.textMid, marginTop: 2 }}
                      >
                        General Weighted Average: <strong>{ed.gwa}</strong> (
                        {ed.standing}) · {student.grade}
                      </div>
                    </div>
                  ))}
                </ResumeSection>

                {/* Awards & Honors */}
                <ResumeSection title="AWARDS & HONORS">
                  {profile.awards.map((aw, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: 5,
                      }}
                    >
                      <span style={{ fontSize: 12, color: T.textPrimary }}>
                        {aw.title},{" "}
                        <span style={{ fontStyle: "italic" }}>{aw.issuer}</span>
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: T.textMid,
                          whiteSpace: "nowrap",
                          marginLeft: 8,
                        }}
                      >
                        {aw.year}
                      </span>
                    </div>
                  ))}
                </ResumeSection>

                {/* Extracurricular */}
                <ResumeSection title="ACTIVITIES & LEADERSHIP">
                  {profile.extracurricular.map((ec, i) => (
                    <div key={i} style={{ marginBottom: 5 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: T.textPrimary,
                          }}
                        >
                          {ec.name}
                        </span>
                        <span style={{ fontSize: 11, color: T.textMid }}>
                          {ec.year}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: T.textMid,
                          fontStyle: "italic",
                        }}
                      >
                        {ec.role}
                      </div>
                    </div>
                  ))}
                </ResumeSection>

                {/* Skills */}
                <ResumeSection title="SKILLS & COMPETENCIES" last>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "4px 0" }}
                  >
                    {profile.skills.map((sk, i) => (
                      <span
                        key={i}
                        style={{ fontSize: 12, color: T.textPrimary }}
                      >
                        {sk.name} ({sk.level})
                        {i < profile.skills.length - 1 ? " · " : ""}
                      </span>
                    ))}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      color: T.textMid,
                      fontStyle: "italic",
                    }}
                  >
                    Competencies derived from DepEd MELC framework · S.Y.
                    2024–2025
                  </div>
                </ResumeSection>
              </div>
            </div>

            {/* RPA Generate button */}
            {!generated ? (
              <button
                onClick={handleGenerateResume}
                disabled={generating}
                style={{
                  width: "100%",
                  padding: "13px 0",
                  background: generating ? T.textMid : T.textPrimary,
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: generating ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "background .2s",
                }}
              >
                {generating ? (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      style={{ animation: "spin 1s linear infinite" }}
                    >
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>
                    RPA is building your resume…
                  </>
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    Generate & Download Harvard Resume (.docx)
                  </>
                )}
              </button>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div
                  style={{
                    padding: "12px 16px",
                    background: T.greenBg,
                    border: `1px solid #86EFAC`,
                    borderRadius: 12,
                    fontSize: 13,
                    color: "#14532D",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 16 }}>✅</span>
                  Resume generated by Husai RPA · Ready to download
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    style={{
                      flex: 1,
                      padding: "11px 0",
                      background: T.textPrimary,
                      color: "white",
                      border: "none",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    ⬇ Download .docx
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: "11px 0",
                      background: T.surface,
                      color: T.textPrimary,
                      border: `1.5px solid ${T.border}`,
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    ⬇ Download PDF
                  </button>
                </div>
                <button
                  onClick={handleGenerateResume}
                  style={{
                    padding: "9px 0",
                    background: "transparent",
                    color: T.textSoft,
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Regenerate
                </button>
              </div>
            )}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
      </div>
    </div>
  );
};

// ── RESUME SECTION (Harvard style helper) ─────────────────────────────────────
const ResumeSection = ({ title, children, last }) => (
  <div style={{ marginBottom: last ? 0 : 14 }}>
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: ".12em",
        color: "#18181A",
        borderBottom: "1px solid #18181A",
        paddingBottom: 3,
        marginBottom: 8,
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

// ── ADVISER MODAL ─────────────────────────────────────────────────────────────
const AdviserModal = ({ adviser, school, onClose }) => (
  <div
    onClick={onClose}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 200,
      padding: 16,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: T.surface,
        borderRadius: 20,
        padding: 24,
        width: "100%",
        maxWidth: 360,
        border: `1px solid ${T.border}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 18,
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: T.blueBg,
              border: `2px solid ${T.blue}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 16,
              color: T.blue,
            }}
          >
            {adviser.name
              .split(" ")
              .filter((w) => w.match(/^[A-Z]/))
              .slice(0, 2)
              .map((w) => w[0])
              .join("")}
          </div>
          <div>
            <div
              style={{ fontWeight: 700, fontSize: 16, color: T.textPrimary }}
            >
              {adviser.name}
            </div>
            <div style={{ fontSize: 12, color: T.textSoft, marginTop: 2 }}>
              Class Adviser
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "#F4F4F6",
            border: "none",
            borderRadius: 8,
            padding: "5px 10px",
            cursor: "pointer",
            fontSize: 12,
            color: T.textMid,
            fontFamily: "inherit",
          }}
        >
          ✕
        </button>
      </div>
      {/* Details */}
      {[
        ["Teacher ID", adviser.teacherId],
        ["School", school],
        ["Handles", adviser.section],
        ["Students", "34 students this quarter"],
        ["Subject", "Grade 5 Adviser — All Subjects"],
      ].map(([k, v]) => (
        <div
          key={k}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "9px 0",
            borderBottom: `1px solid ${T.border}`,
            fontSize: 12,
          }}
        >
          <span style={{ color: T.textSoft }}>{k}</span>
          <span style={{ fontWeight: 600, color: T.textPrimary }}>{v}</span>
        </div>
      ))}
      <button
        onClick={onClose}
        style={{
          marginTop: 16,
          width: "100%",
          padding: "10px 0",
          background: T.blue,
          color: "white",
          border: "none",
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        View Full Teacher Profile →
      </button>
    </div>
  </div>
);

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function HusaiStudentDashboard({ studentId = "STU-240142" }) {
  const [tab, setTab] = useState("overview");
  const [selSubj, setSelSubj] = useState(null);
  const [showAdviser, setShowAdviser] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // ── LIVE DATA ──────────────────────────────────────────────────────────────
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [insights, setInsights] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      studentsApi.getProfile(studentId),
      studentsApi.getSubjects(studentId, "Q3"),
      studentsApi.getInsights(studentId),
      studentsApi.getAttendance(studentId, "Q3"),
      studentsApi.getActivity(studentId),
    ])
      .then(
        ([
          profileData,
          subjectsData,
          insightsData,
          attendanceData,
          activityData,
        ]) => {
          setStudent(profileData);
          setSubjects(subjectsData);
          setInsights(insightsData);
          setAttendance(attendanceData);
          setActivity(activityData.activities || []);
          setLoading(false);
        },
      )
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [studentId]);

  // ── LOADING / ERROR STATES ─────────────────────────────────────────────────
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#FAFAF8",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 14, color: "#9999A8" }}>
          Loading student profile…
        </div>
      </div>
    );

  if (error)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#FAFAF8",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 600 }}>
          Something went wrong
        </div>
        <div style={{ fontSize: 13, color: "#9999A8" }}>{error}</div>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "9px 20px",
            background: "#18181A",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </div>
    );

  if (!student) return null;

  const tabs = ["overview", "subjects", "attendance", "activity"];
  const attPct = attendance
    ? Math.round((attendance.present / attendance.total) * 100)
    : 0;

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
        @keyframes fadeUp { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:none; } }
        @keyframes slideInRight { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }

        /* ─── MOBILE RESPONSIVE ────────────────────────────────── */

        /* Padding: tight on mobile, generous on desktop */
        .px-page   { padding-left: 16px;  padding-right: 16px;  }
        .py-hero   { padding-top: 20px;   padding-bottom: 18px; }
        .py-main   { padding-top: 16px;   padding-bottom: 48px; }

        @media (min-width: 640px) {
          .px-page { padding-left: 32px;  padding-right: 32px;  }
          .py-hero { padding-top: 26px;   padding-bottom: 22px; }
          .py-main { padding-top: 22px;   padding-bottom: 52px; }
        }

        /* Stat grid: 2-col on mobile → 4-col on desktop */
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 10px;
          margin-bottom: 16px;
        }
        @media (min-width: 640px) {
          .stat-grid { grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; margin-bottom: 20px; }
        }

        /* Attendance stat grid: 2x2 mobile → 4 desktop */
        .att-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 10px;
          margin-bottom: 14px;
        }
        @media (min-width: 640px) {
          .att-grid { grid-template-columns: repeat(4, minmax(0,1fr)); }
        }

        /* Overview: stacked mobile → 2-col desktop */
        .overview-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 900px) {
          .overview-grid { grid-template-columns: 1fr 300px; }
        }

        /* Hero GWA box: full-width on mobile → auto on desktop */
        .gwa-box {
          width: 100%;
          text-align: center;
          padding: 16px 20px;
          border: 1.5px solid ${T.goldBorder};
          border-radius: 16px;
          background: ${T.goldPale};
          flex-shrink: 0;
        }
        @media (min-width: 560px) {
          .gwa-box { width: auto; }
        }

        /* Subject table: 4-col on mobile, full on desktop */
        .subj-table-header,
        .subj-table-row {
          display: grid;
          grid-template-columns: 1fr 42px 42px 42px;
          gap: 8px;
          align-items: center;
          padding: 10px 14px;
        }
        .subj-col-melc,
        .subj-col-trend { display: none; }
        @media (min-width: 680px) {
          .subj-table-header,
          .subj-table-row {
            grid-template-columns: 1fr 52px 52px 52px 1fr 28px;
            gap: 12px;
            padding: 12px 18px;
          }
          .subj-col-melc,
          .subj-col-trend { display: block; }
        }

        /* Info grid: 1-col mobile → 2-col desktop */
        .info-grid {
          display: grid;
          grid-template-columns: 1fr;
        }
        @media (min-width: 560px) {
          .info-grid { grid-template-columns: 1fr 1fr; gap: 0 24px; }
        }

        /* Hide logo sub-label on very small screens */
        .logo-sub { display: none; }
        @media (min-width: 400px) { .logo-sub { display: block; } }

        /* Tabs: horizontal scroll on mobile */
        .tabs-bar {
          display: flex;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .tabs-bar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── NAV ── */}
      <header
        className="px-page"
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
              {student.name}
            </div>
            <div style={{ fontSize: 10, color: T.textSoft }}>
              {student.grade} · {student.section} · {student.quarter}
            </div>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: T.gold,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 13,
              color: "#7A5900",
              cursor: "pointer",
              border: `2px solid transparent`,
              transition: "border-color .15s",
            }}
            onClick={() => setShowProfile(true)}
            title="View your profile"
          >
            {student.avatar}
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <div
        className="px-page py-hero"
        style={{ background: T.surface, borderBottom: `1px solid ${T.border}` }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: T.goldDeep,
            marginBottom: 12,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: T.gold,
              display: "inline-block",
            }}
          />
          Student Learning Profile
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                fontFamily: "'DM Serif Display',serif",
                fontSize: "clamp(22px,5vw,30px)",
                color: T.textPrimary,
                lineHeight: 1.1,
                letterSpacing: "-.3px",
                margin: 0,
              }}
            >
              {student.name}
            </h1>
            <p
              style={{ fontSize: 13, color: T.textSoft, margin: "5px 0 10px" }}
            >
              {student.grade} — Section {student.section} · {student.school}
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[student.sy, `${student.quarter} · Quarter`].map((c) => (
                <span
                  key={c}
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    padding: "4px 10px",
                    borderRadius: 20,
                    background: T.goldSoft,
                    color: T.goldDeep,
                    border: `1px solid ${T.goldBorder}`,
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="gwa-box">
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: T.goldDeep,
                marginBottom: 6,
              }}
            >
              General Weighted Average
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
              {student.gwa}
            </div>
            <div
              style={{
                fontSize: 12,
                color: T.goldDeep,
                fontWeight: 500,
                marginTop: 3,
              }}
            >
              {gradeInfo(student.gwa).label}
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div
        className="tabs-bar px-page"
        style={{ background: T.surface, borderBottom: `1px solid ${T.border}` }}
      >
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setSelSubj(null);
            }}
            style={{
              padding: "13px 16px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: tab === t ? 600 : 500,
              color: tab === t ? T.textPrimary : T.textSoft,
              borderBottom: `2px solid ${tab === t ? T.gold : "transparent"}`,
              transition: "all .15s",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
              textTransform: "capitalize",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <main className="px-page py-main">
        {/* ══ OVERVIEW ══ */}
        {tab === "overview" && (
          <>
            <div className="stat-grid">
              <StatCard
                label="GWA"
                value={student.gwa}
                sub={gradeInfo(student.gwa).label}
                accent={T.gold}
              />
              <StatCard
                label="Attendance"
                value={`${attPct}%`}
                sub={`${attendance.present} of ${attendance.total} days`}
                accent="#A8C5F0"
              />
              <StatCard
                label="Subjects"
                value={subjects.length}
                sub="Enrolled this quarter"
                accent={T.border}
              />
              <StatCard
                label="Quarter"
                value={student.quarter}
                sub={student.sy}
                accent={T.goldBorder}
              />
            </div>

            <div className="overview-grid">
              {/* LEFT: insights + info */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {/* Husai AI Insights */}
                <div
                  style={{
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 16,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "13px 18px",
                      borderBottom: `1px solid ${T.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
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
                          fontSize: 13,
                          fontWeight: 700,
                          color: T.textPrimary,
                        }}
                      >
                        Husai AI Insights
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: ".06em",
                        textTransform: "uppercase",
                        padding: "3px 9px",
                        borderRadius: 20,
                        background: T.goldSoft,
                        color: T.goldDeep,
                        border: `1px solid ${T.goldBorder}`,
                      }}
                    >
                      {student.quarter} · 2024–25
                    </span>
                  </div>
                  <div
                    style={{
                      padding: "14px 18px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {insights.map((ins, i) => (
                      <Insight key={i} type={ins.type} msg={ins.msg} />
                    ))}
                  </div>
                </div>

                {/* Student Information */}
                <div
                  style={{
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 16,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "13px 18px",
                      borderBottom: `1px solid ${T.border}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.textPrimary,
                      }}
                    >
                      Student Information
                    </span>
                  </div>
                  <div style={{ padding: "14px 18px" }}>
                    <div className="info-grid">
                      {/* Fixed Student ID — STU-YYSSSS format */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "9px 0",
                          borderBottom: `1px solid ${T.border}`,
                        }}
                      >
                        <span style={{ fontSize: 12, color: T.textSoft }}>
                          Student ID
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: T.textPrimary,
                            fontFamily: "monospace",
                            letterSpacing: ".05em",
                          }}
                        >
                          {student.studentId}
                        </span>
                      </div>
                      {/* Adviser — full name, clickable → profile modal */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "9px 0",
                          borderBottom: `1px solid ${T.border}`,
                        }}
                      >
                        <span style={{ fontSize: 12, color: T.textSoft }}>
                          Adviser
                        </span>
                        <AdviserLink
                          adviser={student.adviser}
                          onClick={() => setShowAdviser(true)}
                        />
                      </div>
                      {[
                        [
                          "Grade & Section",
                          `${student.grade} — ${student.section}`,
                        ],
                        ["School Year", student.sy],
                        ["School", student.school],
                        [
                          "Current Quarter",
                          `${student.quarter} · ${student.sy}`,
                        ],
                      ].map(([k, v]) => (
                        <div
                          key={k}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "9px 0",
                            borderBottom: `1px solid ${T.border}`,
                          }}
                        >
                          <span style={{ fontSize: 12, color: T.textSoft }}>
                            {k}
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: T.textPrimary,
                            }}
                          >
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: achievements + subject highlights */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {/* Achievements */}
                <div
                  style={{
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 16,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "13px 18px",
                      borderBottom: `1px solid ${T.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.textPrimary,
                      }}
                    >
                      Achievements
                    </span>
                    <span style={{ fontSize: 11, color: T.textSoft }}>
                      This school year
                    </span>
                  </div>
                  <div
                    style={{
                      padding: "14px 18px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {[
                      { name: "Most Improved", sub: "Filipino", icon: "↑" },
                      { name: "Perfect Score", sub: "ESP Q3", icon: "★" },
                      { name: "Honor Roll", sub: "Q2 2025", icon: "🏅" },
                    ].map((b) => (
                      <div
                        key={b.name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "10px 12px",
                          border: `1px solid ${T.border}`,
                          borderRadius: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: T.goldSoft,
                            border: `1.5px solid ${T.goldBorder}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            fontSize: 16,
                          }}
                        >
                          {b.icon}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: T.textPrimary,
                            }}
                          >
                            {b.name}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: T.textSoft,
                              marginTop: 1,
                            }}
                          >
                            {b.sub}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subject Highlights */}
                <div
                  style={{
                    background: T.surface,
                    border: `1px solid ${T.border}`,
                    borderRadius: 16,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "13px 18px",
                      borderBottom: `1px solid ${T.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.textPrimary,
                      }}
                    >
                      Subject Highlights
                    </span>
                    <span style={{ fontSize: 11, color: T.textSoft }}>
                      {student.quarter}
                    </span>
                  </div>
                  <div style={{ padding: "14px 18px" }}>
                    {subjects.slice(0, 5).map((subj, i) => {
                      const g = gradeInfo(subj.q3);
                      const pct = Math.max(0, ((subj.q3 - 60) / 40) * 100);
                      return (
                        <div key={i} style={{ marginBottom: i < 4 ? 10 : 0 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 3,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 500,
                                color: T.textPrimary,
                              }}
                            >
                              {subj.name}
                            </span>
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: g.c,
                              }}
                            >
                              {subj.q3}
                            </span>
                          </div>
                          <div
                            style={{
                              height: 4,
                              background: "#F0F0F2",
                              borderRadius: 3,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${pct}%`,
                                height: "100%",
                                background: g.c,
                                borderRadius: 3,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    <button
                      onClick={() => setTab("subjects")}
                      style={{
                        marginTop: 14,
                        width: "100%",
                        padding: "9px 0",
                        border: `1px solid ${T.goldBorder}`,
                        borderRadius: 9,
                        background: T.goldSoft,
                        color: T.goldDeep,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      View all subjects →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══ SUBJECTS ══ */}
        {tab === "subjects" && (
          <>
            <div
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                overflow: "hidden",
                marginBottom: 14,
              }}
            >
              <div
                className="subj-table-header"
                style={{
                  background: "#FAFAFA",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".09em",
                    textTransform: "uppercase",
                    color: T.textSoft,
                  }}
                >
                  Subject
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".09em",
                    textTransform: "uppercase",
                    color: T.textSoft,
                    textAlign: "center",
                  }}
                >
                  Q1
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".09em",
                    textTransform: "uppercase",
                    color: T.textSoft,
                    textAlign: "center",
                  }}
                >
                  Q2
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".09em",
                    textTransform: "uppercase",
                    color: T.goldDeep,
                    textAlign: "center",
                  }}
                >
                  Q3 ▾
                </span>
                <span
                  className="subj-col-melc"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".09em",
                    textTransform: "uppercase",
                    color: T.textSoft,
                  }}
                >
                  MELC Focus
                </span>
                <span className="subj-col-trend"></span>
              </div>
              {subjects.map((subj, i) => (
                <SubjectRow
                  key={i}
                  subj={subj}
                  active={selSubj === i}
                  onClick={() => setSelSubj(selSubj === i ? null : i)}
                />
              ))}
            </div>
            {selSubj !== null && <QuarterDetail subj={subjects[selSubj]} />}
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                padding: "8px 0 4px",
              }}
            >
              {[
                { l: "Outstanding ≥90", c: T.green },
                { l: "Very Satisfactory ≥85", c: T.blue },
                { l: "Satisfactory ≥80", c: T.goldDeep },
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

        {/* ══ ATTENDANCE ══ */}
        {tab === "attendance" && (
          <>
            <div className="att-grid">
              <StatCard
                label="Present"
                value={attendance.present}
                sub="Days attended"
                accent="#6ECA8F"
              />
              <StatCard
                label="Absent"
                value={attendance.absent}
                sub="Days missed"
                accent="#F0A09A"
              />
              <StatCard
                label="Late"
                value={attendance.late}
                sub="Tardiness"
                accent="#FCD34D"
              />
              <StatCard
                label="Rate"
                value={`${attPct}%`}
                sub="Attendance rate"
                accent={T.gold}
              />
            </div>
            <div
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "13px 18px",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: T.textPrimary,
                  }}
                >
                  Attendance Breakdown — {student.quarter}
                </span>
              </div>
              <div style={{ padding: "16px 18px" }}>
                {[
                  {
                    l: "Present",
                    v: (attendance.present / attendance.total) * 100,
                    c: T.green,
                    t: `${attendance.present} / ${attendance.total}`,
                  },
                  {
                    l: "Absent",
                    v: (attendance.absent / attendance.total) * 100,
                    c: T.red,
                    t: `${attendance.absent} / ${attendance.total}`,
                  },
                  {
                    l: "Late",
                    v: (attendance.late / attendance.total) * 100,
                    c: T.amber,
                    t: `${attendance.late} / ${attendance.total}`,
                  },
                ].map((row) => (
                  <div
                    key={row.l}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: T.textMid,
                        width: 58,
                      }}
                    >
                      {row.l}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 8,
                        background: "#F0F0F2",
                        borderRadius: 5,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${row.v}%`,
                          height: "100%",
                          background: row.c,
                          borderRadius: 5,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: row.c,
                        width: 52,
                        textAlign: "right",
                      }}
                    >
                      {row.t}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    marginTop: 16,
                    padding: "12px 14px",
                    background: attPct >= 90 ? T.greenBg : T.amberBg,
                    border: `1px solid ${attPct >= 90 ? "#BBF7D0" : T.amberBorder}`,
                    borderRadius: 10,
                    fontSize: 12.5,
                    color: attPct >= 90 ? "#14532D" : "#78350F",
                    lineHeight: 1.5,
                  }}
                >
                  {attPct >= 90
                    ? "Attendance is within DepEd's required 90% threshold. Student is in good standing."
                    : `Attendance is at ${attPct}% — below DepEd's 90% requirement. Please coordinate with the class adviser.`}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══ ACTIVITY ══ */}
        {tab === "activity" && (
          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "13px 18px",
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary }}
              >
                Recent Activity
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  padding: "3px 9px",
                  borderRadius: 20,
                  background: T.goldSoft,
                  color: T.goldDeep,
                  border: `1px solid ${T.goldBorder}`,
                }}
              >
                {student.quarter} · 2024–25
              </span>
            </div>
            {activity.map((a, i) => {
              const st = actStyle[a.type] || actStyle.ok;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 18px",
                    borderBottom:
                      i < activity.length - 1
                        ? `1px solid ${T.border}`
                        : "none",
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: st.dot,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 10,
                      color: T.textSoft,
                      width: 38,
                      flexShrink: 0,
                      fontWeight: 500,
                    }}
                  >
                    {a.date}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      fontSize: 12,
                      padding: "7px 12px",
                      borderRadius: 8,
                      background: st.bg,
                      color: st.text,
                      fontWeight: 500,
                    }}
                  >
                    {a.text}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── PROFILE MODAL ── */}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}

      {/* ── ADVISER MODAL ── */}
      {showAdviser && (
        <AdviserModal
          adviser={student.adviser}
          school={student.school}
          onClose={() => setShowAdviser(false)}
        />
      )}
    </div>
  );
}
