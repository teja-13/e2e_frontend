import { useNavigate } from "react-router-dom";
import StatsCards from "../../components/analytics/StatsCards";
import BorrowTrendChart from "../../components/analytics/BorrowTrendChart";
import type { StatCard } from "../../components/analytics/StatsCards";
import type { BorrowTrendPoint } from "../../components/analytics/BorrowTrendChart";

const LibrarianDashboard = () => {
  const navigate = useNavigate();

  const statItems: StatCard[] = [
    { title: "Total Books", value: 1280 },
    { title: "Books Issued", value: 342, change: "+12%" },
    { title: "Overdue", value: 24, change: "-3%" },
  ];

  const borrowTrend: BorrowTrendPoint[] = [
    { month: "Jan", borrows: 120 },
    { month: "Feb", borrows: 150 },
    { month: "Mar", borrows: 180 },
    { month: "Apr", borrows: 200 },
    { month: "May", borrows: 210 },
    { month: "Jun", borrows: 240 },
  ];

  return (
    <div className="dashboard-container space-y-6">
      <div className="dashboard-header">
        <h1>Welcome to Librarian Panel</h1>
        <p>Manage books and students efficiently</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>📬 Book Requests</h3>
          <p>Review and approve pending borrow requests</p>
          <button onClick={() => navigate("/librarian/reservations")}>
            Go to Requests
          </button>
        </div>

        <div className="dashboard-card">
          <h3>📦 Borrowed Books</h3>
          <p>View and mark returns for active borrows</p>
          <button onClick={() => navigate("/librarian/borrowed")}>
            Go to Borrowed
          </button>
        </div>

        <div className="dashboard-card">
          <h3>📚 Manage Books</h3>
          <p>Add, update, or remove books from the library</p>
          <button onClick={() => navigate("/librarian/books")}>
            Go to Books
          </button>
        </div>

        <div className="dashboard-card">
          <h3>👥 Manage Students</h3>
          <p>Approve pending students and manage active users</p>
          <button onClick={() => navigate("/librarian/students")}>
            Go to Students
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Analytics</h2>
          <p className="text-sm text-gray-400">Mock data; ready for /api/analytics hooks.</p>
        </div>

        <StatsCards items={statItems} />

        <BorrowTrendChart data={borrowTrend} title="Borrowing Trend" />
      </div>
    </div>
  );
};

export default LibrarianDashboard;
