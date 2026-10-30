import React, { useEffect, useState } from "react";
import { Eye, RefreshCw, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api, { adminHeaders } from "../api";
import AdminLayout from "./AdminLayout";

const statusOptions = ["Placed", "Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/orders", adminHeaders());
      setOrders(res.data);
    } catch {
      localStorage.removeItem("naduvan_admin_token");
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      setUpdating(id);
      const res = await api.patch(`/admin/orders/${id}/status`, { status }, adminHeaders());
      setOrders(current => current.map(order => order._id === id ? res.data : order));
      if (selected?._id === id) setSelected(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to update order");
    } finally {
      setUpdating(null);
    }
  };

  const rejectOrder = async (id) => {
    const ok = window.confirm(
      "Cancel/reject this order? The order history will be retained as Cancelled."
    );
    if (!ok) return;

    try {
      const response = await api.delete(`/admin/orders/${id}`, adminHeaders());
      setOrders(current => current.map(order => order._id === id ? { ...order, status: "Cancelled" } : order));
      setSelected(response.data.order || null);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to delete order");
    }
  };

  return (
    <AdminLayout
      title="Customer Orders"
      description="View customer details, payment method and update order status."
    >
      <section className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <small>ORDERS</small>
            <h2>{orders.length} Orders</h2>
          </div>
          <button className="admin-outline-btn" onClick={loadOrders} disabled={loading}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {loading ? <div className="admin-empty">Loading orders...</div> : orders.length === 0 ? (
          <div className="admin-empty">No orders found.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table orders-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>
                      <b>{order.customer?.name}</b>
                      <small>{order.customer?.city} {order.customer?.pincode}</small>
                    </td>
                    <td>
                      {order.customer?.phone}
                      <small>{order.customer?.email}</small>
                    </td>
                    <td>
                      {order.items?.map((item, i) => (
                        <div key={item.productId || i}>{item.name} × {item.quantity}</div>
                      ))}
                    </td>
                    <td><b>₹{Number(order.total || 0).toFixed(0)}</b></td>
                    <td>
                      <span className="payment-pill">
                        {order.paymentMethod === "ONLINE" ? "Online" : "COD"}
                      </span>
                      <small>{order.paymentStatus || "Pending"}</small>
                    </td>
                    <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}</td>
                    <td>
                      <select
                        value={order.status}
                        disabled={updating === order._id}
                        onChange={e => updateStatus(order._id, e.target.value)}
                      >
                        {statusOptions.map(status => <option key={status}>{status}</option>)}
                      </select>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button className="icon-action" title="View details" onClick={() => setSelected(order)}>
                          <Eye size={15} />
                        </button>
                        <button className="icon-action danger" title="Reject / Delete" onClick={() => rejectOrder(order._id)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selected && (
        <div className="admin-modal-backdrop" onMouseDown={() => setSelected(null)}>
          <div className="admin-modal" onMouseDown={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}><X size={18} /></button>
            <small>ORDER DETAILS</small>
            <h2>{selected.customer?.name}</h2>
            <div className="detail-grid">
              <div><span>Phone</span><b>{selected.customer?.phone}</b></div>
              <div><span>Email</span><b>{selected.customer?.email || "-"}</b></div>
              <div><span>Address</span><b>{selected.customer?.address}, {selected.customer?.city} - {selected.customer?.pincode}</b></div>
              <div><span>Payment</span><b>{selected.paymentMethod === "ONLINE" ? "Online Payment" : "Cash on Delivery"} · {selected.paymentStatus || "Pending"}</b></div>
            </div>
            <h3>Items</h3>
            {selected.items?.map((item, i) => (
              <div className="detail-item" key={item.productId || i}>
                <img src={item.image} alt={item.name} />
                <div><b>{item.name}</b><span>₹{item.price} × {item.quantity}</span></div>
                <strong>₹{Number(item.price) * Number(item.quantity)}</strong>
              </div>
            ))}
            <div className="detail-total"><span>Total</span><b>₹{Number(selected.total || 0).toFixed(0)}</b></div>
            <button className="danger-btn wide" onClick={() => rejectOrder(selected._id)}>
              <Trash2 size={15} /> Cancel Order
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
