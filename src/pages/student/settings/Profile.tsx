import { useEffect, useState } from "react";
import api from "../../../services/api";

type StudentProfile = {
  name?: string;
  email?: string;
  studentId?: string;
  rollNumber?: string;
  branch?: string;
  section?: string;
};

const Profile = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loadProfile = async () => {
    setLoading(true);
    setError("");
    try {
      // reuse student borrowed endpoint auth to fetch student doc
      const { data } = await api.get<StudentProfile>("/student/me");
      setProfile(data);
    } catch (err) {
      setError("Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const submitPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwdError("Please fill all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError("New passwords do not match");
      return;
    }
    try {
      setPwdLoading(true);
      await api.put("/student/password", { currentPassword, newPassword });
      setPwdSuccess("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordModal(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Unable to update password";
      setPwdError(msg);
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="profile-settings-content">
      <div className="profile-header">
        <h1>Profile Settings</h1>
      </div>

      {error && <p className="error-text">{error}</p>}
      {loading && <p className="muted">Loading...</p>}

      {profile && (
        <div className="profile-card" style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div className="profile-field">
            <p className="muted" style={{ margin: 0 }}>Name</p>
            <h3 style={{ margin: "4px 0 0 0" }}>{profile.name || "-"}</h3>
          </div>
          <div className="profile-field">
            <p className="muted" style={{ margin: 0 }}>Email</p>
            <h3 style={{ margin: "4px 0 0 0" }}>{profile.email || "-"}</h3>
          </div>
          <div className="profile-field">
            <p className="muted" style={{ margin: 0 }}>Student ID</p>
            <h3 style={{ margin: "4px 0 0 0" }}>{profile.studentId || profile.rollNumber || "-"}</h3>
          </div>
          <div className="profile-field">
            <p className="muted" style={{ margin: 0 }}>Branch</p>
            <h3 style={{ margin: "4px 0 0 0" }}>{profile.branch || "-"}</h3>
          </div>
          <div className="profile-field">
            <p className="muted" style={{ margin: 0 }}>Section</p>
            <h3 style={{ margin: "4px 0 0 0" }}>{profile.section || "-"}</h3>
          </div>
        </div>
      )}

      <div className="form-button-group" style={{ marginTop: "16px" }}>
        <button type="button" className="btn-primary" onClick={() => setShowPasswordModal(true)}>
          Change Password
        </button>
      </div>

      {showPasswordModal && (
        <div className="modal-backdrop" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Password</h2>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>×</button>
            </div>
            <form className="profile-form" onSubmit={submitPasswordChange}>
              {pwdError && <p className="error-text">{pwdError}</p>}
              {pwdSuccess && <p className="success-text">{pwdSuccess}</p>}

              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-button-group">
                <button type="button" className="btn-secondary" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={pwdLoading}>
                  {pwdLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;