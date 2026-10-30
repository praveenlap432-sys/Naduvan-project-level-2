import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api, { customerHeaders } from "../api";
import { Layout } from "../components";

export default function CustomerAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("naduvan_customer_token");

  const loadProfile = async () => {
    try {
      const [me, orderList] = await Promise.all([
        api.get("/customers/me", customerHeaders()),
        api.get("/customers/orders", customerHeaders()),
      ]);
      setCustomer(me.data); setOrders(orderList.data);
    } catch {
      localStorage.removeItem("naduvan_customer_token");
      setCustomer(null);
    }
  };
  useEffect(() => { if (token) loadProfile(); }, []);

  const submit = async e => {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const endpoint = mode === "register" ? "/customers/register" : "/customers/login";
      const response = await api.post(endpoint, form);
      localStorage.setItem("naduvan_customer_token", response.data.token);
      const next = location.state?.from || new URLSearchParams(location.search).get("return");
      if (next === "checkout") navigate("/checkout");
      else { await loadProfile(); }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to continue. Please try again.");
    } finally { setBusy(false); }
  };

  const signOut = () => {
    localStorage.removeItem("naduvan_customer_token");
    setCustomer(null); setOrders([]);
    setForm({ name: "", email: "", phone: "", password: "" });
  };

  return <Layout>
    <main className="customer-page">
      {!customer ? <section className="customer-auth-card">
        <small>YOUR NADUVAN ACCOUNT</small>
        <h1>{mode === "register" ? "Create your account" : "Sign in"}</h1>
        <p>Sign in to place orders and track your deliveries.</p>
        <form onSubmit={submit} className="customer-auth-form">
          {mode === "register" && <>
            <label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} autoComplete="name" /></label>
            <label>Mobile number<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} autoComplete="tel" /></label>
          </>}
          <label>Email<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} autoComplete="email" /></label>
          <label>Password<input required type="password" minLength={mode==="register"?8:1} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} autoComplete={mode==="register"?"new-password":"current-password"} /></label>
          {mode==="register" && <small>Password must contain at least 8 characters.</small>}
          {error && <div className="error">{error}</div>}
          <button className="green-btn" disabled={busy}>{busy?"PLEASE WAIT...":mode==="register"?"CREATE ACCOUNT":"SIGN IN"}</button>
        </form>
        <p>{mode==="register"?"Already have an account?":"New to Naduvan?"} <button className="text-button" onClick={()=>{setMode(mode==="register"?"login":"register");setError("");}}>{mode==="register"?"Sign in":"Create account"}</button></p>
      </section> : <section className="customer-profile">
        <div className="profile-heading"><div><small>MY ACCOUNT</small><h1>Hello, {customer.name}</h1><p>{customer.email} {customer.phone ? `· ${customer.phone}` : ""}</p></div><button className="outline-btn" onClick={signOut}>Sign out</button></div>
        <div className="profile-section-title"><h2>My orders</h2><Link to="/shop">Continue shopping →</Link></div>
        {!orders.length ? <div className="profile-empty">You haven't placed any orders yet. <Link to="/shop">Start shopping</Link></div> : <div className="customer-order-list">
          {orders.map(order=><article className="customer-order-row" key={order._id}>
            <div><small>ORDER ID</small><b>{order.orderNumber || order._id}</b><span>{new Date(order.createdAt).toLocaleString("en-IN")}</span></div>
            <div><small>STATUS</small><b className="order-status">{order.status}</b><span>Expected by {order.estimatedDeliveryDate?new Date(order.estimatedDeliveryDate).toLocaleDateString("en-IN"):"within 5 days"}</span></div>
            <div><small>TOTAL</small><b>₹{Number(order.total).toFixed(2)}</b><Link to={`/orders/${order._id}`}>View details →</Link></div>
          </article>)}
        </div>}
      </section>}
    </main>
  </Layout>;
}
