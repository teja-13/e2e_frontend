import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

type Book = {
  _id: string;
  title: string;
  author: string;
  category?: string;
  copiesAvailable: number;
};

const BookSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [actionBookId, setActionBookId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Book[]>([]);
  const [suggestTimer, setSuggestTimer] = useState<number | undefined>(undefined);

  const fetchBooks = async (q?: string) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const searchTerm = q ?? query;
      const { data } = await api.get("/books", {
        params: { q: searchTerm },
      });
      setBooks(data);
    } catch (err) {
      setError("Unable to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks();
  };

  const loadSuggestions = async (text: string) => {
    if (!text || text.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setSuggestLoading(true);
    try {
      const { data } = await api.get("/books", { params: { q: text.trim(), limit: 5 } });
      setSuggestions(data.slice(0, 5));
    } catch (err) {
      setSuggestions([]);
    } finally {
      setSuggestLoading(false);
    }
  };

  const onQueryChange = (value: string) => {
    setQuery(value);
    if (suggestTimer) {
      clearTimeout(suggestTimer);
    }
    const timerId = window.setTimeout(() => loadSuggestions(value), 300);
    setSuggestTimer(timerId);
  };

  const selectSuggestion = (text: string) => {
    setQuery(text);
    setSuggestions([]);
    fetchBooks(text);
  };

  const requestBook = async (bookId: string) => {
    setActionBookId(bookId);
    setError("");
    setMessage("");

    try {
      const { data } = await api.post(
        `/student/books/${bookId}/request`
      );
      setMessage(data?.message || "Request submitted. Awaiting approval.");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Unable to request book";
      setError(msg);
    } finally {
      setActionBookId(null);
    }
  };

  return (
    <div className="book-search-container">
      <button onClick={() => navigate(-1)} className="back-button">←</button>
      <div className="search-header">
        <h1>Search Books</h1>
      </div>

      <form className="search-input-wrapper" onSubmit={handleSearch}>
        <div style={{ position: "relative", width: "100%" }}>
          <input
            placeholder="Search by title, author, category, or ISBN"
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "var(--black-secondary)",
                border: "1px solid var(--border-gold)",
                borderRadius: "8px",
                marginTop: "4px",
                zIndex: 5,
                maxHeight: "220px",
                overflowY: "auto",
              }}
            >
              {suggestions.map((item) => (
                <div
                  key={item._id}
                  style={{
                    padding: "10px 12px",
                    cursor: "pointer",
                    borderBottom: "1px solid var(--black-main)",
                  }}
                  onClick={() => selectSuggestion(item.title)}
                >
                  <div style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                    {item.title}
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    {item.author}
                  </div>
                </div>
              ))}
              {suggestLoading && (
                <div style={{ padding: "10px 12px", color: "var(--text-muted)" }}>Searching...</div>
              )}
            </div>
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}

      <div className="books-list">
        {!loading && books.length === 0 && (
          <p className="muted">No books found.</p>
        )}

        {books.map((book) => (
          <div key={book._id} className="book-item">
            <div className="book-info">
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              {book.category && <p className="muted">{book.category}</p>}
              <p>Available: {book.copiesAvailable} copies</p>
            </div>
            <button
              onClick={() => requestBook(book._id)}
              disabled={actionBookId === book._id || book.copiesAvailable === 0}
            >
              {actionBookId === book._id
                ? "Requesting..."
                : book.copiesAvailable === 0
                ? "Out of stock"
                : "Request"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookSearch;