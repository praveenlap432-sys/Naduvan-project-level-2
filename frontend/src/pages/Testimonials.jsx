
import React from "react";
import { Layout } from "../components";
import { reviews } from "../data";

export default function Testimonials() {
  return (
    <Layout>
      <section className="reviews page-section">
        <small>WHAT CUSTOMERS SAY</small>

        <h1>Loved by our customers.</h1>

        <p className="page-intro">
          See what our customers say about their Naduvan experience.
        </p>

        <div className="review-grid">
          {reviews.map((review) => (
            <article key={review.name}>
              <div className="quote">“</div>

              <p>{review.text}</p>

              <b>{review.name}</b>
              <span>{review.city}</span>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}

