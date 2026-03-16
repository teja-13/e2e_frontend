import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

type Book = {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  copiesAvailable: number;
  finePerWeek?: number;
};

const ManageBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get<Book[]>("/books");
      setBooks(data);
    } catch (err) {
      setError("Unable to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  return (
    <div className="book-search-container">
      <button className="back-button" onClick={() => navigate(-1)}>←</button>

      <div className="search-header">
        <h1>Manage Books</h1>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", color: "var(--text-primary)" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--black-secondary)", borderBottom: "1px solid var(--border-gold)" }}>
              <th style={{ padding: "12px", textAlign: "left", color: "var(--gold-main)" }}>Title</th>
              <th style={{ padding: "12px", textAlign: "left", color: "var(--gold-main)" }}>Author</th>
              <th style={{ padding: "12px", textAlign: "left", color: "var(--gold-main)" }}>ISBN</th>
              <th style={{ padding: "12px", textAlign: "left", color: "var(--gold-main)" }}>Copies</th>
              <th style={{ padding: "12px", textAlign: "left", color: "var(--gold-main)" }}>Cost</th>
              <th style={{ padding: "12px", textAlign: "left", color: "var(--gold-main)" }}>Fine/Week</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} style={{ padding: "12px" }}>Loading...</td>
              </tr>
            )}
            {!loading && books.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "12px" }}>No books found.</td>
              </tr>
            )}
            {books.map((book) => (
              <tr key={book._id} style={{ borderBottom: "1px solid var(--border-gold)" }}>
                <td style={{ padding: "12px" }}>{book.title}</td>
                <td style={{ padding: "12px" }}>{book.author}</td>
                <td style={{ padding: "12px" }}>{book.isbn}</td>
                <td style={{ padding: "12px" }}>{book.copiesAvailable}</td>
                <td style={{ padding: "12px" }}>₹{(book as any).price ?? 0}</td>
                <td style={{ padding: "12px" }}>{book.finePerWeek ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBooks;
