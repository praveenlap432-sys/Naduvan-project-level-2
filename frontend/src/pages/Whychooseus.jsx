
import React from "react";
import { Layout } from "../components";

export default function WhyChooseus() {
  return (
    <Layout>
      <section className="why-section page-section">
        <small>WHY CHOOSE US</small>

        <h1>Simple reasons to choose Naduvan.</h1>

        <p className="page-intro">
          Thoughtful personal-care products designed for simple everyday routines.
        </p>

        <div className="why-grid">
          <article>
            <strong>01</strong>
            <b>Natural-inspired range</b>
            <p>
              Everyday personal care with a nature-led approach.
            </p>
          </article>

          <article>
            <strong>02</strong>
            <b>Flexible quantities</b>
            <p>
              Choose 100ml, 200ml or 500ml where available.
            </p>
          </article>

          <article>
            <strong>03</strong>
            <b>Transparent pricing</b>
            <p>
              See the selected quantity and exact price before adding products to cart.
            </p>
          </article>

          <article>
            <strong>04</strong>
            <b>Easy delivery</b>
            <p>
              Standard ₹50 delivery and free shipping on orders above ₹1000.
            </p>
          </article>

          <article>
            <strong>05</strong>
            <b>Quality focused</b>
            <p>
              We focus on dependable products and a clean shopping experience.
            </p>
          </article>

          <article>
            <strong>06</strong>
            <b>Customer first</b>
            <p>
              Friendly support whenever you need help with products or orders.
            </p>
          </article>
        </div>
      </section>
    </Layout>
  );
}

