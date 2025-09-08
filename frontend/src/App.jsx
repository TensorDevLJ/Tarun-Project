import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Website from "./pages/Website.jsx";
import RegisterForm from "./pages/RegisterForm.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import Header from "./components/Header.jsx";
import axios from "axios";

// Backend URL from environment
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

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

  useEffect(() => {
    // Initialize app
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<><Header /><Website users={users} /></>} />
        <Route
          path="/course-registration"
          element={<><Header /><RegisterForm API_URL={API_URL} /></>}
        />
        <Route
          path="/admin"
          element={<AdminPanel />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
