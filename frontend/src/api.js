import axios from "axios";

// Set VITE_API_URL in frontend/.env (example: https://your-backend.example.com/api)
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/$/, ""),
  timeout: 20000,
});
export default api;
export function adminHeaders() {
  return { headers: { Authorization: `Bearer ${localStorage.getItem("naduvan_admin_token") || ""}` } };
}
export function customerHeaders() {
  return { headers: { Authorization: `Bearer ${localStorage.getItem("naduvan_customer_token") || ""}` } };
}
