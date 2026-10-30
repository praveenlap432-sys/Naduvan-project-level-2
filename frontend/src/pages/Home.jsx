// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// import api from "../api";
// import { categories, reviews } from "../data";
// import { Layout, ProductCard } from "../components";

// export default function Home() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await api.get("/products/featured");
//         setProducts(response.data);
//       } catch (error) {
//         console.error("Failed to fetch featured products:", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   return (
//     <Layout>
//       {/* Hero Section */}
//       <section className="hero">
//         <div className="hero-copy">
//           <small>NATURAL • SIMPLE • THOUGHTFUL</small>

//           <h1>
//             Everyday care,
//             <br />
//             <em>naturally.</em>
//           </h1>

//           <p>
//             Clean, uncomplicated personal care inspired by nature and made
//             for modern routines.
//           </p>

//           <Link className="green-btn" to="/shop">
//             EXPLORE COLLECTION →
//           </Link>
//         </div>

//         <img
//           src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85"
//           alt="Natural personal care products"
//         />
//       </section>

//       {/* Categories Section */}
//       <section className="categories">
//         {categories.slice(0, 8).map(([name, image]) => (
//           <Link
//             className="category-card"
//             to={`/shop?category=${encodeURIComponent(name)}`}
//             key={name}
//           >
//             <img src={image} alt={name} />
//             <b>{name}</b>
//           </Link>
//         ))}
//       </section>

//       {/* Best Sellers */}
//       <section className="section">
//         <div className="section-heading">
//           <div>
//             <small>CURATED FOR YOU</small>
//             <h2>Best Sellers</h2>
//           </div>

//           <Link to="/shop">VIEW ALL →</Link>
//         </div>

//         <div className="product-grid">
//           {products.map((product) => (
//             <ProductCard key={product._id} product={product} />
//           ))}
//         </div>
//       </section>

//       {/* Philosophy Section */}
//       <section className="promo">
//         <div>
//           <small>OUR PHILOSOPHY</small>

//           <h2>
//             Less clutter.
//             <br />
//             More nature.
//           </h2>

//           <p>Simple formulas and everyday essentials.</p>

//           <Link className="green-btn" to="/shop">
//             SHOP NOW
//           </Link>
//         </div>

//         <img
//           src="https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1000&q=80"
//           alt="Natural skincare products"
//         />
//       </section>

//       {/* Benefits */}
//       <section className="benefits">
//         <div>
//           <strong>✓</strong>
//           <b>Natural inspired</b>
//           <span>Thoughtful ingredients</span>
//         </div>

//         <div>
//           <strong>♢</strong>
//           <b>Easy routines</b>
//           <span>Simple everyday care</span>
//         </div>

//         <div>
//           <strong>◌</strong>
//           <b>Made with care</b>
//           <span>Quality focused</span>
//         </div>

//         <div>
//           <strong>↗</strong>
//           <b>Fast delivery</b>
//           <span>Across India</span>
//         </div>

//         <div>
//           <strong>♡</strong>
//           <b>Customer first</b>
//           <span>Friendly support</span>
//         </div>
//       </section>

//       {/* About */}
//       <section className="about-section" id="about">
//         <div>
//           <small>ABOUT NADUVAN</small>
//           <h2>Nature-inspired care for everyday life.</h2>
//           <p>Naduvan brings together simple, thoughtful personal-care essentials designed for daily routines. We focus on clean presentation, dependable quality and products that are easy to understand and use.</p>
//           <p>From face care to hair and body care, every collection is created to make self-care feel calm, practical and natural.</p>
//         </div>
//         <div className="about-points">
//           <div><b>01</b><span>Thoughtful everyday essentials</span></div>
//           <div><b>02</b><span>Simple product choices and sizes</span></div>
//           <div><b>03</b><span>Customer-first shopping experience</span></div>
//         </div>
//       </section>

//       {/* Services */}
//       <section className="services-section" id="services">
//         <small>OUR SERVICES</small>
//         <h2>Care beyond the product.</h2>
//         <div className="service-grid">
//           <article><b>Easy Shopping</b><p>Clear categories, multiple sizes and simple checkout.</p></article>
//           <article><b>Secure Ordering</b><p>COD and online-payment order options with order tracking.</p></article>
//           <article><b>Fast Delivery</b><p>₹50 standard delivery, with free shipping from ₹1000.</p></article>
//         </div>
//       </section>

//       {/* Why Choose Us */}
//       <section className="why-section" id="why-choose-us">
//         <div>
//           <small>WHY CHOOSE US</small>
//           <h2>Simple reasons to make Naduvan part of your routine.</h2>
//         </div>
//         <div className="why-grid">
//           <article><strong>01</strong><b>Natural-inspired range</b><p>Everyday personal care with a nature-led approach.</p></article>
//           <article><strong>02</strong><b>Flexible quantities</b><p>Choose 100ml, 200ml or 500ml where available.</p></article>
//           <article><strong>03</strong><b>Transparent pricing</b><p>See the selected quantity and exact price before adding to cart.</p></article>
//           <article><strong>04</strong><b>Easy delivery</b><p>Standard ₹50 delivery and free shipping at ₹1000+.</p></article>
//         </div>
//       </section>

//       {/* Reviews */}
//       <section className="reviews" id="testimonials">
//         <small>WHAT CUSTOMERS SAY</small>

//         <h2>Loved by our customers</h2>

//         <div className="review-grid">
//           {reviews.map((review) => (
//             <article key={review.name}>
//               <div className="quote">“</div>

//               <p>{review.text}</p>

//               <b>{review.name}</b>
//               <span>{review.city}</span>
//             </article>
//           ))}
//         </div>
//       </section>

//       <section className="contact-strip" id="contact">
//         <small>CONTACT US</small>
//         <h2>Need help choosing a product?</h2>
//         <p>Reach out to Naduvan and we’ll be happy to help with products, sizes and orders.</p>
//         <a className="green-btn" href="mailto:hello@naduvanindustry.com">EMAIL US →</a>
//       </section>
//     </Layout>
//   );
// }


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api";
import { categories } from "../data";
import { Layout, ProductCard } from "../components";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products/featured");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layout>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-copy">
          <small>NATURAL • SIMPLE • THOUGHTFUL</small>

          <h1>
            Everyday care,
            <br />
            <em>naturally.</em>
          </h1>

          <p>
            Clean, uncomplicated personal care inspired by nature and made
            for modern routines.
          </p>

          <Link className="green-btn" to="/shop">
            EXPLORE COLLECTION →
          </Link>
        </div>

        <img
          src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85"
          alt="Natural personal care products"
        />
      </section>


      {/* Categories Section */}
      <section className="categories">
        {categories.slice(0, 8).map(([name, image]) => (
          <Link
            className="category-card"
            to={`/shop?category=${encodeURIComponent(name)}`}
            key={name}
          >
            <img src={image} alt={name} />
            <b>{name}</b>
          </Link>
        ))}
      </section>


      {/* Best Sellers */}
      <section className="section">
        <div className="section-heading">
          <div>
            <small>CURATED FOR YOU</small>
            <h2>Best Sellers</h2>
          </div>

          <Link to="/shop">
            VIEW ALL →
          </Link>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      </section>


      {/* Philosophy Section */}
      <section className="promo">
        <div>
          <small>OUR PHILOSOPHY</small>

          <h2>
            Less clutter.
            <br />
            More nature.
          </h2>

          <p>
            Simple formulas and everyday essentials.
          </p>

          <Link className="green-btn" to="/shop">
            SHOP NOW
          </Link>
        </div>

        <img
          src="https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1000&q=80"
          alt="Natural skincare products"
        />
      </section>


      {/* Benefits */}
      <section className="benefits">

        <div>
          <strong>✓</strong>
          <b>Natural inspired</b>
          <span>Thoughtful ingredients</span>
        </div>

        <div>
          <strong>♢</strong>
          <b>Easy routines</b>
          <span>Simple everyday care</span>
        </div>

        <div>
          <strong>◌</strong>
          <b>Made with care</b>
          <span>Quality focused</span>
        </div>

        <div>
          <strong>↗</strong>
          <b>Fast delivery</b>
          <span>Across India</span>
        </div>

        <div>
          <strong>♡</strong>
          <b>Customer first</b>
          <span>Friendly support</span>
        </div>

      </section>


      {/* About */}
      <section className="about-section" id="about">

        <div>
          <small>ABOUT NADUVAN</small>

          <h2>
            Nature-inspired care for everyday life.
          </h2>

          <p>
            Naduvan brings together simple, thoughtful personal-care
            essentials designed for daily routines. We focus on clean
            presentation, dependable quality and products that are easy
            to understand and use.
          </p>

          <p>
            From face care to hair and body care, every collection is
            created to make self-care feel calm, practical and natural.
          </p>
        </div>

        <div className="about-points">

          <div>
            <b>01</b>
            <span>Thoughtful everyday essentials</span>
          </div>

          <div>
            <b>02</b>
            <span>Simple product choices and sizes</span>
          </div>

          <div>
            <b>03</b>
            <span>Customer-first shopping experience</span>
          </div>

        </div>

      </section>

    </Layout>
  );
}
