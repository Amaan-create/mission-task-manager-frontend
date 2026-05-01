import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function Tasks() {
  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [assignedTo, setAssignedTo] = useState("");
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/${id}`);
      const data = res.data;

      if (role === "admin") {
        setTasks(data);
      } else {
        setTasks(
          data.filter((t) => {
            const assigned =
              typeof t.assignedTo === "object"
                ? t.assignedTo?._id
                : t.assignedTo;

            return assigned === userId;
          }),
        );
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tasks");
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

  useEffect(() => {
    fetchTasks();
    if (role === "admin") fetchUsers();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();

    if (!form.title) {
      return setError("Title is required");
    }

    try {
      setError("");

      await API.post("/tasks", {
        ...form,
        projectId: id,
        assignedTo: assignedTo || userId,
      });

      setForm({ title: "", description: "" });
      setAssignedTo("");
      fetchTasks();
    } catch (err) {
      setError("Only admin can create/assign tasks");
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await API.put(`/tasks/${taskId}`, { status });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white p-6">
      <h1 className="text-2xl text-red-500 mb-6">
        {role === "admin" ? "Mission Control" : "My Missions"}
      </h1>

      {error && <p className="text-red-400 mb-3">{error}</p>}

      {/* Admin-only task creation */}
      {role === "admin" && (
        <form
          onSubmit={createTask}
          className="bg-gray-800 p-4 rounded-xl mb-6 flex gap-3"
        >
          <input
            className="p-2 bg-gray-700 flex-1"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            className="p-2 bg-gray-700 flex-1"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          {/* ✅ Dropdown instead of manual ID */}
          <select
            className="bg-gray-700 p-2"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="">Assign User</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>

          <button className="bg-red-600 px-4 hover:bg-red-700">Add</button>
        </form>
      )}

      {/* Tasks */}
      <div className="grid grid-cols-3 gap-4">
        {tasks.length === 0 ? (
          <p className="text-gray-400">No missions found</p>
        ) : (
          tasks.map((t) => (
            <div key={t._id} className="bg-gray-800 p-4 rounded-xl">
              <h2 className="text-red-400">{t.title}</h2>

              <p className="text-sm text-gray-300">{t.description}</p>

              <p className="text-xs text-gray-400 mt-1">
                Assigned:{" "}
                {typeof t.assignedTo === "object"
                  ? t.assignedTo?.name
                  : t.assignedTo}
              </p>

              <select
                className="mt-2 bg-gray-700 text-sm"
                value={t.status}
                onChange={(e) => updateStatus(t._id, e.target.value)}
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
