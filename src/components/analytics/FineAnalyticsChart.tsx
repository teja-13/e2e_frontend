import { useMemo } from "react";
import type { FC } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export type FineSlice = {
  name: string;
  value: number;
};

type Props = {
  data?: FineSlice[];
  title?: string;
};

const colors = ["#22c55e", "#f97316", "#a855f7", "#38bdf8"];

const fallback: FineSlice[] = [
  { name: "Paid", value: 4200 },
  { name: "Unpaid", value: 1800 },
  { name: "Waived", value: 600 },
];

const FineAnalyticsChart: FC<Props> = ({ data, title = "Fine Analytics" }) => {
  const slices = useMemo(() => (data && data.length > 0 ? data : fallback), [data]);

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-4 shadow-sm backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <span className="text-xs text-gray-500">This month</span>
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

export default FineAnalyticsChart;
