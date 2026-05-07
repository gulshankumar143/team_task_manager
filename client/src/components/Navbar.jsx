import { NavLink, useNavigate } from "react-router-dom";
import { HomeIcon, Squares2X2Icon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", to: "/", icon: HomeIcon },
  { label: "Projects", to: "/projects", icon: Squares2X2Icon },
  { label: "Tasks", to: "/tasks", icon: ClipboardDocumentListIcon },
];

export default function Navbar() {
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;
  const navigate = useNavigate();
  const initials = user?.name?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "TM";

  const handleLogout = () => {
    logout && logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
              TM
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-slate-900">Team Task Manager</p>
              <p className="text-sm text-slate-500">Project & task workspace</p>
            </div>
          </div>

          {user && (
            <div className="flex flex-wrap items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 justify-end">
          {user ? (
            <>
              <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white shadow-sm">
                  {initials}
                </div>
                <div className="text-sm">
                  <div className="font-medium text-slate-900">{user.name}</div>
                  <div className="text-slate-500">{user.role}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink to="/login" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Signup
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}