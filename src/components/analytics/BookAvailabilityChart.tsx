import { useMemo } from "react";
import type { FC } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export type AvailabilitySlice = {
  name: string;
  value: number;
};

type Props = {
  data?: AvailabilitySlice[];
  title?: string;
};

const colors = ["#fbbf24", "#22c55e", "#60a5fa", "#c084fc", "#f87171"];

const fallback: AvailabilitySlice[] = [
  { name: "Available", value: 720 },
  { name: "Issued", value: 280 },
  { name: "Reserved", value: 90 },
];

const BookAvailabilityChart: FC<Props> = ({ data, title = "Book Availability" }) => {
  const slices = useMemo(() => (data && data.length > 0 ? data : fallback), [data]);

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-4 shadow-sm backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <span className="text-xs text-gray-500">Live</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              paddingAngle={4}
              label
            >
              {slices.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "#1f2937" }} />
            <Legend wrapperStyle={{ color: "#9ca3af" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BookAvailabilityChart;
