import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";

const statusStyles = {
  "To Do": "bg-slate-100 text-slate-900",
  "In Progress": "bg-yellow-100 text-yellow-900",
  Done: "bg-emerald-100 text-emerald-900",
};

const priorityStyles = {
  Low: "bg-emerald-100 text-emerald-800",
  Medium: "bg-indigo-100 text-indigo-800",
  High: "bg-rose-100 text-rose-800",
};

const nextStatusMap = {
  "To Do": ["In Progress"],
  "In Progress": ["Done"],
  Done: []
};

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/tasks/${id}`);
        setTask(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load task.");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleStatusChange = async (status) => {
    setError("");
    try {
      const res = await API.patch(`/tasks/${id}/status`, { status });
      setTask(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const canUpdate = task && (user?.role === "Admin" || task.assignedTo?._id === user?._id || task.assignedTo === user?._id);
  const availableStatuses = task
    ? user?.role === "Admin"
      ? ["To Do", "In Progress", "Done"].filter((status) => status !== task.status)
      : nextStatusMap[task.status || "To Do"]
    : [];

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 pb-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <ArrowLeftCircleIcon className="h-4 w-4" />
        Back to tasks
      </button>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Task Detail</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">{task?.title || "Loading..."}</h1>
          </div>
          {task && (
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex rounded-full px-3 py-2 text-sm font-semibold ${statusStyles[task.status || "To Do"]}`}>
                {task.status}
              </span>
              <span className={`inline-flex rounded-full px-3 py-2 text-sm font-semibold ${priorityStyles[task.priority || "Medium"]}`}>
                {task.priority || "Medium"}
              </span>
            </div>
          )}
        </div>

        {error && <div className="mb-6 rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">{error}</div>}

        {loading ? (
          <div className="h-56 rounded-3xl bg-slate-100" />
        ) : !task ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">Task not found.</div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Description</p>
                <p className="mt-4 text-sm leading-7 text-slate-700">{task.description || "No description added."}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Project</p>
                  <p className="mt-3 text-sm font-semibold text-slate-900">{task.project?.name || "Unknown project"}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Assigned to</p>
                  <p className="mt-3 text-sm font-semibold text-slate-900">{task.assignedTo?.name || task.assignedTo || "Unassigned"}</p>
                  <p className="mt-1 text-sm text-slate-500">{task.assignedTo?.email || ""}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Due date</p>
                <p className="mt-3 text-sm font-semibold text-slate-900">{new Date(task.dueDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-900">Status actions</p>
              <p className="mt-2 text-sm text-slate-500">Only Admin or the assigned user can change status.</p>

              {canUpdate ? (
                availableStatuses.length ? (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {availableStatuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className="rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Set {status}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 rounded-3xl bg-white px-4 py-3 text-sm text-slate-500">No further updates available.</div>
                )
              ) : (
                <div className="mt-6 rounded-3xl bg-white px-4 py-3 text-sm text-slate-500">You do not have permission to update this task.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
