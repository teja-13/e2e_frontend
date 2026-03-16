import { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";

type Borrowed = {
  book?: { title?: string };
  fineDue?: number;
  dueDate?: string;
};

const Fines = () => {
  const [items, setItems] = useState<Borrowed[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get<Borrowed[]>("/student/borrowed");
      setItems(data);
    } catch (err) {
      setError("Unable to load fines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const totalFine = useMemo(
    () => items.filter((i) => (i.fineDue || 0) > 0).reduce((sum, item) => sum + (item.fineDue || 0), 0),
    [items]
  );

  const overdue = items.filter((i) => (i.fineDue || 0) > 0);

  return (
    <div className="fines-settings-content">
      <div className="fines-header">
        <h1>Overdue Fines</h1>
      </div>

      {error && <p className="error-text">{error}</p>}

      {loading && <p className="muted">Loading...</p>}

      <div>
        {!loading && overdue.length === 0 && <p className="muted">No overdue books right now.</p>}
        {overdue.map((item, idx) => (
          <div key={idx} className="fine-detail">
            <h3>{item.book?.title || "Book"}</h3>
            <p>Fine Amount: ₹{(item.fineDue || 0).toFixed(2)}</p>
            {item.dueDate && (
              <p className="muted">Due: {new Date(item.dueDate).toLocaleDateString()}</p>
            )}
          </div>
        ))}
      </div>

      <div className="total-fine-box">
        <h2>Total Outstanding Fine</h2>
        <div className="amount">₹{totalFine.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default Fines;