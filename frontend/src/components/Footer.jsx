import React from "react";
export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-brand">
        <h2>♧ bbbb</h2>
        <p>We bring you the finest natural skincare and haircare products, crafted with love and care.</p>
        <div className="socials">●　◎　▶　◉</div>
      </div>
      <div>
        <h4>QUICK LINKS</h4>
        <p>Home</p><p>Shop</p><p>Collections</p><p>Gallery</p><p>About Us</p><p>Contact Us</p>
      </div>
      <div>
        <h4>CUSTOMER CARE</h4>
        <p>My Account</p><p>Order Tracking</p><p>Wishlist</p><p>Returns & Refunds</p><p>Shipping Policy</p><p>FAQs</p>
      </div>
      <div>
        <h4>INFORMATION</h4>
        <p>About Us</p><p>Privacy Policy</p><p>Terms & Conditions</p><p>Disclaimer</p><p>Sitemap</p>
      </div>
      <div>
        <h4>NEWSLETTER</h4>
        <p>Subscribe to get updates on new arrivals & offers.</p>
        <div className="newsletter"><input placeholder="Enter your email" /><button>→</button></div>
      </div>
      <div className="copyright">Naduvan Industry. All Rights Reserved.</div>
    </footer>
  );
}
