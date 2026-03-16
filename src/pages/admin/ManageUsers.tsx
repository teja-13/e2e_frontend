import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

type Registration = {
  _id: string;
  name?: string;
  email: string;
  role: string;
  rollNumber?: string;
  branch?: string;
  section?: string;
  createdAt?: string;
};

type Student = {
  _id: string;
  name?: string;
  email: string;
  studentId?: string;
  rollNumber?: string;
  branch?: string;
  section?: string;
};

type Staff = {
  _id: string;
  name?: string;
  email: string;
  userId?: string;
  role?: string;
};

const ManageUsers = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"requests" | "students" | "librarians">("requests");
  const [students, setStudents] = useState<Registration[]>([]);
  const [librarians, setLibrarians] = useState<Registration[]>([]);
  const [currentStudents, setCurrentStudents] = useState<Student[]>([]);
  const [currentLibrarians, setCurrentLibrarians] = useState<Staff[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [librarianSearch, setLibrarianSearch] = useState("");
  const [addingLib, setAddingLib] = useState(false);
  const [libForm, setLibForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [
        { data: studentRegs },
        { data: librarianRegs },
        { data: studentsAll },
        { data: librariansAll },
      ] = await Promise.all([
        api.get<Registration[]>("/registrations", { params: { role: "student" } }),
        api.get<Registration[]>("/registrations", { params: { role: "librarian" } }),
        api.get<Student[]>("/admin/students"),
        api.get<Staff[]>("/admin/librarians"),
      ]);
      setStudents(studentRegs);
      setLibrarians(librarianRegs);
      setCurrentStudents(studentsAll);
      setCurrentLibrarians(librariansAll);
    } catch (err) {
      setError("Unable to load users");
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
      await load();
    } catch (err) {
      setError("Unable to approve request");
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/registrations/${id}`);
      await load();
    } catch (err) {
      setError("Unable to remove request");
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      await api.delete(`/librarian/students/${id}`);
      await load();
    } catch (err) {
      setError("Unable to delete student");
    }
  };

  const deleteLibrarian = async (id: string) => {
    try {
      await api.delete(`/admin/librarians/${id}`);
      await load();
    } catch (err) {
      setError("Unable to delete librarian");
    }
  };

  const resetStudentPassword = async (id: string) => {
    const newPassword = window.prompt("Enter new password for student");
    if (!newPassword) return;
    try {
      await api.put(`/admin/students/${id}/password`, { newPassword });
      alert("Password updated");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Unable to reset password";
      setError(message);
    }
  };

  const resetLibrarianPassword = async (id: string) => {
    const newPassword = window.prompt("Enter new password for librarian");
    if (!newPassword) return;
    try {
      await api.put(`/admin/librarians/${id}/password`, { newPassword });
      alert("Password updated");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Unable to reset password";
      setError(message);
    }
  };

  const addLibrarian = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/admin/add-user", { ...libForm, role: "librarian" });
      setLibForm({ name: "", email: "", password: "" });
      setAddingLib(false);
      await load();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Unable to add librarian";
      setError(message);
    }
  };

  const filteredStudents = currentStudents.filter((s) => {
    const term = studentSearch.trim().toLowerCase();
    if (!term) return true;
    return (
      (s.name && s.name.toLowerCase().includes(term)) ||
      (s.email && s.email.toLowerCase().includes(term)) ||
      (s.studentId && s.studentId.toLowerCase().includes(term)) ||
      (s.rollNumber && s.rollNumber.toLowerCase().includes(term))
    );
  });

  const filteredLibrarians = currentLibrarians.filter((s) => {
    const term = librarianSearch.trim().toLowerCase();
    if (!term) return true;
    return (
      (s.name && s.name.toLowerCase().includes(term)) ||
      (s.email && s.email.toLowerCase().includes(term))
    );
  });

  return (
    <div className="my-books-container">
      <button className="back-button" onClick={() => navigate(-1)}>←</button>

      <div className="my-books-header">
        <h1>Manage Users</h1>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", justifyContent: "center", flexWrap: "wrap" }}>
        <button
          className={`btn-primary ${activeTab === "requests" ? "" : "inactive"}`}
          onClick={() => setActiveTab("requests")}
          style={{
            padding: "10px 20px",
            background: activeTab === "requests" ? "linear-gradient(135deg, var(--gold-main), var(--gold-soft))" : "var(--black-secondary)",
            color: activeTab === "requests" ? "var(--black-main)" : "var(--text-primary)",
            border: activeTab === "requests" ? "none" : "1px solid var(--border-gold)",
          }}
        >
          Requests
        </button>
        <button
          className={`btn-primary ${activeTab === "students" ? "" : "inactive"}`}
          onClick={() => setActiveTab("students")}
          style={{
            padding: "10px 20px",
            background: activeTab === "students" ? "linear-gradient(135deg, var(--gold-main), var(--gold-soft))" : "var(--black-secondary)",
            color: activeTab === "students" ? "var(--black-main)" : "var(--text-primary)",
            border: activeTab === "students" ? "none" : "1px solid var(--border-gold)",
          }}
        >
          Students
        </button>
        <button
          className={`btn-primary ${activeTab === "librarians" ? "" : "inactive"}`}
          onClick={() => setActiveTab("librarians")}
          style={{
            padding: "10px 20px",
            background: activeTab === "librarians" ? "linear-gradient(135deg, var(--gold-main), var(--gold-soft))" : "var(--black-secondary)",
            color: activeTab === "librarians" ? "var(--black-main)" : "var(--text-primary)",
            border: activeTab === "librarians" ? "none" : "1px solid var(--border-gold)",
          }}
        >
          Librarians
        </button>
      </div>

      <div>
        {error && <p className="error-text">{error}</p>}
        {loading && <p className="muted">Loading...</p>}

        {activeTab === "requests" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h2 style={{ margin: "0 0 8px 0" }}>Pending Students</h2>
            {students.length === 0 && !loading && <p className="muted">No pending students.</p>}
            {students.map((student) => (
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
                  <h3 style={{ margin: "0 0 4px 0", color: "var(--text-primary)" }}>{student.name || "Student"}</h3>
                  <p style={{ margin: "0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    {student.email}
                  </p>
                  {student.rollNumber && (
                    <p style={{ margin: "4px 0 0 0", color: "var(--gold-main)", fontSize: "0.85rem" }}>
                      Roll: {student.rollNumber}
                    </p>
                  )}
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
                    Approve
                  </button>
                  <button
                    onClick={() => remove(student._id)}
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
                    Reject
                  </button>
                </div>
              </div>
            ))}

            <h2 style={{ margin: "24px 0 8px 0" }}>Pending Librarians</h2>
            {librarians.length === 0 && !loading && <p className="muted">No pending librarians.</p>}
            {librarians.map((librarian) => (
              <div
                key={librarian._id}
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
                  <h3 style={{ margin: "0 0 4px 0", color: "var(--text-primary)" }}>{librarian.name || "Librarian"}</h3>
                  <p style={{ margin: "0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    {librarian.email}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => approve(librarian._id)}
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
                    Approve
                  </button>
                  <button
                    onClick={() => remove(librarian._id)}
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
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "students" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="Search students by name, email, or ID"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-gold)",
                  background: "var(--black-secondary)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
            {filteredStudents.length === 0 && !loading && <p className="muted">No students found.</p>}
            {filteredStudents.map((s) => (
              <div
                key={s._id}
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
                  <h3 style={{ margin: "0 0 4px 0", color: "var(--text-primary)" }}>{s.name || "Student"}</h3>
                  <p style={{ margin: "0", color: "var(--text-muted)", fontSize: "0.9rem" }}>{s.email}</p>
                  <p style={{ margin: "4px 0 0 0", color: "var(--gold-main)", fontSize: "0.85rem" }}>
                    ID: {s.studentId || s.rollNumber || "-"}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => resetStudentPassword(s._id)}
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
                  <button
                    onClick={() => deleteStudent(s._id)}
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
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "librarians" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ marginBottom: "12px" }}>
              <input
                type="text"
                placeholder="Search librarians by name or email"
                value={librarianSearch}
                onChange={(e) => setLibrarianSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-gold)",
                  background: "var(--black-secondary)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div className="settings-section-item" style={{ padding: "16px" }}>
              <h3 style={{ marginTop: 0, color: "var(--gold-main)" }}>Add Librarian</h3>
              {!addingLib && (
                <button className="btn-primary" onClick={() => setAddingLib(true)} style={{ width: "fit-content" }}>
                  New Librarian
                </button>
              )}
              {addingLib && (
                <form onSubmit={addLibrarian} className="profile-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={libForm.name}
                      onChange={(e) => setLibForm((p) => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={libForm.email}
                      onChange={(e) => setLibForm((p) => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      value={libForm.password}
                      onChange={(e) => setLibForm((p) => ({ ...p, password: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-button-group">
                    <button type="button" className="btn-secondary" onClick={() => { setAddingLib(false); setLibForm({ name: "", email: "", password: "" }); }}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Save Librarian
                    </button>
                  </div>
                </form>
              )}
            </div>

            {filteredLibrarians.length === 0 && !loading && <p className="muted">No librarians found.</p>}
            {filteredLibrarians.map((s) => (
              <div
                key={s._id}
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
                  <h3 style={{ margin: "0 0 4px 0", color: "var(--text-primary)" }}>{s.name || "Librarian"}</h3>
                  <p style={{ margin: "0", color: "var(--text-muted)", fontSize: "0.9rem" }}>{s.email}</p>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => resetLibrarianPassword(s._id)}
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
                  <button
                    onClick={() => deleteLibrarian(s._id)}
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
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
