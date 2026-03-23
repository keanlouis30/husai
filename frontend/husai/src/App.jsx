import { useState } from "react";
import "./App.css";
import HusaiTeacherDashboard from "./pages/HusaiTeacherDashboard";
import HusaiStudentDashboard from "./pages/HusaiStudentDashboard";
import HusaiAdminDashboard from "./pages/HusaiAdminDashboard";

function App() {
  const [role, setRole] = useState("student"); // default view

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>HUSAI Dashboard</h1>

        <div className="role-switch">
          <button
            onClick={() => setRole("student")}
            className={role === "student" ? "active" : ""}
          >
            Student
          </button>

          <button
            onClick={() => setRole("teacher")}
            className={role === "teacher" ? "active" : ""}
          >
            Teacher
          </button>
          <button
            onClick={() => setRole("admin")}
            className={role === "admin" ? "active" : ""}
          >
            Admin
          </button>
        </div>
      </header>

      <main>
        {role === "student" && <HusaiStudentDashboard />}
        {role === "teacher" && <HusaiTeacherDashboard />}
        {role === "admin" && <HusaiAdminDashboard />}
      </main>
    </div>
  );
}

export default App;
