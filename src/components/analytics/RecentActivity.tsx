import { useMemo } from "react";
import type { FC } from "react";

export type ActivityItem = {
  time: string;
  message: string;
  type?: "borrow" | "return" | "fine" | "user";
};

type Props = {
  items?: ActivityItem[];
  title?: string;
};

const fallback: ActivityItem[] = [
  { time: "2m ago", message: "N. Verma paid fine for 'Design Systems'", type: "fine" },
  { time: "15m ago", message: "A. Sharma borrowed 'Clean Code'", type: "borrow" },
  { time: "1h ago", message: "Reservation approved for 'Pragmatic Programmer'", type: "borrow" },
  { time: "3h ago", message: "R. Patel returned 'Algorithms'", type: "return" },
];

const badgeByType: Record<string, string> = {
  borrow: "bg-emerald-500/20 text-emerald-300",
  return: "bg-sky-500/20 text-sky-300",
  fine: "bg-amber-500/20 text-amber-300",
  user: "bg-fuchsia-500/20 text-fuchsia-300",
};

const RecentActivity: FC<Props> = ({ items, title = "Recent Activity" }) => {
  const data = useMemo(() => (items && items.length > 0 ? items : fallback), [items]);

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-4 shadow-sm backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <span className="text-xs text-gray-500">Live feed</span>
      </div>
      <div className="space-y-3">
        {data.map((item, idx) => (
          <div key={`${item.message}-${idx}`} className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-amber-300" />
            <div className="flex-1">
              <p className="text-sm text-white">{item.message}</p>
              <p className="text-xs text-gray-500">{item.time}</p>
            </div>
            {item.type && (
              <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${badgeByType[item.type] || "bg-gray-700 text-gray-300"}`}>
                {item.type}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
