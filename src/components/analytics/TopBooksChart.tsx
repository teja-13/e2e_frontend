import { useMemo } from "react";
import type { FC } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export type TopBook = {
  title: string;
  borrows: number;
};

type Props = {
  data?: TopBook[];
  title?: string;
};

const fallback: TopBook[] = [
  { title: "Design Systems", borrows: 42 },
  { title: "Clean Code", borrows: 38 },
  { title: "Pragmatic Programmer", borrows: 31 },
  { title: "Algorithms", borrows: 27 },
  { title: "Data Science 101", borrows: 22 },
];

const TopBooksChart: FC<Props> = ({ data, title = "Most Borrowed Books" }) => {
  const rows = useMemo(() => (data && data.length > 0 ? data : fallback), [data]);

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-4 shadow-sm backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <span className="text-xs text-gray-500">Top 5</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="title" stroke="#9ca3af" tick={{ fontSize: 12 }} interval={0} height={60} angle={-20} textAnchor="end" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "#1f2937" }} />
            <Bar dataKey="borrows" fill="#fbbf24" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopBooksChart;
