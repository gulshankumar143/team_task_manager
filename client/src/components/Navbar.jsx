import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const auth = useAuth(); // safer
  const user = auth?.user;
  const logout = auth?.logout;

  const navigate = useNavigate();

  const handleLogout = () => {
    logout && logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow mb-6">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <Link to="/" className="font-bold text-xl text-indigo-600">
            Team Task Manager
          </Link>
          {user && (
            <>
              <Link to="/" className="text-gray-600 hover:text-indigo-600">
                Dashboard
              </Link>
              <Link to="/projects" className="text-gray-600 hover:text-indigo-600">
                Projects
              </Link>
              <Link to="/tasks" className="text-gray-600 hover:text-indigo-600">
                Tasks
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-700">
                {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-indigo-600 hover:underline">
                Login
              </Link>
              <Link to="/signup" className="text-indigo-600 hover:underline">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}