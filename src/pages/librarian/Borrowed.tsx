import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

type Borrow = {
  _id: string;
  borrowedAt?: string;
  dueDate?: string;
  student?: { studentId?: string; email?: string; name?: string };
  book?: { title?: string; author?: string };
};

type StudentChip = {
  studentId: string;
  name?: string;
  email?: string;
  count: number;
};

const Borrowed = () => {
  const navigate = useNavigate();
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openStudent, setOpenStudent] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const handleSelectStudent = (id: string) => {
    setOpenStudent((prev) => (prev === id ? null : id));
  };

  const loadBorrows = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get<Borrow[]>("/librarian/borrowed-active");
      setBorrows(data);
    } catch (err) {
      setError("Unable to load active borrows");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBorrows();
  }, []);

  const markReturned = async (id: string) => {
    try {
      await api.patch(`/librarian/borrowed/${id}/return`);
      setBorrows((s) => s.filter((b) => b._id !== id));
    } catch (err) {
      setError("Unable to mark as returned");
    }
  };

  const uniqueStudents: StudentChip[] = Array.from(
    new Map(
      borrows
        .filter((b) => b.student?.studentId)
        .map((b) => [
          b.student!.studentId!,
          {
            studentId: b.student!.studentId!,
            name: b.student?.name,
            email: b.student!.email,
            count: 0,
          },
        ])
    ).values()
  ).map((s) => ({
    ...s,
    count: borrows.filter((b) => b.student?.studentId === s.studentId).length,
  }));

  const filteredStudents = uniqueStudents.filter((s) => {
    if (!search.trim()) return true;
    const term = search.trim().toLowerCase();
    return (
      (s.email && s.email.toLowerCase().includes(term)) ||
      (s.studentId && s.studentId.toLowerCase().includes(term)) ||
      (s.name && s.name.toLowerCase().includes(term))
    );
  });

  const suggestions = search.trim()
    ? uniqueStudents
        .filter((s) => {
          const term = search.trim().toLowerCase();
          return (
            (s.email && s.email.toLowerCase().includes(term)) ||
            (s.studentId && s.studentId.toLowerCase().includes(term)) ||
            (s.name && s.name.toLowerCase().includes(term))
          );
        })
        .slice(0, 5)
    : [];

  const groupedByStudent = filteredStudents.map((s) => ({
    student: s,
    borrows: borrows.filter((b) => b.student?.studentId === s.studentId),
  }));

  return (
    <div className="my-books-container">
      <button className="back-button" onClick={() => navigate(-1)}>←</button>

      <div className="my-books-header">
        <h1>Active Borrowed Books</h1>
        <button className="btn-primary" onClick={loadBorrows} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div style={{ margin: "8px 0 16px 0" }}>
        <input
          type="text"
          placeholder="Search student by email, name, or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid var(--border-gold)",
            background: "var(--black-secondary)",
            color: "var(--text-primary)",
          }}
        />
        {suggestions.length > 0 && (
          <div
            style={{
              marginTop: "6px",
              background: "var(--black-secondary)",
              border: "1px solid var(--border-gold)",
              borderRadius: "8px",
              padding: "6px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              maxHeight: "220px",
              overflowY: "auto",
            }}
          >
            {suggestions.map((s) => (
              <button
                key={`suggest-${s.studentId}`}
                onClick={() => {
                  handleSelectStudent(s.studentId);
                  setSearch("");
                }}
                style={{
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  padding: "6px 4px",
                }}
              >
                <div style={{ fontWeight: 600 }}>{s.name || s.email || s.studentId}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  {s.email || "N/A"} • {s.studentId}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {groupedByStudent.length === 0 && !loading && (
          <p className="muted">No active borrows.</p>
        )}

        {groupedByStudent.map(({ student, borrows: studentBorrows }) => {
          const isOpen = openStudent === student.studentId;
          return (
            <div
              key={student.studentId}
              style={{
                background: "linear-gradient(135deg, var(--black-card), var(--black-secondary))",
                border: "1px solid var(--border-gold)",
                borderRadius: "10px",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <button
                onClick={() => handleSelectStudent(student.studentId)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  background: "none",
                  border: "none",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  textAlign: "left",
                  padding: 0,
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 4px 0" }}>{student.name || student.email || student.studentId}</h3>
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    ID: {student.studentId} • Email: {student.email || "N/A"}
                  </p>
                </div>
                <span
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, var(--gold-main), var(--gold-soft))",
                    color: "var(--black-main)",
                    fontWeight: 700,
                    minWidth: "120px",
                    textAlign: "center",
                  }}
                >
                  {student.count} book{student.count === 1 ? "" : "s"}
                </span>
              </button>

              {isOpen && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {studentBorrows.map((b) => (
                    <div
                      key={b._id}
                      style={{
                        background: "var(--black-secondary)",
                        border: "1px solid var(--border-gold)",
                        borderRadius: "8px",
                        padding: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div style={{ textAlign: "left" }}>
                        <h4 style={{ margin: "0 0 4px 0", color: "var(--text-primary)" }}>
                          {b.book?.title || "Book"}
                        </h4>
                        {b.book?.author && (
                          <p style={{ margin: 0, color: "var(--text-muted)" }}>{b.book.author}</p>
                        )}
                        {b.dueDate && (
                          <p style={{ margin: "4px 0 0 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                            Due: {new Date(b.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => markReturned(b._id)}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "6px",
                          border: "none",
                          background: "linear-gradient(135deg, var(--gold-main), var(--gold-soft))",
                          color: "var(--black-main)",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                        }}
                      >
                        ✓ Mark Submitted
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Borrowed;
