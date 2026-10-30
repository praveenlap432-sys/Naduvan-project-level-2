import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShoppingBag, Users, IndianRupee, Package } from "lucide-react";
import api, { adminHeaders } from "../api";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ orders: 0, customers: 0, sales: 0, products: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        api.get("/admin/stats", adminHeaders()),
        api.get("/admin/orders", adminHeaders()),
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data.slice(0, 6));
    } catch {
      localStorage.removeItem("naduvan_admin_token");
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <AdminLayout
      title="Dashboard"
      description="A quick overview of your store, orders and sales."
    >
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon"><ShoppingBag size={18} /></div>
          <span>Total Orders</span>
          <strong>{stats.orders}</strong>
          <small>All orders</small>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon"><Users size={18} /></div>
          <span>Customers</span>
          <strong>{stats.customers}</strong>
          <small>Unique customers</small>
        </div>
        <div className="admin-stat-card">
          <div className="stat-icon"><IndianRupee size={18} /></div>
          <span>Total Sales</span>
          <strong>₹{Number(stats.sales || 0).toFixed(0)}</strong>
          <small>Excluding cancelled orders</small>
        </div>
        <div className="admin-stat-card admin-stat-clickable" onClick={() => navigate("/admin/products")}>
          <div className="stat-icon"><Package size={18} /></div>
          <span>Products</span>
          <strong>{stats.products}</strong>
          <small>Manage sizes & prices →</small>
        </div>
      </div>

      <section className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <small>ORDER MANAGEMENT</small>
            <h2>Recent Orders</h2>
          </div>
          <button className="admin-outline-btn" onClick={() => navigate("/admin/orders")}>
            View all <ArrowRight size={14} />
          </button>
        </div>

        {loading ? <div className="admin-empty">Loading...</div> : orders.length === 0 ? (
          <div className="admin-empty">No orders found.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td><b>{order.customer?.name}</b><small>{order.customer?.phone}</small></td>
                    <td><b>₹{Number(order.total || 0).toFixed(0)}</b></td>
                    <td><span className="payment-pill">{order.paymentMethod === "ONLINE" ? "Online" : "COD"}</span></td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td><span className={`status-pill ${order.status?.toLowerCase()}`}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
