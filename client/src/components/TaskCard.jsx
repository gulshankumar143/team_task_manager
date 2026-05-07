import { ChevronRightIcon } from "@heroicons/react/24/outline";

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

export default function TaskCard({ task, onStatusChange, isAdmin, currentUserId }) {
  const currentStatus = task.status || "To Do";
  const assignedName = task.assignedTo?.name || (typeof task.assignedTo === "string" ? task.assignedTo : "Unassigned");
  const assignedId = task.assignedTo?._id || task.assignedTo;
  const isAssignedUser = assignedId?.toString() === currentUserId?.toString();
  const canUpdate = isAdmin || isAssignedUser;
  const availableStatuses = isAdmin ? Object.keys(statusStyles).filter((status) => status !== currentStatus) : nextStatusMap[currentStatus];

  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{task.project?.name || "General"}</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{task.title}</h3>
          <p className="mt-2 text-sm text-slate-500">{task.description || "No description provided."}</p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[currentStatus]}`}>
            {currentStatus}
          </span>
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[task.priority || "Medium"]}`}>
            {task.priority || "Medium"}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span>Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1">Assigned to: {assignedName}</span>
      </div>

      {onStatusChange && canUpdate && availableStatuses.length > 0 && (
        <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 text-sm font-semibold text-slate-700">Update status</div>
          <div className="flex flex-wrap gap-2">
            {availableStatuses.map((status) => (
              <button
                key={status}
                onClick={() => onStatusChange(task._id, status)}
                className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                Mark as {status}
              </button>
            ))}
          </div>
        </div>
      )}

      {!canUpdate && onStatusChange && (
        <div className="mt-5 rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
          Only the assigned member or Admin can update this task.
        </div>
      )}

      <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
        <span>{task.assignedTo?.email || "Unassigned"}</span>
        <ChevronRightIcon className="h-4 w-4 text-slate-300 transition group-hover:text-slate-500" />
      </div>
    </div>
  );
}
