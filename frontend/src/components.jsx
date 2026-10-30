import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  // Search,
  ShoppingBag,
  User,
  Leaf,
  ArrowRight,
  Instagram,
  Facebook,
} from "lucide-react";

/* =========================
   CART FUNCTIONS
========================= */

export function cartCount() {
  const cart = JSON.parse(
    localStorage.getItem("naduvan_cart") || "[]"
  );

  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function addToCart(product, selectedVariant) {
  const cart = JSON.parse(localStorage.getItem("naduvan_cart") || "[]");
  const variant = selectedVariant || product.variants?.[0] || { size: "100ml", price: product.price };
  const key = `${product._id}-${variant.size}`;
  const existingIndex = cart.findIndex(item => item.cartKey === key);

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      ...product,
      productId: product._id,
      cartKey: key,
      size: variant.size,
      price: Number(variant.price),
      quantity: 1,
    });
  }

  localStorage.setItem("naduvan_cart", JSON.stringify(cart));
}


/* =========================
   HEADER
========================= */

// export function Header() {
//   const [searchQuery, setSearchQuery] = useState("");

//   const navigate = useNavigate();

//   const count = cartCount();

//   const handleSearch = (event) => {
//     event.preventDefault();

//     navigate(
//       `/shop?search=${encodeURIComponent(searchQuery)}`
//     );
//   };

//   return (
//     <>
//       {/* Top Bar */}
//       <div className="topbar">
//         FREE SHIPPING ON ORDERS ABOVE ₹1000
//         &nbsp; • &nbsp;
//         NATURAL CARE, MADE SIMPLE
//       </div>

//       {/* Main Header */}
//       <header className="header">
//         {/* Brand */}
//         <Link className="brand" to="/">
//           <Leaf className="brand-leaf" />

//           <div>
//             <strong>NADUVAN</strong>
//             <small>NATURAL CARE</small>
//           </div>
//         </Link>

//         {/* Search */}
//         {/* <form
//           className="searchbox"
//           onSubmit={handleSearch}
//         > */}
//           {/* <Search size={16} /> */}

//           {/* <input
//             type="text"
//             placeholder="Search products..."
//             value={searchQuery}
//             onChange={(event) =>
//               setSearchQuery(event.target.value)
//             }
//           /> */}

//           {/* <select defaultValue="all">
//             <option value="all">All</option>
//             <option value="Face Care">Face Care</option>
//             <option value="Hair Care">Hair Care</option>
//           </select>
//         </form> */}

//         {/* Header Icons */}
//         <div className="header-icons">
//           <Link
//             to="/admin/login"
//             title="Admin"
//           >
//             <User size={18} />
//           </Link>

//           <Link
//             className="cart-icon"
//             to="/checkout"
//           >
//             <ShoppingBag size={19} />
//             <span>{count}</span>
//           </Link>
//         </div>
//       </header>

//       {/* Navigation */}
//       <nav className="nav">
//         <Link
//           className="category-btn"
//           to="/shop"
//         >
//           SHOP ALL
//           <ArrowRight size={14} />
//         </Link>

//         <div className="navlinks">
//           <Link to="/">HOME</Link>
//           <Link to="/shop">SHOP</Link>
//           <Link to="/gallery">GALLERY</Link>

//           <a href="#reviews">REVIEWS</a>
//           <a href="#about">ABOUT</a>
//         </div>
//       </nav>
//     </>
//   );
// }

/* =========================
   HEADER
========================= */

export function Header() {
  const count = cartCount();

  return (
    <>
      {/* Top Bar */}
      <div className="topbar">
        FREE SHIPPING ON ORDERS ABOVE ₹1000
        <span>•</span>
        NATURAL CARE, MADE SIMPLE
      </div>

      {/* Main Header */}
      <header className="header">

        {/* Brand / Logo */}
        <Link className="brand" to="/">
          <Leaf className="brand-leaf" size={30} />

          <div className="brand-text">
            <strong>NADUVAN</strong>
            <small>NATURAL CARE</small>
          </div>
        </Link>

        {/* Center Navigation */}
        <nav className="nav">

          <Link
            className="category-btn"
            to="/shop"
          >
            SHOP ALL
            <ArrowRight size={14} />
          </Link>

          <div className="navlinks">
            <Link to="/">HOME</Link>

            <a href="/#about">ABOUT</a>

            <Link to="/shop">SHOP</Link>

            <Link to="/gallery">GALLERY</Link>

            <a href="/services">OUR SERVICES</a>

            <a href="/whychooseus">WHY CHOOSE US</a>

            <a href="/testimonials">TESTIMONIAL</a>

            <a href="/contact">CONTACT US</a>
          </div>

        </nav>

        {/* Right Side Icons */}
        <div className="header-icons">

          {/* Admin */}
          {/* <Link
            to="/admin/login"
            title="Admin"
            className="header-icon"
          >
            <User size={19} />
          </Link> */}

          {/* Customer profile / order history */}
          <Link to="/account" title="My account and orders" className="header-icon">
            <User size={19} />
          </Link>

          {/* Cart */}
          <Link
            className="cart-icon"
            to="/checkout"
            title="Cart"
          >
            <ShoppingBag size={20} />

            <span>
              {count}
            </span>
          </Link>

        </div>

      </header>
    </>
  );
}

/* =========================
   FOOTER
========================= */

export function Footer() {
  return (
    <footer
      className="footer"
      id="about"
    >
      {/* Brand */}
      <div>
        <h2>NADUVAN</h2>

        <p>
          Thoughtfully made natural personal care
          for everyday rituals.
        </p>

        <div className="socials">
          <Instagram size={16} />
          <Facebook size={16} />
        </div>
      </div>

      {/* Shop */}
      <div>
        <h4>SHOP</h4>

        <p>
          <Link to="/shop">Face Care</Link>
        </p>

        <p>
          <Link to="/shop">Hair Care</Link>
        </p>

        <p>
          <Link to="/shop">Body Care</Link>
        </p>
      </div>

      {/* Help */}
      <div>
        <h4>HELP</h4>

        <p>Shipping</p>
        <p>Returns</p>
        <p>Contact</p>
      </div>

      {/* Contact */}
      <div>
        <h4>CONTACT</h4>

        <p>Coimbatore, Tamil Nadu</p>
        <p>hello@naduvanindustry.com</p>
      </div>

      {/* Newsletter */}
      <div>
        <h4>NEWSLETTER</h4>

        <p>Get new product updates.</p>

        <div className="newsletter">
          <input
            type="email"
            placeholder="Email address"
          />

          <button type="button">→</button>
        </div>
      </div>

      {/* Copyright */}
      <div className="copyright">
        © 2026 Naduvan Natural Care.
        All rights reserved.
      </div>
    </footer>
  );
}

/* =========================
   LAYOUT
========================= */

export function Layout({ children }) {
  return (
    <>
      <Header />

      {children}

      <Footer />
    </>
  );
}

/* =========================
   PRODUCT CARD
========================= */

export function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const images = (product.images?.length ? product.images : [product.image]).filter(Boolean).slice(0, 4);
  const variants = product.variants?.length
    ? product.variants
    : [{ size: "100ml", price: product.price, originalPrice: product.price }];
  const [selectedSize, setSelectedSize] = useState(variants[0].size);
  const [imageIndex, setImageIndex] = useState(0);
  const selectedVariant = variants.find(v => v.size === selectedSize) || variants[0];
  const sellingPrice = Number(selectedVariant.offerPrice ?? selectedVariant.price ?? product.price ?? 0);
  const originalPrice = Number(selectedVariant.originalPrice ?? sellingPrice);

  const handleAddToCart = () => {
    addToCart(product, { ...selectedVariant, price: sellingPrice });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="product-card">
      <div className="product-image-wrap product-slider">
        <img src={images[imageIndex] || product.image} alt={`${product.name} view ${imageIndex + 1}`} />
        {images.length > 1 && (
          <>
            <button className="slider-arrow slider-prev" type="button" onClick={() => setImageIndex(i => (i - 1 + images.length) % images.length)} aria-label="Previous image">‹</button>
            <button className="slider-arrow slider-next" type="button" onClick={() => setImageIndex(i => (i + 1) % images.length)} aria-label="Next image">›</button>
            <div className="slider-dots">
              {images.map((_, i) => <button key={i} type="button" className={i === imageIndex ? "active" : ""} onClick={() => setImageIndex(i)} aria-label={`View ${i + 1}`} />)}
            </div>
          </>
        )}
      </div>
      <div className="product-info">
        <div className="product-prices product-prices-top">
          {originalPrice > sellingPrice && <span className="original-price">₹{originalPrice.toFixed(0)}</span>}
          <strong className="offer-price">₹{sellingPrice.toFixed(0)}</strong>
        </div>
        <span>{product.category}</span>
        <h3>{product.name}</h3>
        <div className="variant-row">
          <label htmlFor={`variant-${product._id}`}>Size</label>
          <select id={`variant-${product._id}`} value={selectedSize} onChange={e => setSelectedSize(e.target.value)}>
            {variants.map(variant => <option key={variant.size} value={variant.size}>{variant.size}</option>)}
          </select>
        </div>
        <small className="variant-price-note">{selectedVariant.size} selected</small>
        <button onClick={handleAddToCart}>{added ? "ADDED ✓" : "ADD TO CART"}</button>
      </div>
    </article>
  );
}
