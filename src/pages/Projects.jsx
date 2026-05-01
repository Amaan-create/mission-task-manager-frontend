import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const nav = useNavigate();

  const role = localStorage.getItem("role");

  const fetchProjects = async () => {
    const res = await API.get("/projects");
    setProjects(res.data);
  };

  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    await API.post("/projects", form);
    setForm({ name: "", description: "" });
    fetchProjects();
  };

  const addMember = async (projectId, userId) => {
    if (!userId) return;

    await API.post(`/projects/${projectId}/add-member`, { userId });
    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white p-6">
      <h1 className="text-2xl text-red-500 mb-6">Mission Projects</h1>

      {/* Create Project (admin only) */}
      {role === "admin" && (
        <form
          onSubmit={createProject}
          className="bg-gray-800 p-4 rounded-xl mb-6 flex gap-3"
        >
          <input
            className="p-2 bg-gray-700 flex-1"
            placeholder="Project Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="p-2 bg-gray-700 flex-1"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button className="bg-red-600 px-4">Add</button>
        </form>
      )}

      {/* Projects */}
      <div className="grid grid-cols-3 gap-4">
        {projects.map((p) => (
          <div
            key={p._id}
            className="bg-gray-800 p-4 rounded-xl hover:bg-gray-700"
          >
            <div onClick={() => nav(`/tasks/${p._id}`)}>
              <h2 className="text-red-400">{p.name}</h2>
              <p className="text-sm">{p.description}</p>
            </div>

            {/* Members */}
            <div className="mt-2">
              <p className="text-xs text-gray-400">Team:</p>
              {p.members?.map((m) => (
                <span key={m._id} className="text-xs bg-gray-700 px-2 mr-1">
                  {m.name}
                </span>
              ))}
            </div>

            {/* Add Member (admin only) */}
            {role === "admin" && (
              <select
                className="bg-gray-700 mt-2 p-1 w-full"
                onChange={(e) => addMember(p._id, e.target.value)}
              >
                <option value="">Add Member</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
