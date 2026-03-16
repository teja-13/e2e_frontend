import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back!</h1>
        <p>Manage your library account and books</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>📚 Book a Book</h3>
          <p>Search and request new books</p>
          <button onClick={() => navigate("/student/books/search")}>
            Browse Books
          </button>
        </div>

        <div className="dashboard-card">
          <h3>📖 My Books</h3>
          <p>View your borrowed books</p>
          <button onClick={() => navigate("/student/my-books")}>
            View Books
          </button>
        </div>

        <div className="dashboard-card">
          <h3>⚙️ Settings</h3>
          <p>Manage your profile and fines</p>
          <button onClick={() => navigate("/student/settings")}>
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;