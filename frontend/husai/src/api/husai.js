// src/api/husai.js

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// ── HELPER ────────────────────────────────────────────────────────────────────
// Wraps fetch with error handling so you don't repeat try/catch everywhere
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Request failed: ${response.status}`);
  }

  return response.json();
}

// ── STUDENT ENDPOINTS ─────────────────────────────────────────────────────────
export const studentsApi = {
  // GET /api/students/STU-240142
  getProfile: (studentId) =>
    request(`/students/${studentId}`),

  // GET /api/students/STU-240142/subjects?quarter=Q3
  getSubjects: (studentId, quarter = "Q3") =>
    request(`/students/${studentId}/subjects?quarter=${quarter}`),

  // GET /api/students/STU-240142/insights
  getInsights: (studentId) =>
    request(`/students/${studentId}/insights`),

  // GET /api/students/STU-240142/attendance?quarter=Q3
  getAttendance: (studentId, quarter = "Q3") =>
    request(`/students/${studentId}/attendance?quarter=${quarter}`),

  // GET /api/students/STU-240142/activity?limit=10
  getActivity: (studentId, limit = 10) =>
    request(`/students/${studentId}/activity?limit=${limit}`),
};

// ── TEACHER ENDPOINTS ─────────────────────────────────────────────────────────
export const teachersApi = {
  // GET /api/teachers/TCH-0018
  getProfile: (teacherId) =>
    request(`/teachers/${teacherId}`),

  // GET /api/teachers/TCH-0018/roster?risk=high
  getRoster: (teacherId, { risk, search } = {}) => {
    const params = new URLSearchParams();
    if (risk)   params.append("risk", risk);
    if (search) params.append("search", search);
    const query = params.toString() ? `?${params}` : "";
    return request(`/teachers/${teacherId}/roster${query}`);
  },

  // GET /api/teachers/TCH-0018/stats
  getStats: (teacherId) =>
    request(`/teachers/${teacherId}/stats`),

  // GET /api/teachers/TCH-0018/gaps
  getGaps: (teacherId) =>
    request(`/teachers/${teacherId}/gaps`),

  // POST /api/teachers/TCH-0018/observations
  saveObservation: (teacherId, studentId, observation) =>
    request(`/teachers/${teacherId}/observations`, {
      method: "POST",
      body: JSON.stringify({ student_id: studentId, observation }),
    }),
};

// ── AI ENDPOINTS ──────────────────────────────────────────────────────────────
export const aiApi = {
  // POST /api/ai/report — admin school narrative
  generateReport: (schoolData) =>
    request("/ai/report", {
      method: "POST",
      body: JSON.stringify(schoolData),
    }),

  // POST /api/ai/query — teacher natural language query
  nlQuery: (query, teacherId, section) =>
    request("/ai/query", {
      method: "POST",
      body: JSON.stringify({
        query,
        teacher_id: teacherId,
        section,
      }),
    }),

  // POST /api/ai/resume/STU-240142
  generateResume: (studentId) =>
    request(`/ai/resume/${studentId}`, {
      method: "POST",
    }),
};