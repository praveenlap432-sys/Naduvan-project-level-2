import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MapPin, CreditCard, PackageCheck, ArrowLeft } from "lucide-react";
import api, { customerHeaders } from "../api";
import { Layout } from "../components";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!localStorage.getItem("naduvan_customer_token")) { navigate("/account?return=checkout"); return; }
    api.get(`/customers/orders/${id}`, customerHeaders()).then(r=>setOrder(r.data)).catch(e=>setError(e.response?.data?.message || "Unable to load this order."));
  }, [id, navigate]);
  const date = value => value ? new Date(value).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "Within 5 days";
  if (error) return <Layout><main className="order-detail-page"><p>{error}</p><Link to="/account">Go to my account</Link></main></Layout>;
  if (!order) return <Layout><main className="order-detail-page">Loading your order...</main></Layout>;
  return <Layout>
    <main className="order-detail-page">
      <Link className="back-shopping" to="/shop"><ArrowLeft size={16}/> Go to Shopping</Link>
      <section className="order-meta-card">
        <div><span>Order ID:</span> <b>{order.orderNumber || order._id}</b></div>
        <div><span>Ordered on:</span> {date(order.createdAt)}</div>
        <div><span>Ordered time:</span> {new Date(order.createdAt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</div>
        <div><span>Order Status:</span> <b>{order.status}</b></div>
        <div className="delivery-estimate"><PackageCheck size={18}/><span>Estimated delivery: <b>{date(order.estimatedDeliveryDate)}</b> (within 5 days)</span></div>
      </section>
      <section className="order-items-card">
        {order.items.map((item,i)=><article className="order-detail-item" key={`${item.productId}-${i}`}>
          <img src={item.image} alt={item.name}/>
          <div className="order-item-copy"><b>{item.name} {item.size?`/ ${item.size}`:""}</b><span>Qty: {item.quantity}</span><strong>₹{(Number(item.price)*Number(item.quantity)).toFixed(2)}</strong></div>
        </article>)}
      </section>
      <section className="order-info-card">
        <h3><MapPin size={18}/> Delivery Address</h3>
        <p>{order.customer.name}</p><p>Mobile: {order.customer.phone}</p>
        <p>{[order.customer.address,order.customer.city,order.customer.pincode].filter(Boolean).join(", ")}</p>
        <h3><CreditCard size={18}/> Payment Method</h3><p>{order.paymentMethod==="COD"?"Cash on Delivery":"Online"} · {order.paymentStatus}</p>
        <h3><PackageCheck size={18}/> Order Summary</h3>
        <div className="order-summary-line"><span>Subtotal</span><b>₹{Number(order.subtotal).toFixed(2)}</b></div>
        <div className="order-summary-line"><span>Delivery Fee</span><b>{order.deliveryCharge?`₹${Number(order.deliveryCharge).toFixed(2)}`:"FREE"}</b></div>
        <div className="order-grand-total"><span>Total Amount</span><b>₹{Number(order.total).toFixed(2)}</b></div>
      </section>
      <div className="order-detail-actions"><Link to="/account">My orders</Link><Link to="/shop">Continue shopping</Link></div>
    </main>
  </Layout>;
}
