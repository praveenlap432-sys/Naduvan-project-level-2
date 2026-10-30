import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  UserRound,
  ShoppingCart,
  Menu,
} from "lucide-react";

export default function Header({ cartCount = 0 }) {
  return (
    <header className="header">

      {/* Logo */}
      <Link to="/" className="brand">
        <div className="brand-leaf">♧</div>

        <div>
          <strong>NADUVAN</strong>
          <small>INDUSTRY</small>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="nav">
        <button className="category-btn">
          <Menu size={17} />
          SHOP BY CATEGORY
          <span>→</span>
        </button>

        <div className="navlinks">
          <Link to="/">HOME</Link>
          <Link to="/shop">SHOP</Link>
          <Link to="/shop">COLLECTIONS⌄</Link>
          <Link to="/gallery">GALLERY</Link>
          <a href="#about">ABOUT US</a>
          <a href="#blog">BLOG</a>
          <a href="#contact">CONTACT US</a>
        </div>
      </nav>

      {/* Header Icons */}
      <div className="header-icons">
        <Link to="/wishlist">
          <Heart size={21} />
        </Link>

        <Link to="/login">
          <UserRound size={21} />
        </Link>

        <Link to="/checkout" className="cart-icon">
          <ShoppingCart size={22} />
          <span>{cartCount}</span>
        </Link>

        <b>₹0.00</b>
      </div>

    </header>
  );
}