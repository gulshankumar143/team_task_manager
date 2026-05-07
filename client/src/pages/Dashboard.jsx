import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth() || {}; // safe fallback

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

  if (loading) return <div className="mt-8 text-center">Loading...</div>;
  if (error) return <div className="mt-8 text-center text-red-600">{error}</div>;
  if (!stats) return <div className="mt-8 text-center">No data available</div>;

  return (
    <div className="max-w-3xl mx-auto mt-8 text-black">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow">
          <div className="text-gray-500">Total Tasks</div>
          <div className="text-3xl font-bold">{stats.totalTasks}</div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <div className="text-gray-500 mb-2">Tasks by Status</div>
          {stats.groupByStatus?.map((g) => (
            <div key={g._id} className="flex justify-between">
              <span>{g._id}</span>
              <span className="font-semibold">{g.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Admin section */}
      {user?.role === "Admin" && (
        <div className="bg-white p-6 rounded shadow mb-8">
          <div className="text-gray-500 mb-2">Tasks per User</div>

          {stats.tasksPerUser?.length === 0 && <div>No tasks assigned yet.</div>}

          {stats.tasksPerUser?.map((u) => (
            <div key={u.userId} className="flex justify-between">
              <span>
                {u.name} ({u.email})
              </span>
              <span className="font-semibold">{u.count}</span>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white p-6 rounded shadow">
        <div className="text-gray-500 mb-2">Overdue Tasks</div>

        {stats.overdueTasks?.length === 0 && <div>None 🎉</div>}

        {stats.overdueTasks?.map((t) => (
          <div key={t._id} className="mb-2">
            <span className="font-semibold">{t.title}</span> (Due:{" "}
            {new Date(t.dueDate).toLocaleDateString()})
          </div>
        ))}
      </div>
    </div>
  );
}