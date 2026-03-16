import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

type Student = {
  _id: string;
  name?: string;
  email: string;
  studentId?: string;
  rollNumber?: string;
  branch?: string;
  section?: string;
};

type Registration = {
  _id: string;
  name?: string;
  email: string;
  rollNumber?: string;
  createdAt?: string;
};

const ManageStudents = () => {
  const navigate = useNavigate();
  const [pendingStudents, setPending] = useState<Registration[]>([]);
  const [activeStudents, setActive] = useState<Student[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [{ data: regs }, { data: enrolled }] = await Promise.all([
        api.get<Registration[]>("/registrations", { params: { role: "student" } }),
        api.get<Student[]>("/librarian/students"),
      ]);
      setPending(regs);
      setActive(enrolled);
    } catch (err) {
      setError("Unable to load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id: string) => {
    try {
      await api.patch(`/registrations/${id}/approve`);
      setPending((s) => s.filter((r) => r._id !== id));
      await load(); // refresh active list after approval
    } catch (err) {
      setError("Unable to approve");
    }
  };

  const reject = async (id: string) => {
    try {
      await api.delete(`/registrations/${id}`);
      setPending((s) => s.filter((r) => r._id !== id));
    } catch (err) {
      setError("Unable to reject");
    }
  };

  const removeStudent = async (id: string) => {
    try {
      await api.delete(`/librarian/students/${id}`);
      setActive((s) => s.filter((r) => r._id !== id));
    } catch (err) {
      setError("Unable to delete student");
    }
  };

  const resetPassword = async (id: string) => {
    const newPassword = window.prompt("Enter new password for student");
    if (!newPassword) return;
    try {
      await api.put(`/librarian/students/${id}/password`, { newPassword });
      alert("Password updated");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Unable to reset password";
      setError(message);
    }
  };

  return (
    <div className="my-books-container">
      <button className="back-button" onClick={() => navigate(-1)}>←</button>
      
      <div className="my-books-header">
        <h1>Manage Students</h1>
      </div>

      {error && <p className="error-text">{error}</p>}
      {loading && <p className="muted">Loading...</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <section>
          <h2 style={{ color: "var(--gold-main)", marginBottom: "12px", textAlign: "left" }}>
            Pending registrations ({pendingStudents.length})
          </h2>
          {pendingStudents.length === 0 && !loading && (
            <p className="muted">No pending registrations.</p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {pendingStudents.map((student) => (
              <div
                key={student._id}
                style={{
                  background: "linear-gradient(135deg, var(--black-card), var(--black-secondary))",
                  border: "1px solid var(--border-gold)",
                  borderRadius: "8px",
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h3 style={{ margin: "0", color: "var(--text-primary)" }}>{student.name || "Student"}</h3>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        background: "#fbbf2422",
                        color: "#fbbf24",
                        border: "1px solid var(--border-gold)",
                      }}
                    >
                      Pending
                    </span>
                  </div>
                  <p style={{ margin: "4px 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    {student.email}
                  </p>
                  <p style={{ margin: "4px 0 0 0", color: "var(--gold-main)", fontSize: "0.85rem" }}>
                    ID: {student.rollNumber || "-"}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => approve(student._id)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "none",
                      background: "linear-gradient(135deg, var(--gold-main), var(--gold-soft))",
                      color: "var(--black-main)",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    ✓ Accept
                  </button>
                  <button
                    onClick={() => reject(student._id)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "none",
                      background: "#d9534f",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ color: "var(--gold-main)", marginBottom: "12px", textAlign: "left" }}>
            Active students ({activeStudents.length})
          </h2>
          {activeStudents.length === 0 && !loading && (
            <p className="muted">No active students.</p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {activeStudents.map((student) => (
              <div
                key={student._id}
                style={{
                  background: "linear-gradient(135deg, var(--black-card), var(--black-secondary))",
                  border: "1px solid var(--border-gold)",
                  borderRadius: "8px",
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h3 style={{ margin: "0", color: "var(--text-primary)" }}>{student.name || "Student"}</h3>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        background: "#22c55e22",
                        color: "#22c55e",
                        border: "1px solid var(--border-gold)",
                      }}
                    >
                      Active
                    </span>
                  </div>
                  <p style={{ margin: "4px 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    {student.email}
                  </p>
                  <p style={{ margin: "4px 0 0 0", color: "var(--gold-main)", fontSize: "0.85rem" }}>
                    ID: {student.studentId || student.rollNumber || "-"}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => removeStudent(student._id)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "none",
                      background: "#d9534f",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    Delete Profile
                  </button>
                  <button
                    onClick={() => resetPassword(student._id)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-gold)",
                      background: "var(--black-secondary)",
                      color: "var(--gold-main)",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                    }}
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ManageStudents;
