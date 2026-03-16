const ChangePassword = () => {
  return (
    <div className="change-password-form">
      <h2>Change Password</h2>

      <form className="profile-form">
        <div className="form-group">
          <label>Current Password</label>
          <input type="password" placeholder="Enter current password" />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input type="password" placeholder="Enter new password" />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input type="password" placeholder="Confirm new password" />
        </div>

        <div className="form-button-group">
          <button type="button" className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
