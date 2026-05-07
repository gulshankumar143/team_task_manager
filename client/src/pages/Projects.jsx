import { useEffect, useState } from "react";
import { PlusCircleIcon, UsersIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [memberSelection, setMemberSelection] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
    if (user?.role === "Admin") fetchUsers();
  }, [user]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await API.post("/projects", { name, description });
      setName("");
      setDescription("");
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  const handleMemberSelect = (projectId, userId) => {
    setMemberSelection((prev) => ({ ...prev, [projectId]: userId }));
  };

  const handleAddMember = async (projectId) => {
    const userId = memberSelection[projectId];
    if (!userId) return;
    setError("");
    try {
      await API.post(`/projects/${projectId}/add-member`, { userId });
      setMemberSelection((prev) => ({ ...prev, [projectId]: "" }));
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    }
  };

  const handleRemoveMember = async (projectId, userId) => {
    setError("");
    try {
      await API.post(`/projects/${projectId}/remove-member`, { userId });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove member");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 pb-10">
      <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Project Workspace</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Projects</h1>
            <p className="mt-2 text-sm text-slate-500">Create projects, add members, and manage your team workload.</p>
          </div>
          {user?.role === "Admin" && (
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm">
              <PlusCircleIcon className="h-5 w-5" />
              Create & Manage
            </div>
          )}
        </div>

        {user?.role === "Admin" && (
          <form onSubmit={handleCreate} className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-3xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Create Project
            </button>
          </form>
        )}

        {error && <div className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">{error}</div>}
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-56 animate-pulse rounded-3xl bg-slate-100" />
          ))}
        </div>
      ) : !projects.length ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-500">
          <UsersIcon className="mx-auto h-10 w-10 text-slate-400" />
          <p className="mt-4 text-lg font-semibold">No active projects yet</p>
          <p className="mt-2 text-sm text-slate-500">Create a project to invite team members and start assigning tasks.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project) => {
            const availableUsers = users.filter((userOption) => !project.members.some((member) => member._id === userOption._id));
            const creatorId = project.creator?._id || project.creator;
            return (
              <div key={project._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Project</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">{project.name}</h2>
                    <p className="mt-2 text-sm text-slate-500">{project.description || "No description added."}</p>
                  </div>
                  <div className="rounded-2xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700">{project.members.length} members</div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.members.map((member) => (
                    <span key={member._id} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                      {member.name}
                    </span>
                  ))}
                </div>

                {user?.role === "Admin" && (
                  <div className="mt-6 space-y-4">
                    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                      <select
                        value={memberSelection[project._id] || ""}
                        onChange={(e) => handleMemberSelect(project._id, e.target.value)}
                        className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      >
                        <option value="">Add team member</option>
                        {availableUsers.map((userOption) => (
                          <option key={userOption._id} value={userOption._id}>{userOption.name} ({userOption.email})</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleAddMember(project._id)}
                        disabled={!memberSelection[project._id]}
                        className="inline-flex h-12 items-center justify-center rounded-3xl bg-emerald-600 px-5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300 hover:bg-emerald-700"
                      >
                        <UserPlusIcon className="mr-2 h-4 w-4" />
                        Add Member
                      </button>
                    </div>

                    <div className="space-y-2 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                      <p className="font-semibold text-slate-900">Team members</p>
                      {project.members.map((member) => (
                        <div key={member._id} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                          <div className="truncate font-medium text-slate-900">{member.name}</div>
                          {creatorId !== member._id && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(project._id, member._id)}
                              className="text-sm font-semibold text-rose-600 transition hover:text-rose-800"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
