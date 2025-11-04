// App.tsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";

import AIQuery from "./pages/AiQuery";
import DataManagement from "./pages/DataManagemet";
import Login from "./pages/Login";

interface User {
  email: string;
  name: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (email: string, password: string) => {
    setLoading(true);

    // Simulate API call - replace with real authentication
    setTimeout(() => {
      // Demo authentication - in real app, verify with backend
      if (email === "admin@gmail.com" && password === "admin") {
        const userData = { email, name: "Admin User" };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        alert("Invalid credentials. Use admin@example.com / password");
      }
      setLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} loading={loading} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route path="/ai-query" element={<AIQuery />} />
            <Route path="/data" element={<DataManagement />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
