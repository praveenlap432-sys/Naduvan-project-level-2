import React, { useEffect, useState } from "react";
import { Edit3, Plus, Power, Trash2, X, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api, { adminHeaders } from "../api";
import AdminLayout from "./AdminLayout";

const makeVariant = (size = "100ml") => ({ size, buyingPrice: "", originalPrice: "", offerPrice: "" });

const emptyForm = {
  name: "",
  category: "Face Care",
  price: "",
  variants: [makeVariant("100ml"), makeVariant("200ml"), makeVariant("500ml")],
  images: ["", "", "", ""],
  videoUrl: "",
  description: "",
  featured: false,
  enabled: true,
};

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/products", adminHeaders());
      setProducts(res.data);
    } catch {
      localStorage.removeItem("naduvan_admin_token");
      navigate("/admin/login");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadProducts(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, variants: [makeVariant("100ml"), makeVariant("200ml"), makeVariant("500ml")], images: ["", "", "", ""] });
    setShowForm(true);
  };

  const openEdit = product => {
    const oldVariants = product.variants?.length ? product.variants : [{ size: "100ml", price: product.price }];
    const variants = oldVariants.map(v => ({
      size: v.size,
      buyingPrice: v.buyingPrice ?? "",
      originalPrice: v.originalPrice ?? v.price ?? "",
      offerPrice: v.offerPrice ?? v.price ?? "",
    }));
    const images = (product.images?.length ? product.images : [product.image]).filter(Boolean).slice(0, 4);
    while (images.length < 4) images.push("");
    setEditing(product);
    setForm({
      name: product.name || "",
      category: product.category || "General",
      price: product.price ?? "",
      variants,
      images,
      videoUrl: product.videoUrl || "",
      description: product.description || "",
      featured: Boolean(product.featured),
      enabled: product.enabled !== false,
    });
    setShowForm(true);
  };

  const change = e => {
    const { name, value, type, checked } = e.target;
    setForm(current => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const changeImage = (index, value) => setForm(current => ({ ...current, images: current.images.map((x, i) => i === index ? value : x) }));
  const changeVariant = (index, field, value) => setForm(current => ({
    ...current,
    variants: current.variants.map((v, i) => i === index ? { ...v, [field]: value } : v)
  }));

  const addVariant = () => setForm(current => ({ ...current, variants: [...current.variants, makeVariant("")] }));
  const removeVariant = index => setForm(current => ({ ...current, variants: current.variants.filter((_, i) => i !== index) }));

  const save = async e => {
    e.preventDefault();
    try {
      setSaving(true);
      const cleanVariants = form.variants.filter(v => v.size.trim()).map(v => ({
        size: v.size.trim(),
        buyingPrice: Number(v.buyingPrice || 0),
        originalPrice: Number(v.originalPrice || v.offerPrice || 0),
        offerPrice: Number(v.offerPrice || v.originalPrice || 0),
      }));
      const firstOffer = cleanVariants[0]?.offerPrice || Number(form.price || 0);
      const payload = {
        name: form.name,
        category: form.category,
        price: firstOffer,
        variants: cleanVariants,
        images: form.images.filter(Boolean).slice(0, 4),
        image: form.images.find(Boolean) || "",
        videoUrl: form.videoUrl,
        description: form.description,
        featured: form.featured,
        enabled: form.enabled,
      };
      const res = editing
        ? await api.put(`/admin/products/${editing._id}`, payload, adminHeaders())
        : await api.post("/admin/products", payload, adminHeaders());
      setProducts(current => editing ? current.map(p => p._id === editing._id ? res.data : p) : [res.data, ...current]);
      setShowForm(false);
    } catch (error) {
      alert(error.response?.data?.message || "Unable to save product");
    } finally { setSaving(false); }
  };

  const toggle = async id => {
    try {
      const res = await api.patch(`/admin/products/${id}/toggle`, {}, adminHeaders());
      setProducts(current => current.map(p => p._id === id ? res.data : p));
    } catch (error) { alert(error.response?.data?.message || "Unable to change product visibility"); }
  };

  const remove = async id => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await api.delete(`/admin/products/${id}`, adminHeaders());
      setProducts(current => current.filter(p => p._id !== id));
    } catch (error) { alert(error.response?.data?.message || "Unable to delete product"); }
  };

  const baseVariant = p => p.variants?.[0] || { buyingPrice: 0, offerPrice: p.price || 0, originalPrice: p.price || 0 };

  return (
    <AdminLayout title="Products" description="Add, edit, hide or delete products shown in your store.">
      <section className="admin-panel">
        <div className="admin-panel-head">
          <div><small>CATALOG</small><h2>{products.length} Products</h2></div>
          <div className="admin-head-actions">
            <button className="admin-outline-btn" onClick={() => setShowSummary(current => !current)}><BarChart3 size={14} /> {showSummary ? "Hide Summary" : "Product Summary"}</button>
            <button className="green-btn" onClick={openAdd}><Plus size={15} /> Add Product</button>
          </div>
        </div>
        {showSummary && !loading && (
          <div className="product-summary-box">
            <div className="product-summary-head">
              <div><small>PRODUCT SUMMARY</small><h3>{products.length} products in catalog</h3></div>
              <span>Buying → Selling → Profit</span>
            </div>
            {products.length === 0 ? <div className="admin-empty">No products found.</div> : (
              <div className="admin-table-wrap">
                <table className="admin-table product-summary-table">
                  <thead><tr><th>Product</th><th>Size</th><th>External Buying Price</th><th>Current Selling Price</th><th>Profit</th></tr></thead>
                  <tbody>
                    {products.flatMap(product => {
                      const variants = product.variants?.length ? product.variants : [{ size: "100ml", buyingPrice: 0, offerPrice: product.price, price: product.price }];
                      return variants.map((v, index) => {
                        const buying = Number(v.buyingPrice || 0);
                        const selling = Number(v.offerPrice ?? v.price ?? product.price ?? 0);
                        return <tr key={`${product._id}-${v.size}-${index}`}>
                          <td><b>{product.name}</b><small>{product.category}</small></td>
                          <td>{v.size}</td>
                          <td>₹{buying.toFixed(0)}</td>
                          <td><b>₹{selling.toFixed(0)}</b></td>
                          <td><strong className={selling - buying >= 0 ? "profit-positive" : "profit-negative"}>₹{(selling - buying).toFixed(0)}</strong></td>
                        </tr>;
                      });
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {loading ? <div className="admin-empty">Loading products...</div> : (
          <div className="admin-product-grid">
            {products.map(product => {
              const v = baseVariant(product);
              const profit = Number(v.offerPrice ?? v.price ?? product.price ?? 0) - Number(v.buyingPrice ?? 0);
              return <article className={`admin-product-card ${product.enabled ? "" : "disabled"}`} key={product._id}>
                <div className="admin-product-image">
                  <img src={(product.images?.[0] || product.image)} alt={product.name} />
                  <span className={product.enabled ? "enabled-badge" : "disabled-badge"}>{product.enabled ? "VISIBLE" : "HIDDEN"}</span>
                </div>
                <div className="admin-product-info">
                  <small>{product.category}</small><h3>{product.name}</h3>
                  <div className="admin-money-grid">
                    <div><span>Buying</span><b>₹{Number(v.buyingPrice || 0).toFixed(0)}</b></div>
                    <div><span>Selling</span><b>₹{Number(v.offerPrice ?? v.price ?? product.price ?? 0).toFixed(0)}</b></div>
                    <div><span>Profit</span><b>₹{profit.toFixed(0)}</b></div>
                  </div>
                  <div className="admin-variant-prices">
                    {(product.variants || []).map(x => <span key={x.size}>{x.size}: ₹{Number(x.offerPrice ?? x.price ?? 0).toFixed(0)}</span>)}
                  </div>
                  <div className="admin-product-actions">
                    <button onClick={() => openEdit(product)}><Edit3 size={14} /> Edit</button>
                    <button onClick={() => toggle(product._id)}><Power size={14} /> {product.enabled ? "Disable" : "Enable"}</button>
                    <button className="danger-text" onClick={() => remove(product._id)}><Trash2 size={14} /> Delete</button>
                  </div>
                </div>
              </article>;
            })}
          </div>
        )}
      </section>

      {showForm && <div className="admin-modal-backdrop" onMouseDown={() => setShowForm(false)}>
        <div className="admin-modal product-form-modal" onMouseDown={e => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setShowForm(false)}><X size={18} /></button>
          <small>{editing ? "EDIT PRODUCT" : "NEW PRODUCT"}</small><h2>{editing ? "Edit Product" : "Add Product"}</h2>
          <form className="product-admin-form" onSubmit={save}>
            <label>Product Name<input name="name" value={form.name} onChange={change} required /></label>
            <label>Category<select name="category" value={form.category} onChange={change}>{["Face Care","Hair Care","Body Care","Natural Soaps","Face Masks","Perfumes","Gift Sets","General"].map(c => <option key={c}>{c}</option>)}</select></label>

            <div className="variant-admin-box full">
              <div><b>Quantity / ML / L Pricing</b><small>Each size can have its own buying, original and offer price.</small></div>
              <div className="variant-admin-table">
                <div className="variant-head"><span>Size</span><span>Buying Price</span><span>Original Price</span><span>Offer / Selling</span><span></span></div>
                {form.variants.map((v, index) => <div className="variant-row-admin" key={index}>
                  <input value={v.size} onChange={e => changeVariant(index, "size", e.target.value)} placeholder="100ml / 1L" required />
                  <input type="number" min="0" value={v.buyingPrice} onChange={e => changeVariant(index, "buyingPrice", e.target.value)} placeholder="Buying" required />
                  <input type="number" min="0" value={v.originalPrice} onChange={e => changeVariant(index, "originalPrice", e.target.value)} placeholder="MRP" required />
                  <input type="number" min="0" value={v.offerPrice} onChange={e => changeVariant(index, "offerPrice", e.target.value)} placeholder="Selling" required />
                  {form.variants.length > 1 && <button type="button" onClick={() => removeVariant(index)} className="remove-variant">×</button>}
                </div>)}
              </div>
              <button type="button" className="add-variant-btn" onClick={addVariant}>+ Add another size</button>
            </div>

            <div className="image-url-box full">
              <div><b>Product Images</b><small>Add up to 4 image URL paths: front, back, side and detail view.</small></div>
              <div className="image-url-grid">
                {form.images.map((url, i) => <label key={i}>Image {i + 1}<input value={url} onChange={e => changeImage(i, e.target.value)} placeholder="https://..." /></label>)}
              </div>
            </div>

            <label className="full">Video URL<input name="videoUrl" value={form.videoUrl} onChange={change} placeholder="https://.../product-video.mp4" /><small className="form-help">This video will automatically appear in the Gallery page.</small></label>
            <label className="full">Description<textarea name="description" value={form.description} onChange={change} rows="4" /></label>
            <div className="checkbox-row"><label><input type="checkbox" name="featured" checked={form.featured} onChange={change} /> Featured product</label><label><input type="checkbox" name="enabled" checked={form.enabled} onChange={change} /> Show in shopping page</label></div>
            <button className="green-btn full" disabled={saving}>{saving ? "Saving..." : editing ? "Save Changes" : "Add Product"}</button>
          </form>
        </div>
      </div>}
    </AdminLayout>
  );
}
