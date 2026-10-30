
import React from "react";
import { Layout } from "../components";
import './Gallery.css'

export default function Contact() {
  return (
    <Layout>
      <section className="contact-page">

        <div className="contact-content">

          <small>CONTACT US</small>

          <h1>Need help choosing a product?</h1>

          <p className="contact-intro">
            Reach out to Naduvan and we'll be happy to help with
            products, sizes and orders.
          </p>

          <div className="contact-details">

            <div className="contact-item">
              <b>Email</b>
              <span>hello@naduvanindustry.com</span>
            </div>

            <div className="contact-item">
              <b>Support</b>
              <span>Products, sizes and orders</span>
            </div>

            <div className="contact-item">
              <b>Delivery</b>
              <span>Across India</span>
            </div>

          </div>

          <a
            className="green-btn contact-btn"
            href="mailto:hello@naduvanindustry.com"
          >
            EMAIL US →
          </a>

        </div>

      </section>
    </Layout>
  );
}

