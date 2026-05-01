import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });

  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/signup", form);
      nav("/"); // back to login
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0B0F14]">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl w-80">
        <h2 className="text-red-500 mb-4">Create Agent</h2>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <input
          className="w-full mb-2 p-2 bg-gray-700"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full mb-2 p-2 bg-gray-700"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="w-full mb-2 p-2 bg-gray-700"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="w-full mb-3 p-2 bg-gray-700"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </select>

        <button className="w-full bg-red-600 py-2">Create Account</button>
      </form>
    </div>
  );
}
