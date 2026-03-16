import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import api from "../../services/api";

type Notice = {
  _id: string;
  message: string;
  createdAt?: string;
  read?: boolean;
};

const StudentLayout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [toastQueue, setToastQueue] = useState<Notice[]>([]);
  const [activeToast, setActiveToast] = useState<Notice | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const unreadNotices = useMemo(() => notices.filter((n) => !n.read), [notices]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (role !== "student" || !token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get<Notice[]>("/student/notifications");
      setNotices(data);

      // enqueue new notices for toast display (ones not already shown)
      const existingIds = new Set([...notices.map((n) => n._id), ...toastQueue.map((t) => t._id), activeToast?._id].filter(Boolean) as string[]);
      const newOnes = (data || []).filter((n: Notice) => !existingIds.has(n._id));
      if (newOnes.length) {
        setToastQueue((q) => [...q, ...newOnes]);
      }
    } catch (err) {
      // swallow to keep header stable
    }
  };

  useEffect(() => {
    fetchNotifications();
    pollTimer.current = setInterval(fetchNotifications, 60000);
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeToast || toastQueue.length === 0) return;
    const next = toastQueue[0];
    setActiveToast(next);
    setToastQueue((q) => q.slice(1));
    toastTimer.current = setTimeout(() => {
      setActiveToast(null);
    }, 3000);
  }, [toastQueue, activeToast]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleToggleNotifications = async () => {
    if (!notifOpen) {
      await fetchNotifications();
    }
    setNotifOpen((s) => !s);
  };

  const markRead = async (id: string) => {
    try {
      await api.patch(`/student/notifications/${id}/read`);
      setNotices((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      // keep silent to not break UI
    }
  };

  return (
    <>
      {/* ===== HEADER ===== */}
      <header className="site-header has-menu">
        {/* Menu toggle (left) */}
        <button
          aria-label="Toggle menu"
          className="menu-toggle"
          onClick={() => setOpen((s) => !s)}
        >
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>

        {/* Logo */}
        <div className="logo-bubble">
          <img src={logo} alt="Library Logo" className="site-logo" />
        </div>

        {/* Title */}
        <div className="title-bubble">
          <h1 className="site-title">STUDENT DASHBOARD</h1>
        </div>

        {/* Logout */}
        <div className="header-actions">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
          <div style={{ position: "relative", marginLeft: "10px" }}>
            <button
              aria-label="Notifications"
              onClick={handleToggleNotifications}
              style={{
                background: "var(--black-secondary)",
                border: "1px solid var(--border-gold)",
                borderRadius: "8px",
                width: "42px",
                height: "42px",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              ✉️
            </button>
            {unreadNotices.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  background: "var(--gold-main)",
                  color: "var(--black-main)",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  fontSize: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  border: "1px solid var(--border-gold)",
                }}
              >
                {Math.min(unreadNotices.length, 9)}
              </span>
            )}

            {notifOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "48px",
                  background: "var(--black-card)",
                  border: "1px solid var(--border-gold)",
                  borderRadius: "10px",
                  width: "320px",
                  maxHeight: "360px",
                  overflowY: "auto",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                  zIndex: 20,
                  padding: "10px",
                }}
              >
                {notices.length === 0 && <p className="muted" style={{ margin: 0 }}>No notifications.</p>}
                {notices.map((n) => (
                  <div
                    key={n._id}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-gold)",
                      background: "var(--black-secondary)",
                      color: "var(--text-primary)",
                      marginBottom: "8px",
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: "4px" }}>{n.message}</div>
                    {n.createdAt && (
                      <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                        {new Date(n.createdAt).toLocaleString()}
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px" }}>
                      <button
                        onClick={() => markRead(n._id)}
                        style={{
                          background: "transparent",
                          color: "var(--gold-main)",
                          border: "1px solid var(--border-gold)",
                          borderRadius: "6px",
                          padding: "4px 8px",
                          cursor: "pointer",
                        }}
                      >
                        ✓
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ===== BODY ===== */}
      <div className="layout-body">
        {/* Backdrop when open */}
        {open && <div className="backdrop" onClick={() => setOpen(false)} />}

        {/* ===== SIDEBAR ===== */}
        <aside className={`sidebar ${open ? "open" : ""}`}>
          <nav className="sidebar-nav">
            <NavLink to="/student/dashboard" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
              Dashboard
            </NavLink>
            <NavLink to="/student/books/search" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
              Book a Book
            </NavLink>
            <NavLink to="/student/my-books" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
              My Books
            </NavLink>
            <NavLink to="/student/settings" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
              Settings
            </NavLink>
          </nav>
        </aside>

        {/* ===== PAGE CONTENT ===== */}
        <main className="content">
          {activeToast && (
            <div
              style={{
                position: "fixed",
                top: "72px",
                right: "16px",
                background: "var(--black-card)",
                border: "1px solid var(--border-gold)",
                borderRadius: "10px",
                padding: "12px 14px",
                color: "var(--text-primary)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                zIndex: 30,
                minWidth: "260px",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>{activeToast.message}</div>
              {activeToast.createdAt && (
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  {new Date(activeToast.createdAt).toLocaleString()}
                </div>
              )}
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default StudentLayout;