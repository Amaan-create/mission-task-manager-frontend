import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [data, setData] = useState({});
  const role = localStorage.getItem("role");
  const nav = useNavigate();

  useEffect(() => {
    API.get("/dashboard").then((res) => setData(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white p-6">
      <h1 className="text-2xl text-red-500 mb-6">
        {role === "admin" ? "Admin Control Panel" : "My Dashboard"}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {["total", "completed", "pending", "overdue"].map((k) => (
          <div key={k} className="bg-gray-800 p-4 rounded-xl">
            <p>{k}</p>
            <h2 className="text-xl">{data[k] || 0}</h2>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          className="bg-red-600 px-4 py-2"
          onClick={() => nav("/projects")}
        >
          View Projects
        </button>
      </div>
    </div>
  );
}
