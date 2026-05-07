import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";

import { AuthProvider, useAuth } from "./context/AuthContext";

// 🔒 Protected Route Wrapper
function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

// Debug component to check if app is loading
function DebugInfo() {
  const auth = useAuth();
  console.log("Auth state:", auth);
  console.log("API URL:", import.meta.env.VITE_API_URL);

  return (
    <div style={{ padding: "20px", background: "#f0f0f0", margin: "20px" }}>
      <h3>Debug Info</h3>
      <p>Token: {auth?.token ? "Present" : "Not present"}</p>
      <p>User: {auth?.user ? auth.user.name : "No user"}</p>
      <p>API URL: {import.meta.env.VITE_API_URL}</p>
    </div>
  );
}

export default function App() {
  console.log("App component rendering");
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <DebugInfo />

        <div className="container mx-auto px-4 py-4">
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/projects"
              element={
                <PrivateRoute>
                  <Projects />
                </PrivateRoute>
              }
            />

            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <Tasks />
                </PrivateRoute>
              }
            />

            {/*FIXED fallback */}
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}