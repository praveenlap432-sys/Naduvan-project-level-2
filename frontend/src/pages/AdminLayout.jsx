import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  BarChart3,
  Package,
  LogOut,
  Store,
} from "lucide-react";

export default function AdminLayout({ children, title, description }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("naduvan_admin_token");
    navigate("/admin/login");
  };

  const links = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/orders", label: "Customer Orders", icon: ShoppingBag },
    { to: "/admin/reports", label: "Reports", icon: BarChart3 },
    { to: "/admin/products", label: "Products", icon: Package },
  ];

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark">N</div>
          <div>
            <strong>NADUVAN</strong>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <nav className="admin-side-nav">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `admin-side-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <NavLink to="/" className="admin-side-link">
            <Store size={17} />
            <span>View Store</span>
          </NavLink>

          <button className="admin-side-link admin-logout" onClick={logout}>
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-mobile-header">
          <div>
            <strong>NADUVAN</strong>
            <span>ADMIN</span>
          </div>
          <button onClick={logout}>Logout</button>
        </header>

        <main className="admin-main">
          <div className="admin-heading">
            <small>STORE MANAGEMENT</small>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
