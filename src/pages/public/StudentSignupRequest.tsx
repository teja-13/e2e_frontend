import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const StudentSignupRequest = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "pending" | "success">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setStatus("pending");

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      await api.post("/student/signup", payload);
      setStatus("success");
      setTimeout(() => navigate("/"), 800);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Unable to submit request";
      setError(message);
      setStatus("idle");
    }
  };

  return (
    <main className="auth-container">
      <div className="auth-card">
        <h2>Student Sign-Up Request</h2>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input name="name" type="text" placeholder="Name" required />
          <input name="rollNumber" type="text" placeholder="Roll Number" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="branch" type="text" placeholder="Branch" />
          <input name="section" type="text" placeholder="Section" />
          <input name="password" type="password" placeholder="Password" required />
          <input
            name="confirm"
            type="password"
            placeholder="Re-enter Password"
            required
          />

          <button type="submit" disabled={status === "pending"}>
            {status === "pending" ? "Submitting..." : "Submit Request"}
          </button>
        </form>

        {status === "pending" && (
          <p className="switch-text">
            Status: <span>Pending Approval</span>
          </p>
        )}

        {status === "success" && (
          <p className="switch-text">
            Status: <span>Submitted. Redirecting to login...</span>
          </p>
        )}
      </div>
    </main>
  );
};

export default StudentSignupRequest;