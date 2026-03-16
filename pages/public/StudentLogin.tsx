import React from "react";
import axios from "axios";
import ShaderBackground from "../../components/ui/shader-background";

const StudentLogin = () => {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const email = "teja@gmail.com"; // Replace with actual input value
      const password = "12345678"; // Replace with actual input value

      const response = await axios.post(
        "https://e2e-backend-1zjm.onrender.com/login",
        {
        email,
        password,
        }
      );

      localStorage.setItem("token", response.data.token);
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <>
      <ShaderBackground />
      <div className="relative w-full h-screen">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-50 p-8 rounded-lg shadow-lg w-96">
          <h1 className="text-2xl font-bold mb-4 text-center">Student Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default StudentLogin;