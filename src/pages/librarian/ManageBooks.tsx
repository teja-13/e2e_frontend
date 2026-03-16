import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

type Book = {
  _id: string;
  title: string;
  author: string;
  copiesAvailable: number;
  isbn?: string;
  finePerWeek?: number;
};

const ManageBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    publisher: "",
    publishedYear: "",
    language: "English",
    pages: "",
    price: "",
    finePerWeek: "",
    copiesAvailable: "1",
  });

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...form,
      publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined,
      pages: form.pages ? Number(form.pages) : undefined,
      price: form.price ? Number(form.price) : undefined,
      finePerWeek: form.finePerWeek ? Number(form.finePerWeek) : undefined,
      copiesAvailable: form.copiesAvailable ? Number(form.copiesAvailable) : undefined,
    } as Record<string, any>;

    try {
      const { data } = await api.post<Book>("/librarian/books", payload);
      setBooks((prev) => [data, ...prev]);
      setForm({
        title: "",
        author: "",
        category: "",
        isbn: "",
        publisher: "",
        publishedYear: "",
        language: "English",
        pages: "",
        price: "",
        finePerWeek: "",
        copiesAvailable: "1",
      });
    } catch (err: any) {
      const message = err?.response?.data?.message || "Unable to add book";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="book-search-container">
      <button className="back-button" onClick={() => navigate(-1)}>←</button>
      
      <div className="search-header">
        <h1>Manage Books</h1>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
        <button onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Close" : "Add Book"}
        </button>
      </div>

      {showForm && (
        <div className="settings-section-item" style={{ marginBottom: "20px" }}>
          <h2 style={{ marginTop: 0, color: "var(--gold-main)" }}>Add a new book</h2>
          <form onSubmit={handleAdd} className="profile-form">
            <div className="form-group">
              <label>Title</label>
              <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Author</label>
              <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>ISBN</label>
              <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Publisher</label>
              <input name="publisher" placeholder="Publisher" value={form.publisher} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Published Year</label>
              <input name="publishedYear" type="number" placeholder="YYYY" value={form.publishedYear} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Language</label>
              <input name="language" placeholder="Language" value={form.language} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Pages</label>
              <input name="pages" type="number" placeholder="Pages" value={form.pages} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Fine per week</label>
              <input name="finePerWeek" type="number" step="0.01" placeholder="Fine per week" value={form.finePerWeek} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Copies available</label>
              <input name="copiesAvailable" type="number" placeholder="Copies" value={form.copiesAvailable} onChange={handleChange} required />
            </div>
            <div className="form-button-group">
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setForm({
                  title: "",
                  author: "",
                  category: "",
                  isbn: "",
                  publisher: "",
                  publishedYear: "",
                  language: "English",
                  pages: "",
                  price: "",
                  finePerWeek: "",
                  copiesAvailable: "1",
                })}
              >
                Clear
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Adding..." : "Save Book"}
              </button>
            </div>
          </form>
        </div>
      )}

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
                <td colSpan={6} style={{ padding: "12px" }}>Loading...</td>
              </tr>
            )}
            {!loading && books.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "12px" }}>No books found.</td>
              </tr>
            )}
            {books.map((book) => (
              <tr key={book._id} style={{ borderBottom: "1px solid var(--border-gold)" }}>
                <td style={{ padding: "12px" }}>{book.title}</td>
                <td style={{ padding: "12px" }}>{book.author}</td>
                <td style={{ padding: "12px" }}>{book.isbn || "-"}</td>
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
