import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

type Reservation = {
  _id: string;
  status: string;
  studentId?: string;
  studentEmail?: string;
  createdAt?: string;
  book?: {
    title?: string;
    author?: string;
  };
};

const Reservations = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get<Reservation[]>("/librarian/reservations", {
        params: { status: "pending" },
      });
      setItems(data);
    } catch (err) {
      try {
        // fallback: fetch all and filter pending client-side in case the status param causes issues
        const { data } = await api.get<Reservation[]>("/librarian/reservations");
        setItems((data || []).filter((r) => r.status === "pending"));
        setError(data && data.length > 0 ? "" : "Unable to load reservations");
      } catch (err2) {
        setError("Unable to load reservations. Please refresh or check server.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id: string) => {
    try {
      await api.patch(`/librarian/reservations/${id}/approve`);
      setItems((s) => s.filter((r) => r._id !== id));
    } catch (err) {
      setError("Unable to approve reservation");
    }
  };

  return (
    <div className="my-books-container">
      <button className="back-button" onClick={() => navigate(-1)}>←</button>

      <div className="my-books-header">
        <h1>Pending Book Requests</h1>
        <button className="btn-primary" onClick={load} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {!loading && !error && items.length === 0 && <p className="muted">No pending requests.</p>}
        {items.map((res) => (
          <div
            key={res._id}
            style={{
              background: "linear-gradient(135deg, var(--black-card), var(--black-secondary))",
              border: "1px solid var(--border-gold)",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <h3 style={{ margin: "0 0 4px 0", color: "var(--text-primary)" }}>
                {res.book?.title || "Book"}
              </h3>
              {res.book?.author && (
                <p style={{ margin: 0, color: "var(--text-muted)" }}>{res.book.author}</p>
              )}
              <p style={{ margin: "6px 0 0 0", color: "var(--gold-main)", fontSize: "0.9rem" }}>
                Student: {res.studentEmail || res.studentId || "N/A"}
              </p>
              {res.createdAt && (
                <p style={{ margin: "4px 0 0 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Requested: {new Date(res.createdAt).toLocaleString()}
                </p>
              )}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => approve(res._id)}
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
                ✓ Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservations;