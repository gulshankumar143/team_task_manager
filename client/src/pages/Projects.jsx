import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [memberSelection, setMemberSelection] = useState({});
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
    if (user?.role === 'Admin') fetchUsers();
  }, [user]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await API.get('/projects');
      setProjects(res.data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/projects', { name, description });
      setName('');
      setDescription('');
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleMemberSelect = (projectId, userId) => {
    setMemberSelection((prev) => ({ ...prev, [projectId]: userId }));
  };

  const handleAddMember = async (projectId) => {
    const userId = memberSelection[projectId];
    if (!userId) return;
    setError('');
    try {
      await API.post(`/projects/${projectId}/add-member`, { userId });
      setMemberSelection((prev) => ({ ...prev, [projectId]: '' }));
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (projectId, userId) => {
    setError('');
    try {
      await API.post(`/projects/${projectId}/remove-member`, { userId });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Projects</h2>
      {user.role === 'Admin' && (
        <form onSubmit={handleCreate} className="mb-6 bg-white p-4 rounded shadow space-y-3">
          <div>
            <label className="block mb-1">Project Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Create Project</button>
        </form>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <ul className="space-y-3">
          {projects.map((p) => {
            const availableUsers = users.filter(
              (u) => !p.members.some((m) => m._id === u._id)
            );
            const creatorId = p.creator?._id || p.creator;
            return (
              <li key={p._id} className="bg-white p-4 rounded shadow">
                <div className="font-bold">{p.name}</div>
                <div className="text-gray-600 text-sm mb-2">{p.description}</div>
                <div className="text-xs text-gray-500 mb-3">
                  Members: {p.members.map((m) => m.name).join(', ') || 'None'}
                </div>

                {user?.role === 'Admin' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <select
                        value={memberSelection[p._id] || ''}
                        onChange={(e) => handleMemberSelect(p._id, e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                      >
                        <option value="">Select user to add</option>
                        {availableUsers.map((u) => (
                          <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleAddMember(p._id)}
                        disabled={!memberSelection[p._id]}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Add Member
                      </button>
                    </div>

                    <div className="text-xs text-gray-600">
                      Remove members:
                      <div className="mt-2 space-y-1">
                        {p.members.map((m) => (
                          <div key={m._id} className="flex items-center justify-between gap-2 bg-gray-50 p-2 rounded">
                            <span>{m.name} ({m.email})</span>
                            {creatorId !== m._id && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMember(p._id, m._id)}
                                className="text-red-600 hover:underline"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
