import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Layout } from "../components";
import { customerHeaders } from "../api";

// import './Gallery.css'

export default function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("naduvan_cart") || "[]")
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod] = useState("COD");
  const [placing, setPlacing] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("naduvan_customer_token")) {
      navigate("/account?return=checkout", { replace: true });
      return;
    }
    api.get("/customers/me", customerHeaders()).then(({data}) => {
      setForm(prev => ({...prev, name: prev.name || data.name || "", email: prev.email || data.email || "", phone: prev.phone || data.phone || ""}));
    }).catch(() => {
      localStorage.removeItem("naduvan_customer_token");
      navigate("/account?return=checkout", { replace: true });
    });
  }, [navigate]);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
  const deliveryCharge = subtotal >= 1000 ? 0 : cart.length ? 50 : 0;
  const total = subtotal + deliveryCharge;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const updateQuantity = (index, difference) => {
    const updatedCart = [...cart];
    const item = updatedCart[index];

    if (item.quantity === 1 && difference === -1) {
      updatedCart.splice(index, 1);
    } else {
      item.quantity = Math.max(1, item.quantity + difference);
    }

    setCart(updatedCart);
    localStorage.setItem("naduvan_cart", JSON.stringify(updatedCart));
  };

  const placeOrder = async e => {
    e.preventDefault();

    if (!cart.length) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setPlacing(true);

      const response = await api.post("/orders", {
        customer: form,
        items: cart,
        paymentMethod,
      }, customerHeaders());

      localStorage.removeItem("naduvan_cart");
      navigate(`/orders/${response.data.orderId}`, { replace: true });
    } catch (error) {
      alert(
        error.response?.data?.message || "Unable to place order"
      );
    } finally {
      setPlacing(false);
    }
  };

  const fields = [
    "name",
    "email",
    "phone",
    "address",
    "city",
    "pincode",
  ];

  return (
    <Layout>
      <section className="page-title">
        <small>CHECKOUT</small>
        <h1>Your order</h1>
      </section>

      <section className="checkout">
        <div className="cart-box">
          <h2>Cart</h2>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((item, index) => (
              <div className="cart-row" key={item._id || index}>
                <img src={item.image} alt={item.name} />
                <div>
                  <b>{item.name}</b>
                  <span>{item.size || "100ml"} • ₹{Number(item.price).toFixed(0)}</span>

                  <div className="quantity">
                    <button type="button" onClick={() => updateQuantity(index, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(index, 1)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <form className="checkout-form" onSubmit={placeOrder}>
          <h2>Delivery details</h2>

          {fields.map(field => (
            <input
              key={field}
              required={["name", "phone", "address"].includes(field)}
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            />
          ))}

          <div className="payment-method-box">
            <h3>Payment Method</h3>

            <label className={`payment-option ${paymentMethod === "COD" ? "selected" : ""}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
              />
              <div>
                <b>Cash on Delivery</b>
                <span>Pay when your order arrives</span>
              </div>
            </label>


          </div>

          <div className="checkout-summary">
            <div><span>Subtotal</span><b>₹{subtotal.toFixed(0)}</b></div>
            <div><span>Delivery charge</span><b>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</b></div>
            {deliveryCharge > 0 && <small>Free shipping on orders of ₹1000 or more.</small>}
            {deliveryCharge === 0 && subtotal > 0 && <small>You unlocked free shipping!</small>}
            <div className="checkout-total"><span>Total</span><b>₹{total.toFixed(0)}</b></div>
          </div>

          <button
            type="submit"
            className="green-btn"
            disabled={!cart.length || placing}
          >
            {placing ? "PLACING ORDER..." : "PLACE COD ORDER →"}
          </button>
        </form>
      </section>
    </Layout>
  );
}
