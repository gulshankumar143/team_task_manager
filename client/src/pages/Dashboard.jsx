import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChartBarIcon, ClockIcon, UsersIcon } from "@heroicons/react/24/outline";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const statColors = {
  total: "bg-slate-50 border-slate-200 text-slate-900",
  todo: "bg-indigo-50 border-indigo-200 text-indigo-700",
  inProgress: "bg-yellow-50 border-yellow-200 text-yellow-700",
  done: "bg-emerald-50 border-emerald-200 text-emerald-700",
};

export default function Dashboard() {
  const { user } = useAuth() || {};
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/tasks/dashboard/summary");
        setStats(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="mt-12 px-4 text-center text-slate-600">Loading dashboard…</div>;
  if (error) return <div className="mt-12 px-4 text-center text-red-600">{error}</div>;
  if (!stats) return <div className="mt-12 px-4 text-center text-slate-600">No data available.</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 pb-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Productivity</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">Overview of your active projects and task progress.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/projects"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Manage Projects
          </Link>
          <Link
            to="/tasks"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            View Tasks
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className={`rounded-3xl border p-6 shadow-sm ${statColors.total}`}>
          <div className="flex items-center gap-3 text-slate-700">
            <ChartBarIcon className="h-6 w-6" />
            <div className="text-sm font-semibold">Total Tasks</div>
          </div>
          <div className="mt-6 text-4xl font-semibold">{stats.totalTasks}</div>
        </div>

        {stats.groupByStatus?.map((item) => {
          const key = item._id === "To Do" ? "todo" : item._id === "In Progress" ? "inProgress" : "done";
          return (
            <div key={item._id} className={`rounded-3xl border p-6 shadow-sm ${statColors[key]}`}>
              <div className="flex items-center gap-3 text-slate-700">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/80 text-sm font-semibold text-slate-900 shadow-sm">
                  {item._id.charAt(0)}
                </span>
                <div className="text-sm font-semibold">{item._id}</div>
              </div>
              <div className="mt-6 text-3xl font-semibold">{item.count}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Tasks per User</p>
              <p className="mt-1 text-sm text-slate-500">Breakdown of team workload.</p>
            </div>
            <UsersIcon className="h-6 w-6 text-slate-400" />
          </div>

          <div className="mt-5 space-y-3">
            {stats.tasksPerUser?.length ? (
              stats.tasksPerUser.map((userItem) => (
                <div key={userItem.userId} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <div className="font-medium text-slate-900">{userItem.name}</div>
                    <span className="text-slate-500">{userItem.count} tasks</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{userItem.email}</div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">No assigned tasks yet.</div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Overdue Tasks</p>
              <p className="mt-1 text-sm text-slate-500">Items that need immediate attention.</p>
            </div>
            <ClockIcon className="h-6 w-6 text-slate-400" />
          </div>

          <div className="mt-5 space-y-3">
            {stats.overdueTasks?.length ? (
              stats.overdueTasks.map((task) => (
                <div key={task._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-900">
                    <span>{task.title}</span>
                    <span className="text-emerald-700">Due {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-sm text-slate-500 text-center">
                No overdue tasks — great work! 🎉
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}