import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Gallery from "./pages/Gallery";
import Checkout from "./pages/Checkout";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminReports from "./pages/AdminReports";
import AdminProducts from "./pages/AdminProducts";
import CustomerAccount from "./pages/CustomerAccount";
import OrderDetails from "./pages/OrderDetails";

// import Services from "./pages/Services";
// // import WhyChooseUs from "./pages/WhyChooseUs";
// import Testimonials from "./pages/Testimonials";
// import Contact from "./pages/Contact";
import Services from "./pages/Service";
import WhyChooseUs from "./pages/Whychooseus";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/account" element={<CustomerAccount />} />
      <Route path="/orders/:id" element={<OrderDetails />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/reports" element={<AdminReports />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/services" element={<Services />} />
      <Route path="/whychooseus" element={<WhyChooseUs />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
