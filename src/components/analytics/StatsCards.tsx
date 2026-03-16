import { useMemo } from "react";
import type { FC } from "react";

type StatCard = {
  title: string;
  value: string | number;
  change?: string;
  helper?: string;
};

type Props = {
  items?: StatCard[];
};

const fallback: StatCard[] = [
  { title: "Total Books", value: 1280, change: "+4% vs last month" },
  { title: "Books Issued", value: 342, change: "+12%" },
  { title: "Overdue", value: 24, change: "-3%" },
  { title: "Active Students", value: 860, change: "+2%" },
];

const StatCardItem: FC<StatCard> = ({ title, value, change, helper }) => (
  <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-4 shadow-sm backdrop-blur">
    <p className="text-sm text-gray-400">{title}</p>
    <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    {change && <p className="text-sm text-emerald-400">{change}</p>}
    {helper && <p className="text-xs text-gray-500">{helper}</p>}
  </div>
);

const StatsCards: FC<Props> = ({ items }) => {
  const data = useMemo(() => items && items.length > 0 ? items : fallback, [items]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {data.map((item) => (
        <StatCardItem key={item.title} {...item} />
      ))}
    </div>
  );
};

export type { StatCard };
export default StatsCards;
