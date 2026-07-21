import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export async function register({ fullName, email, password, role }) {
  const { data } = await api.post("/api/auth/register", {
    fullName,
    email,
    password,
    role,
  });

  return data;
}

export async function login({ email, password, role }) {
  let endpoint = "/api/auth/login";
  if (role === "admin") endpoint = "/api/admin/login";
  if (role === "restaurant") endpoint = "/api/auth/restaurant/login";

  const { data } = await api.post(endpoint, {
    email,
    password,
  });

  return data;
}

export async function logout() {
  const { data } = await api.post("/api/auth/logout");

  return data;
}

export async function getMe() {
  const { data } = await api.get("/api/users/profile");

  return data;
}

export default api;
