import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import api from "../api";
import { Layout, ProductCard } from "../components";

export default function Shop() {
  const [params] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(
    params.get("category") || "All Products"
  );
  const [search, setSearch] = useState(params.get("search") || "");

  useEffect(() => {
    api
      .get("/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
      });
  }, []);

  const categories = [
    "All Products",
    "Face Care",
    "Hair Care",
    "Body Care",
    "Face Masks",
    "Perfumes",
    "Gift Sets",
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      category === "All Products" || product.category === category;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      {/* Page Header */}
      <section className="page-title">
        <small>THE COLLECTION</small>

        <h1>Shop Natural Care</h1>

        <p>Simple products for everyday routines.</p>
      </section>

      {/* Shop Area */}
      <section className="shop-area">
        {/* Categories */}
        <aside>
          <b>Categories</b>

          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "selected" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </aside>

        {/* Products */}
        <main>
          <div className="shop-toolbar">
            <span>{filteredProducts.length} products</span>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Filter by name..."
            />
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        </main>
      </section>
    </Layout>
  );
}