import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

type Book = {
  title: string;
  author: string;
};

type Reservation = {
  _id: string;
  status: string;
  book?: Book;
  createdAt: string;
};

const MyBooks = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReservations = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get<Reservation[]>("/student/reservations");
      const filtered = data.filter((r) => r.status !== "returned");
      setReservations(filtered);
    } catch (err) {
      setError("Unable to load your books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div className="my-books-container">
      <button onClick={() => navigate(-1)} className="back-button">←</button>
      <div className="my-books-header">
        <h1>My Books</h1>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="books-borrowed-list">
        {loading && <p className="muted">Loading...</p>}

        {!loading && reservations.length === 0 && (
          <p className="muted">No reservations yet.</p>
        )}

        {reservations.map((reservation) => (
          <div key={reservation._id} className="book-card">
            <h3>{reservation.book?.title || "Book"}</h3>
            {reservation.book?.author && (
              <p className="muted">{reservation.book.author}</p>
            )}
            <p className="fine">Status: {reservation.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBooks;