import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import StatsCards from "../../components/analytics/StatsCards";
import BorrowTrendChart from "../../components/analytics/BorrowTrendChart";
import TopBooksChart from "../../components/analytics/TopBooksChart";
import BookAvailabilityChart from "../../components/analytics/BookAvailabilityChart";
import FineAnalyticsChart from "../../components/analytics/FineAnalyticsChart";
import OverdueBooksTable from "../../components/analytics/OverdueBooksTable";
import RecentActivity from "../../components/analytics/RecentActivity";
import type { StatCard } from "../../components/analytics/StatsCards";
import type { BorrowTrendPoint } from "../../components/analytics/BorrowTrendChart";
import type { TopBook } from "../../components/analytics/TopBooksChart";
import type { AvailabilitySlice } from "../../components/analytics/BookAvailabilityChart";
import type { FineSlice } from "../../components/analytics/FineAnalyticsChart";
import type { OverdueRow } from "../../components/analytics/OverdueBooksTable";
import type { ActivityItem } from "../../components/analytics/RecentActivity";

type Stats = {
  totalBooks: number;
  availableCopies: number;
  totalReservations: number;
  pendingReservations: number;
  approvedReservations: number;
  totalStudents: number;
  totalStaff: number;
  activeBorrowed: number;
  overdueBorrowed: number;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  const mockCards: StatCard[] = [
    { title: "Total Books", value: 1280, change: "+4% MoM" },
    { title: "Books Issued", value: 342, change: "+12%" },
    { title: "Overdue", value: 24, change: "-3%" },
    { title: "Active Users", value: 1120, change: "+2%" },
  ];

  const mockBorrowTrend: BorrowTrendPoint[] = [
    { month: "Jan", borrows: 120 },
    { month: "Feb", borrows: 180 },
    { month: "Mar", borrows: 160 },
    { month: "Apr", borrows: 220 },
    { month: "May", borrows: 210 },
    { month: "Jun", borrows: 240 },
  ];

  const mockTopBooks: TopBook[] = [
    { title: "Design Systems", borrows: 42 },
    { title: "Clean Code", borrows: 38 },
    { title: "Pragmatic Programmer", borrows: 31 },
    { title: "Algorithms", borrows: 27 },
    { title: "Data Science 101", borrows: 22 },
  ];

  const mockAvailability: AvailabilitySlice[] = [
    { name: "Available", value: 720 },
    { name: "Issued", value: 280 },
    { name: "Reserved", value: 90 },
  ];

  const mockFines: FineSlice[] = [
    { name: "Paid", value: 4200 },
    { name: "Unpaid", value: 1800 },
    { name: "Waived", value: 600 },
  ];

  const mockOverdue: OverdueRow[] = [
    { title: "Clean Code", borrower: "A. Sharma", dueDate: "2026-03-02", daysOverdue: 5, fineDue: 75 },
    { title: "Design Systems", borrower: "N. Verma", dueDate: "2026-02-28", daysOverdue: 9, fineDue: 120 },
    { title: "Pragmatic Programmer", borrower: "R. Patel", dueDate: "2026-03-05", daysOverdue: 2, fineDue: 30 },
  ];

  const mockActivity: ActivityItem[] = [
    { time: "2m ago", message: "N. Verma paid fine for 'Design Systems'", type: "fine" },
    { time: "15m ago", message: "A. Sharma borrowed 'Clean Code'", type: "borrow" },
    { time: "1h ago", message: "Reservation approved for 'Pragmatic Programmer'", type: "borrow" },
    { time: "3h ago", message: "R. Patel returned 'Algorithms'", type: "return" },
  ];

  const loadStats = async () => {
    setError("");
    try {
      const { data } = await api.get<Stats>("/analytics/summary");
      setStats(data);
    } catch (err) {
      setError("Unable to load analytics; showing mock data");
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const cards = useMemo<StatCard[]>(() => {
    if (!stats) return mockCards;
    return [
      { title: "Total Books", value: stats.totalBooks },
      { title: "Available Copies", value: stats.availableCopies },
      { title: "Active Borrowed", value: stats.activeBorrowed, change: `Overdue: ${stats.overdueBorrowed}` },
      { title: "Users", value: stats.totalStudents + stats.totalStaff, change: `${stats.totalStudents} students` },
    ];
  }, [stats]);

  return (
    <div className="dashboard-container space-y-6">
      <div className="dashboard-header">
        <h1>Welcome to Admin Panel</h1>
        <p>Manage users and books efficiently</p>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <div className="dashboard-card">
          <h3>👥 Manage Users</h3>
          <p>Manage students and librarians</p>
          <button onClick={() => navigate("/admin/users")}>
            Go to Users
          </button>
        </div>

        <div className="dashboard-card">
          <h3>📚 Manage Books</h3>
          <p>Manage book inventory and records</p>
          <button onClick={() => navigate("/admin/books")}>
            Go to Books
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-white">Analytics</h2>
          <p className="text-sm text-gray-400">Mock data for now; wire to /api/analytics endpoints when ready.</p>
        </div>

        <StatsCards items={cards} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <BorrowTrendChart data={mockBorrowTrend} />
          </div>
          <TopBooksChart data={mockTopBooks} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <BookAvailabilityChart data={mockAvailability} />
          <FineAnalyticsChart data={mockFines} />
          <RecentActivity items={mockActivity} />
        </div>

        <OverdueBooksTable rows={mockOverdue} />
      </div>
    </div>
  );
};

export default AdminDashboard;
