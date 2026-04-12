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
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AlertsPanel from "./components/Alerts/AlertsPanel";


import Layout from "./components/layout"; 

import "./index.css";

const isLoggedIn = () => {
  return !!localStorage.getItem("invq_token");
};


const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  if (!isLoggedIn()) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return children;
};

const App = () => {

  const handleStoreSelection = (type) => {
    console.log("Template selected in Main:", type);
    localStorage.setItem("invq_store_type", type);
    window.location.href = "/dashboard";
  };

  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

       
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Layout><CreateProduct /></Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout><Settings /></Layout>
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/create-store"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateStore onCreateStore={handleStoreSelection} />
              </Layout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Layout><AlertsPanel /></Layout>
            </ProtectedRoute>
          }
        />

        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
