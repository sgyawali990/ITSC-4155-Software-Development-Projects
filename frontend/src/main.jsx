import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Login from "./pages/Login";
import RegisterUser from "./pages/RegisterUser";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import CreateProduct from "./pages/CreateProduct";
import CreateStore from "./pages/CreateStore";

import "./index.css";

// A utility to check if a user is authenticated
const isLoggedIn = () => {
  const token = localStorage.getItem("invq_token");
  return !!token;
};

// ProtectedRoute redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  if (!isLoggedIn()) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return children;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<RegisterUser />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-product"
        element={
          <ProtectedRoute>
            <CreateProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-store"
        element={
          <ProtectedRoute>
            <CreateStore />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);