import { useEffect, useState } from "react";
import api from "../../../services/api";

type Notice = {
  _id: string;
  message: string;
  createdAt?: string;
  read?: boolean;
};

const Notifications = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get<Notice[]>("/student/notifications");
      setNotices(data);
    } catch (err) {
      setError("Unable to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="notifications-settings-content">
      <div className="notifications-header">
        <h1>Notifications</h1>
      </div>

      {error && <p className="error-text">{error}</p>}
      {loading && <p className="muted">Loading...</p>}

      {!loading && notices.length === 0 && <p className="muted">No notifications yet.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {notices.map((n) => (
          <div
            key={n._id}
            style={{
              background: "var(--black-secondary)",
              border: "1px solid var(--border-gold)",
              borderRadius: "8px",
              padding: "12px",
              color: "var(--text-primary)",
            }}
          >
            <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>{n.message}</p>
            {n.createdAt && (
              <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem" }}>
                {new Date(n.createdAt).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;