import { useMemo } from "react";
import type { FC } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export type BorrowTrendPoint = {
  month: string;
  borrows: number;
};

type Props = {
  data?: BorrowTrendPoint[];
  title?: string;
};

const fallback: BorrowTrendPoint[] = [
  { month: "Jan", borrows: 120 },
  { month: "Feb", borrows: 180 },
  { month: "Mar", borrows: 160 },
  { month: "Apr", borrows: 220 },
  { month: "May", borrows: 210 },
  { month: "Jun", borrows: 240 },
];

const BorrowTrendChart: FC<Props> = ({ data, title = "Borrowing Trend" }) => {
  const points = useMemo(() => (data && data.length > 0 ? data : fallback), [data]);

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-4 shadow-sm backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <span className="text-xs text-gray-500">Monthly</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "#1f2937" }} />
            <Line type="monotone" dataKey="borrows" stroke="#fbbf24" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BorrowTrendChart;
