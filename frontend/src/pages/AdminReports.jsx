import React, { useEffect, useState } from "react";
import { Download, Search } from "lucide-react";
import api, { adminHeaders } from "../api";
import AdminLayout from "./AdminLayout";

export default function AdminReports() {
  const now = new Date();
  const [type, setType] = useState("day");
  const [value, setValue] = useState(now.toISOString().slice(0, 10));
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    try {
      setLoading(true);
      const queryName = type === "day" ? "date" : type === "month" ? "month" : "year";
      const res = await api.get(`/admin/reports/${type}`, {
        ...adminHeaders(),
        params: { [queryName]: value },
      });
      setReport(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReport(); }, [type, value]);

  const exportCSV = () => {
    if (!report?.data?.length) return;
    const rows = [
      ["Order ID", "Customer", "Total", "Payment", "Status", "Date"],
      ...report.data.map(o => [
        o._id,
        o.customer?.name || "",
        o.total,
        o.paymentMethod,
        o.status,
        new Date(o.createdAt).toLocaleDateString(),
      ]),
    ];
    const csv = rows.map(row => row.map(v => `"${String(v).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `naduvan-${type}-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout
      title="Reports"
      description="Check sales and orders by day, month or year."
    >
      <section className="report-controls">
        <div className="report-tabs">
          {["day", "month", "year"].map(item => (
            <button key={item} className={type === item ? "active" : ""} onClick={() => {
              setType(item);
              if (item === "day") setValue(now.toISOString().slice(0, 10));
              if (item === "month") setValue(now.toISOString().slice(0, 7));
              if (item === "year") setValue(String(now.getFullYear()));
            }}>
              {item.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="report-filter">
          <label>{type === "day" ? "Select date" : type === "month" ? "Select month" : "Select year"}</label>
          <input
            type={type === "day" ? "date" : type === "month" ? "month" : "number"}
            min={type === "year" ? "2000" : undefined}
            value={value}
            onChange={e => setValue(e.target.value)}
          />
          <button className="green-btn" onClick={loadReport} disabled={loading}>
            <Search size={14} /> {loading ? "Checking..." : "Check Report"}
          </button>
        </div>
      </section>

      {report && (
        <>
          <div className="report-summary">
            <div><span>Total Orders</span><strong>{report.orders}</strong></div>
            <div><span>Customers</span><strong>{report.customers}</strong></div>
            <div><span>Sales</span><strong>₹{Number(report.sales || 0).toFixed(0)}</strong></div>
            <div><span>Cancelled</span><strong>{report.cancelledOrders}</strong></div>
            <div><span>COD Orders</span><strong>{report.codOrders}</strong></div>
            <div><span>Online Orders</span><strong>{report.onlineOrders}</strong></div>
          </div>

          <section className="admin-panel">
            <div className="admin-panel-head">
              <div><small>REPORT DETAILS</small><h2>Orders in selected period</h2></div>
              <button className="admin-outline-btn" onClick={exportCSV} disabled={!report.data?.length}>
                <Download size={14} /> Export CSV
              </button>
            </div>
            {!report.data?.length ? <div className="admin-empty">No orders for this period.</div> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {report.data.map(o => (
                      <tr key={o._id}>
                        <td><b>{o.customer?.name}</b><small>{o.customer?.phone}</small></td>
                        <td>₹{Number(o.total || 0).toFixed(0)}</td>
                        <td>{o.paymentMethod === "ONLINE" ? "Online" : "COD"}</td>
                        <td><span className={`status-pill ${o.status?.toLowerCase()}`}>{o.status}</span></td>
                        <td>{new Date(o.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </AdminLayout>
  );
}
