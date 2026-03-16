import axios from "axios";
import React, { useState } from "react";

const ManageUsers = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("librarian");

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://e2e-backend-1zjm.onrender.com/add-user",
        {
        token,
        email,
        password,
        role,
        }
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://e2e-backend-1zjm.onrender.com/approve-user",
        {
        token,
        userId,
        }
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://e2e-backend-1zjm.onrender.com/reject-user",
        {
        token,
        userId,
        }
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div>
      <h1>Manage Users</h1>
      <div>
        <h2>Add User</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="librarian">Librarian</option>
          <option value="student">Student</option>
        </select>
        <button onClick={handleAddUser}>Add User</button>
      </div>
      <div>
        <h2>Pending Users</h2>
        {/* Replace with dynamic user list */}
        <div>
          <p>User ID: User_2</p>
          <button onClick={() => handleApproveUser("User_2")}>Approve</button>
          <button onClick={() => handleRejectUser("User_2")}>Reject</button>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;