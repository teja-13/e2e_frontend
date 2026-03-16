import axios from "axios";
import React, { useState } from "react";
import ShaderBackground from "../../components/ui/shader-background";

const StudentSignupRequest = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        "https://e2e-backend-1zjm.onrender.com/signup",
        {
        email,
        password,
        role: "student",
        }
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div>
      <ShaderBackground />
      <h1>Student Signup</h1>
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
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default StudentSignupRequest;