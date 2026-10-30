// import React, { useEffect, useRef, useState } from "react";
// import api from "../api";
// import { Layout } from "../components";

// function HoverVideo({ item }) {
//   const videoRef = useRef(null);
//   const play = () => videoRef.current?.play();
//   const stop = () => { if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; } };
//   const price = Number(item.variants?.[0]?.offerPrice ?? item.variants?.[0]?.price ?? 0);
//   return <div className="gallery-card">
//     <video ref={videoRef} src={item.videoUrl} muted loop playsInline onMouseEnter={play} onMouseLeave={stop} className="gallery-video" />
//     <div className="gallery-product-info"><small>{item.category}</small><h3>{item.name}</h3>{price > 0 && <p className="gallery-price">₹{price.toFixed(0)}</p>}</div>
//   </div>;
// }

// export default function Gallery() {
//   const [gallery, setGallery] = useState([]);
//   useEffect(() => { api.get("/gallery").then(res => setGallery(res.data)).catch(err => console.error("Failed to load gallery:", err)); }, []);
//   return <Layout>
//     <section className="page-title"><small>VISUAL JOURNAL</small><h1>Gallery</h1><p>A glimpse into the Naduvan world.</p></section>
//     <section className="gallery-section">
//       {gallery.length ? <div className="gallery-grid gallery-large">{gallery.map(item => <HoverVideo key={item._id} item={item} />)}</div> : <div className="admin-empty">No product videos added yet.</div>}
//     </section>
//   </Layout>;
// }



// import React, { useEffect, useRef, useState } from "react";
// import api from "../api";
// import { Layout } from "../components";

// import './Gallery.css';

// function HoverVideo({ item }) {
//   const videoRef = useRef(null);
//   const [variantIndex, setVariantIndex] = useState(0);

//   const variants =
//     Array.isArray(item.variants) && item.variants.length
//       ? item.variants
//       : [
//           {
//             size: "100ml",
//             price: item.price || 0,
//             offerPrice: item.price || 0,
//           },
//         ];

//   const variant = variants[variantIndex] || variants[0];

//   const sellingPrice = Number(
//     variant?.offerPrice ?? variant?.price ?? item.price ?? 0
//   );

//   const originalPrice = Number(
//     variant?.originalPrice ?? sellingPrice
//   );

//   const hasOffer = originalPrice > sellingPrice;

//   const play = () => {
//     videoRef.current?.play().catch(() => {});
//   };

//   const stop = () => {
//     if (videoRef.current) {
//       videoRef.current.pause();
//       videoRef.current.currentTime = 0;
//     }
//   };

//   const handleAddToCart = () => {
//     const cart = JSON.parse(
//       localStorage.getItem("naduvan_cart") || "[]"
//     );

//     const selected = {
//       ...item,
//       productId: item._id,
//       cartKey: `${item._id}-${variant.size}`,
//       size: variant.size,
//       price: sellingPrice,
//       quantity: 1,
//     };

//     const existingIndex = cart.findIndex(
//       (cartItem) => cartItem.cartKey === selected.cartKey
//     );

//     if (existingIndex >= 0) {
//       cart[existingIndex].quantity += 1;
//     } else {
//       cart.push(selected);
//     }

//     localStorage.setItem(
//       "naduvan_cart",
//       JSON.stringify(cart)
//     );

//     alert(`${item.name} (${variant.size}) added to cart`);
//   };

//   return (
//     <article className="gallery-card">

//       {/* VIDEO */}
//       <div className="gallery-video-wrap">
//         {item.videoUrl ? (
//           <video
//             ref={videoRef}
//             src={item.videoUrl}
//             muted
//             loop
//             playsInline
//             preload="metadata"
//             onMouseEnter={play}
//             onMouseLeave={stop}
//             className="gallery-video"
//           />
//         ) : (
//           <div className="gallery-no-video">
//             No Demo Video
//           </div>
//         )}
//       </div>

//       {/* PRODUCT INFO */}
//       <div className="gallery-product-info">

//         <small>{item.category}</small>

//         <h3>{item.name}</h3>

//         {/* SIZE */}
//         <div className="gallery-size-row">
//           <label htmlFor={`gallery-size-${item._id}`}>
//             Size
//           </label>

//           <select
//             id={`gallery-size-${item._id}`}
//             value={variantIndex}
//             onChange={(e) =>
//               setVariantIndex(Number(e.target.value))
//             }
//           >
//             {variants.map((variantItem, index) => (
//               <option
//                 key={`${variantItem.size}-${index}`}
//                 value={index}
//               >
//                 {variantItem.size}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* PRICE */}
//         <div className="gallery-price-row">

//           {hasOffer && (
//             <span className="gallery-original-price">
//               ₹{originalPrice.toFixed(0)}
//             </span>
//           )}

//           <span className="gallery-price">
//             ₹{sellingPrice.toFixed(0)}
//           </span>

//         </div>

//         {hasOffer && (
//           <small className="gallery-offer">
//             OFFER PRICE
//           </small>
//         )}

//         {/* ADD TO CART */}
//         <button
//           type="button"
//           className="gallery-add-cart"
//           onClick={handleAddToCart}
//         >
//           Add to Cart
//         </button>

//       </div>
//     </article>
//   );
// }

// export default function Gallery() {
//   const [gallery, setGallery] = useState([]);

//   useEffect(() => {
//     api
//       .get("/gallery")
//       .then((res) => setGallery(res.data))
//       .catch((err) =>
//         console.error("Failed to load gallery:", err)
//       );
//   }, []);

//   return (
//     <Layout>

//       <section className="page-title">
//         <small>VISUAL JOURNAL</small>
//         <h1>Gallery</h1>
//         <p>
//           Explore our products through demo videos.
//         </p>
//       </section>

//       <section className="gallery-section">

//         {gallery.length ? (
//           <div className="gallery-grid gallery-large">
//             {gallery.map((item) => (
//               <HoverVideo
//                 key={item._id}
//                 item={item}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="admin-empty">
//             No product videos added yet.
//           </div>
//         )}

//       </section>

//     </Layout>
//   );
// }



import React, { useEffect, useRef, useState } from "react";
import api from "../api";
import { Layout } from "../components";

import "./Gallery.css";

function HoverVideo({ item }) {
  const videoRef = useRef(null);
  const [variantIndex, setVariantIndex] = useState(0);

  // Backend-la irundhu variants varum
  const variants =
    Array.isArray(item.variants) && item.variants.length > 0
      ? item.variants
      : [
          {
            size: "100ml",
            price: item.price || 0,
            originalPrice: item.originalPrice || item.price || 0,
            offerPrice: item.offerPrice || item.price || 0,
          },
        ];

  const variant = variants[variantIndex] || variants[0];

  const sellingPrice = Number(
    variant?.offerPrice ??
      variant?.price ??
      item.offerPrice ??
      item.price ??
      0
  );

  const originalPrice = Number(
    variant?.originalPrice ??
      item.originalPrice ??
      sellingPrice
  );

  const hasOffer = originalPrice > sellingPrice;

  // Video play
  const play = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  // Video stop
  const stop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Add to cart
  const handleAddToCart = () => {
    const cart = JSON.parse(
      localStorage.getItem("naduvan_cart") || "[]"
    );

    const selected = {
      ...item,

      productId: item._id,

      cartKey: `${item._id}-${variant.size}`,

      size: variant.size,

      price: sellingPrice,

      quantity: 1,
    };

    const existingIndex = cart.findIndex(
      (cartItem) => cartItem.cartKey === selected.cartKey
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(selected);
    }

    localStorage.setItem(
      "naduvan_cart",
      JSON.stringify(cart)
    );

    alert(
      `${item.name} (${variant.size}) added to cart`
    );
  };

  return (
    <article className="gallery-card">

      {/* VIDEO */}
      <div className="gallery-video-wrap">
        {item.videoUrl ? (
          <video
            ref={videoRef}
            src={item.videoUrl}
            muted
            loop
            playsInline
            preload="metadata"
            onMouseEnter={play}
            onMouseLeave={stop}
            className="gallery-video"
          />
        ) : (
          <div className="gallery-no-video">
            No Demo Video
          </div>
        )}
      </div>

      {/* PRODUCT INFO */}
      <div className="gallery-product-info">

        {/* CATEGORY */}
        {item.category && (
          <small>{item.category}</small>
        )}

        {/* PRODUCT NAME */}
        <h3>{item.name}</h3>

        {/* SIZE */}
        <div className="gallery-size-row">

          <label htmlFor={`gallery-size-${item._id}`}>
            Size
          </label>

          <select
            id={`gallery-size-${item._id}`}
            value={variantIndex}
            onChange={(e) =>
              setVariantIndex(Number(e.target.value))
            }
          >
            {variants.map((variantItem, index) => (
              <option
                key={`${variantItem.size}-${index}`}
                value={index}
              >
                {variantItem.size}
              </option>
            ))}
          </select>

        </div>

        {/* PRICE */}
        <div className="gallery-price-row">

          {hasOffer && (
            <span className="gallery-original-price">
              ₹{originalPrice.toFixed(0)}
            </span>
          )}

          <span className="gallery-price">
            ₹{sellingPrice.toFixed(0)}
          </span>

        </div>

        {/* OFFER */}
        {hasOffer && (
          <small className="gallery-offer">
            OFFER PRICE
          </small>
        )}

        {/* ADD TO CART */}
        <button
          type="button"
          className="gallery-add-cart"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>

      </div>
    </article>
  );
}


export default function Gallery() {

  const [gallery, setGallery] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ================================
  // GET GALLERY DATA FROM BACKEND
  // ================================

  useEffect(() => {

    const fetchGallery = async () => {

      try {

        setLoading(true);

        const response = await api.get("/gallery");

        console.log("Gallery backend data:", response.data);

        setGallery(response.data);

      } catch (error) {

        console.error(
          "Failed to load gallery:",
          error
        );

        setError(
          "Unable to load gallery. Please try again."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchGallery();

  }, []);


  return (
    <Layout>

      {/* PAGE TITLE */}
      <section className="page-title">

        <small>VISUAL JOURNAL</small>

        <h1>Gallery</h1>

        <p>
          Explore our products through demo videos.
        </p>

      </section>


      {/* GALLERY */}
      <section className="gallery-section">

        {/* LOADING */}
        {loading && (
          <div className="admin-empty">
            Loading gallery...
          </div>
        )}


        {/* ERROR */}
        {!loading && error && (
          <div className="admin-empty">
            {error}
          </div>
        )}


        {/* DATA */}
        {!loading && !error && gallery.length > 0 && (

          <div className="gallery-grid gallery-large">

            {gallery.map((item) => (

              <HoverVideo
                key={item._id}
                item={item}
              />

            ))}

          </div>

        )}


        {/* NO DATA */}
        {!loading && !error && gallery.length === 0 && (

          <div className="admin-empty">
            No product videos added yet.
          </div>

        )}

      </section>

    </Layout>
  );
}

