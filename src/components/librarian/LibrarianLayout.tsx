import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const LibrarianLayout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (role !== "librarian" || !token) {
      navigate("/librarian/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <>
      {/* ===== HEADER ===== */}
      <header className="site-header has-menu">
        {/* Menu toggle (hamburger) */}
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
          <h1 className="site-title">LIBRARIAN PANEL</h1>
        </div>

        {/* Logout */}
        <div className="header-actions">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {/* ===== BODY ===== */}
      <div className="layout-body">
        {/* Backdrop when open */}
        {open && <div className="backdrop" onClick={() => setOpen(false)} />}

        {/* ===== SIDEBAR ===== */}
        <aside className={`sidebar ${open ? "open" : ""}`}>
          <nav className="sidebar-nav">
            <NavLink to="/librarian/dashboard" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
              Dashboard
            </NavLink>
            <NavLink to="/librarian/books" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
              Books
            </NavLink>
            <NavLink to="/librarian/students" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
              Students
            </NavLink>
            <NavLink to="/librarian/reservations" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
              Requests
            </NavLink>
            <NavLink to="/librarian/borrowed" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>
              Borrowed
            </NavLink>
          </nav>
        </aside>

        {/* ===== PAGE CONTENT ===== */}
        <main className="content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default LibrarianLayout;
