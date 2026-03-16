import { useEffect, useMemo, useState } from "react";
import StatsCards from "../../components/analytics/StatsCards";
import BorrowTrendChart from "../../components/analytics/BorrowTrendChart";
import TopBooksChart from "../../components/analytics/TopBooksChart";
import BookAvailabilityChart from "../../components/analytics/BookAvailabilityChart";
import RecentActivity from "../../components/analytics/RecentActivity";
import OverdueBooksTable from "../../components/analytics/OverdueBooksTable";
import api from "../../services/api";
import type { StatCard } from "../../components/analytics/StatsCards";

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AdminAnalyticsPayload | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.get<AdminAnalyticsPayload>("/admin/analytics/summary");
      setAnalytics(data);
    } catch (err) {
      setError("Unable to load analytics");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const cards = useMemo<StatCard[]>(() => {
    const m = analytics?.metrics;
    if (!m) return [];
    return [
      { title: "Total Books", value: m.totalBooks },
      { title: "Available Copies", value: m.availableCopies },
      { title: "Active Borrowed", value: m.activeBorrowed, change: `Overdue: ${m.overdueBorrowed}` },
      { title: "Users", value: m.totalStudents + m.totalStaff, change: `${m.totalStudents} students` },
    ];
  }, [analytics]);

  const availability = useMemo(() => {
    const m = analytics?.metrics;
    if (!m) return [] as { name: string; value: number }[];
    const issued = Math.max(m.activeBorrowed, 0);
    const available = Math.max(m.availableCopies, 0);
    const reserved = Math.max(m.pendingReservations + m.approvedReservations - m.activeBorrowed, 0);
    return [
      { name: "Available", value: available },
      { name: "Issued", value: issued },
      { name: "Reserved", value: reserved },
    ];
  }, [analytics]);

  const borrowTrend = useMemo(() => analytics?.borrowTrend || [], [analytics]);
  const topBooks = useMemo(() => analytics?.topBooks || [], [analytics]);
  const overdueRows = useMemo(() => analytics?.overdue || [], [analytics]);
  const activityItems = useMemo(
    () => (analytics?.activity || []).map((a) => ({ time: a.time ?? "just now", message: a.message ?? "", type: "user" as const })),
    [analytics]
  );

  return (
    <div className="dashboard-container space-y-6">
      <div className="dashboard-header">
        <h1>Analytics</h1>
        <p>Live charts and snapshots for the library</p>
      </div>

      {error && <p className="error-text">{error}</p>}

      {cards.length > 0 && <StatsCards items={cards} />}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BorrowTrendChart data={borrowTrend} />
        </div>
        <TopBooksChart data={topBooks} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <BookAvailabilityChart data={availability} />
        <RecentActivity items={activityItems} />
        <OverdueBooksTable rows={overdueRows} />
      </div>

      {loading && <p className="muted">Loading analytics...</p>}
    </div>
  );
};

export type AdminAnalyticsPayload = {
  metrics: {
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
  topBooks: { title: string; borrows: number }[];
  borrowTrend: { month: string; borrows: number }[];
  overdue: { title: string; borrower: string; dueDate: string; daysOverdue: number; fineDue: number }[];
  activity: { message?: string; time?: string }[];
};

export default AdminAnalytics;
