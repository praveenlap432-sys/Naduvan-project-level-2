   
import React from "react";
import { Layout } from "../components";

export default function Service() {
  return (
    <Layout>
      <section className="services-section page-section">
        <small>OUR SERVICES</small>

        <h1>Care beyond the product.</h1>

        <p className="page-intro">
          We make your shopping experience simple, clear and convenient.
        </p>

        <div className="service-grid">
          <article>
            <b>Easy Shopping</b>
            <p>
              Clear categories, multiple sizes and a simple shopping experience.
            </p>
          </article>

          <article>
            <b>Secure Ordering</b>
            <p>
              COD and online-payment options with a simple and secure checkout.
            </p>
          </article>

          <article>
            <b>Fast Delivery</b>
            <p>
              ₹50 standard delivery, with free shipping for orders above ₹1000.
            </p>
          </article>

          <article>
            <b>Product Support</b>
            <p>
              Need help choosing a product or size? Our team is happy to help.
            </p>
          </article>

          <article>
            <b>Order Assistance</b>
            <p>
              Get support with your orders, delivery and product-related queries.
            </p>
          </article>

          <article>
            <b>Customer First</b>
            <p>
              We focus on making every Naduvan shopping experience simple and friendly.
            </p>
          </article>
        </div>
      </section>
    </Layout>
  );
}
