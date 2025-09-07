import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Website from "./pages/Website.jsx";
import RegisterForm from "./pages/RegisterForm.jsx";
import Header from "./components/Header.jsx";
import axios from "axios";

// Backend URL from environment
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// 404 Not Found Component
const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-screen text-center">
    <h1 className="text-6xl font-bold text-[#004080] mb-4">404</h1>
    <p className="text-xl mb-6">Oops! Page not found.</p>
    <a
      href="/"
      className="px-6 py-3 bg-[#004080] text-white rounded hover:bg-[#00264d] transition-all"
    >
      Go Back Home
    </a>
  </div>
);

const App = () => {
  const [users, setUsers] = useState([]);

  // Example: fetch registered users from backend on app load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/register`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Website users={users} />} />
        <Route
          path="/course-registration"
          element={<RegisterForm API_URL={API_URL} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
