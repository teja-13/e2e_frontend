import { useMemo } from "react";
import type { FC } from "react";

export type OverdueRow = {
  title: string;
  borrower: string;
  dueDate: string;
  daysOverdue: number;
  fineDue: number;
};

type Props = {
  rows?: OverdueRow[];
  title?: string;
};

const fallback: OverdueRow[] = [
  { title: "Clean Code", borrower: "A. Sharma", dueDate: "2026-03-02", daysOverdue: 5, fineDue: 75 },
  { title: "Design Systems", borrower: "N. Verma", dueDate: "2026-02-28", daysOverdue: 9, fineDue: 120 },
  { title: "Pragmatic Programmer", borrower: "R. Patel", dueDate: "2026-03-05", daysOverdue: 2, fineDue: 30 },
];

const OverdueBooksTable: FC<Props> = ({ rows, title = "Overdue Books" }) => {
  const data = useMemo(() => (rows && rows.length > 0 ? rows : fallback), [rows]);

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-4 shadow-sm backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <span className="text-xs text-gray-500">Top items</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-300">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Borrower</th>
              <th className="py-2 pr-4">Due</th>
              <th className="py-2 pr-4">Days Overdue</th>
              <th className="py-2 pr-4">Fine</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {data.map((row) => (
              <tr key={`${row.title}-${row.borrower}`}>
                <td className="py-2 pr-4 font-medium text-white">{row.title}</td>
                <td className="py-2 pr-4">{row.borrower}</td>
                <td className="py-2 pr-4">{row.dueDate}</td>
                <td className="py-2 pr-4">{row.daysOverdue}</td>
                <td className="py-2 pr-4 text-amber-300">₹{row.fineDue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OverdueBooksTable;
