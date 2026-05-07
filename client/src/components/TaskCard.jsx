export default function TaskCard({ task, onStatusChange, isAdmin }) {
  const statusColors = {
    'To Do': 'bg-gray-200',
    'In Progress': 'bg-yellow-200',
    'Done': 'bg-green-200',
  };
  const currentStatus = task.status || 'To Do';
  const assignedName = task.assignedTo?.name || (typeof task.assignedTo === 'string' ? task.assignedTo : 'Unassigned');

  return (
    <div className="p-4 rounded shadow bg-white mb-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">{task.title}</h3>
        <span className={`px-2 py-1 rounded text-xs ${statusColors[currentStatus]}`}>{currentStatus}</span>
      </div>
      <p className="text-gray-700 mb-1">{task.description || 'No description provided.'}</p>
      <div className="text-xs text-gray-500 mb-2">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</div>
      <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
        <span className="font-semibold">Priority:</span> {task.priority || 'Medium'}
        <span className="ml-2">Assigned to: {assignedName}</span>
      </div>
      {onStatusChange && (
        <div className="flex flex-wrap gap-2 mt-2">
          {['To Do', 'In Progress', 'Done'].map((status) => (
            <button
              key={status}
              onClick={() => onStatusChange(task._id, status)}
              disabled={currentStatus === status}
              className={`px-2 py-1 rounded text-xs ${currentStatus === status ? 'bg-gray-300' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
