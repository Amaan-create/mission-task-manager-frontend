import axios from "axios";

const isDev = import.meta.env.DEV;

const baseURL = isDev
  ? "http://localhost:5000/api"
  : import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error("VITE_API_URL is not defined");
}

const API = axios.create({ baseURL });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
