import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '', project: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchTasks();
    if (user?.role === 'Admin') fetchProjects();
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects');
      setProjects(res.data);
    } catch {}
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/tasks', form);
      setForm({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '', project: '' });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.patch(`/tasks/${id}/status`, { status });
      fetchTasks();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Tasks</h2>
      {user.role === 'Admin' && (
        <form onSubmit={handleCreate} className="mb-6 bg-white p-4 rounded shadow space-y-3">
          <div>
            <label className="block mb-1">Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <input type="text" name="description" value={form.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block mb-1">Due Date</label>
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block mb-1">Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} className="w-full border px-3 py-2 rounded">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Project</label>
            <select name="project" value={form.project} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Assign To</label>
            <select name="assignedTo" value={form.assignedTo} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
              <option value="">Select Member</option>
              {projects.find(p => p._id === form.project)?.members.map((m) => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Create Task</button>
        </form>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div>
          {tasks.length === 0 && <div>No tasks found.</div>}
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} isAdmin={user.role === 'Admin'} />
          ))}
        </div>
      )}
    </div>
  );
}
