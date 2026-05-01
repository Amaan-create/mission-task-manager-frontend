import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      const token = res.data.token;
      login(token);

      const payload = JSON.parse(atob(token.split(".")[1]));

      localStorage.setItem("userId", payload.id);
      localStorage.setItem("role", payload.role);

      nav("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0B0F14]">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl w-80">
        <h2 className="text-red-500 mb-4">Mission Login</h2>

        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

        <input
          className="w-full mb-2 p-2 bg-gray-700"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="w-full mb-2 p-2 bg-gray-700"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-red-600 py-2 hover:bg-red-700">
          Enter
        </button>

        {/* ✅ Add this block */}
        <p className="text-sm mt-3 text-gray-400 text-center">
          New agent?{" "}
          <span
            className="text-red-500 cursor-pointer"
            onClick={() => nav("/signup")}
          >
            Create Account
          </span>
        </p>
      </form>
    </div>
  );
}
