// import React, { useMemo, useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// export default function ProductCard({ product }) {
//   const images = useMemo(() => {
//     const list = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
//     if (!list.length && product.image) list.push(product.image);
//     return list.slice(0, 4);
//   }, [product]);

//   const variants = useMemo(() => {
//     if (Array.isArray(product.variants) && product.variants.length) return product.variants;
//     return [{ size: "100ml", price: product.price, originalPrice: product.price, offerPrice: product.price }];
//   }, [product]);

//   const [slide, setSlide] = useState(0);
//   const [variantIndex, setVariantIndex] = useState(0);
//   const variant = variants[variantIndex] || variants[0];
//   const selling = Number(variant?.offerPrice ?? variant?.price ?? product.price ?? 0);
//   const original = Number(variant?.originalPrice ?? selling);
//   const hasOffer = original > selling;

//   const move = (direction) => {
//     setSlide(current => (current + direction + images.length) % images.length);
//   };

//   const handleAdd = () => {
//     const cart = JSON.parse(localStorage.getItem("naduvan_cart") || "[]");
//     const selected = { ...product, productId: product._id, cartKey: `${product._id}-${variant.size}`, size: variant.size, price: selling, quantity: 1 };
//     const existing = cart.findIndex(item => item.cartKey === selected.cartKey);
//     if (existing >= 0) cart[existing].quantity += 1;
//     else cart.push(selected);
//     localStorage.setItem("naduvan_cart", JSON.stringify(cart));
//     alert(`${product.name} (${variant.size}) added to cart`);
//   };

//   return (
//     <article className="product-card">
//       <div className="product-image-wrap product-carousel">
//         {images.length > 0 && <img src={images[slide]} alt={`${product.name} view ${slide + 1}`} />}
//         {images.length > 1 && (
//           <>
//             <button type="button" className="product-slide-btn product-slide-prev" onClick={() => move(-1)} aria-label="Previous image">
//               <ChevronLeft size={16} />
//             </button>
//             <button type="button" className="product-slide-btn product-slide-next" onClick={() => move(1)} aria-label="Next image">
//               <ChevronRight size={16} />
//             </button>
//             <div className="product-slide-dots">
//               {images.map((_, index) => (
//                 <button key={index} type="button" className={index === slide ? "active" : ""} onClick={() => setSlide(index)} aria-label={`View image ${index + 1}`} />
//               ))}
//             </div>
//             <span className="product-slide-count">{slide + 1}/{images.length}</span>
//           </>
//         )}
//       </div>

//       {images.length > 1 && (
//         <div className="product-thumbnail-row" aria-label="Product image references">
//           {images.map((image, index) => (
//             <button
//               key={`${image}-${index}`}
//               type="button"
//               className={`product-thumbnail ${index === slide ? "active" : ""}`}
//               onClick={() => setSlide(index)}
//               aria-label={`Show product detail image ${index + 1}`}
//             >
//               <img src={image} alt={`${product.name} detail ${index + 1}`} />
//             </button>
//           ))}
//         </div>
//       )}

//       <div className="product-info">
//         <span>{product.category}</span>
//         <h3>{product.name}</h3>

//         <div className="product-size-row">
//           <label htmlFor={`size-${product._id}`}>Size</label>
//           <select id={`size-${product._id}`} value={variantIndex} onChange={e => setVariantIndex(Number(e.target.value))}>
//             {variants.map((item, index) => <option key={`${item.size}-${index}`} value={index}>{item.size}</option>)}
//           </select>
//         </div>

//         <div className="product-price-row">
//           {hasOffer && <span className="original-price">₹{original.toFixed(0)}</span>}
//           <span className="offer-price">₹{selling.toFixed(0)}</span>
//         </div>
//         {hasOffer && <small className="offer-label">OFFER PRICE</small>}

//         <button onClick={handleAdd}>Add to Cart</button>
//       </div>
//     </article>
//   );
// }



import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductCard({ product }) {
  const images = useMemo(() => {
    let list = [];

    if (Array.isArray(product.images)) {
      list = product.images.filter(Boolean);
    }

    if (list.length === 0 && product.image) {
      list.push(product.image);
    }

    return list.slice(0, 4);
  }, [product]);

  const variants = useMemo(() => {
    if (Array.isArray(product.variants) && product.variants.length) {
      return product.variants;
    }

    return [
      {
        size: "100ml",
        price: product.price,
        originalPrice: product.price,
        offerPrice: product.price,
      },
    ];
  }, [product]);

  const [slide, setSlide] = useState(0);
  const [variantIndex, setVariantIndex] = useState(0);

  const variant = variants[variantIndex] || variants[0];

  const selling = Number(
    variant?.offerPrice ?? variant?.price ?? product.price ?? 0
  );

  const original = Number(
    variant?.originalPrice ?? selling
  );

  const hasOffer = original > selling;

  const move = (direction) => {
    if (images.length <= 1) return;

    setSlide((current) => {
      return (
        (current + direction + images.length) %
        images.length
      );
    });
  };

  const handleAdd = () => {
    const cart = JSON.parse(
      localStorage.getItem("naduvan_cart") || "[]"
    );

    const selected = {
      ...product,
      productId: product._id,
      cartKey: `${product._id}-${variant.size}`,
      size: variant.size,
      price: selling,
      quantity: 1,
    };

    const existing = cart.findIndex(
      (item) => item.cartKey === selected.cartKey
    );

    if (existing >= 0) {
      cart[existing].quantity += 1;
    } else {
      cart.push(selected);
    }

    localStorage.setItem(
      "naduvan_cart",
      JSON.stringify(cart)
    );

    alert(
      `${product.name} (${variant.size}) added to cart`
    );
  };

  return (
    <article className="product-card">

      <div className="product-image-wrap product-carousel">

        {images.length > 0 ? (
          <img
            src={images[slide]}
            alt={`${product.name} view ${slide + 1}`}
          />
        ) : (
          <div className="no-product-image">
            No Image
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="product-slide-btn product-slide-prev"
              onClick={() => move(-1)}
              aria-label="Previous image"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              className="product-slide-btn product-slide-next"
              onClick={() => move(1)}
              aria-label="Next image"
            >
              <ChevronRight size={16} />
            </button>

            <div className="product-slide-dots">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={index === slide ? "active" : ""}
                  onClick={() => setSlide(index)}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>

            <span className="product-slide-count">
              {slide + 1}/{images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div
          className="product-thumbnail-row"
          aria-label="Product image references"
        >
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              className={`product-thumbnail ${
                index === slide ? "active" : ""
              }`}
              onClick={() => setSlide(index)}
              aria-label={`Show product detail image ${
                index + 1
              }`}
            >
              <img
                src={image}
                alt={`${product.name} detail ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}

      <div className="product-info">

        <span>{product.category}</span>

        <h3>{product.name}</h3>

        <div className="product-size-row">
          <label htmlFor={`size-${product._id}`}>
            Size
          </label>

          <select
            id={`size-${product._id}`}
            value={variantIndex}
            onChange={(event) =>
              setVariantIndex(Number(event.target.value))
            }
          >
            {variants.map((item, index) => (
              <option
                key={`${item.size}-${index}`}
                value={index}
              >
                {item.size}
              </option>
            ))}
          </select>
        </div>

        <div className="product-price-row">

          {hasOffer && (
            <span className="original-price">
              ₹{original.toFixed(0)}
            </span>
          )}

          <span className="offer-price">
            ₹{selling.toFixed(0)}
          </span>

        </div>

        {hasOffer && (
          <small className="offer-label">
            OFFER PRICE
          </small>
        )}

        <button onClick={handleAdd}>
          Add to Cart
        </button>

      </div>
    </article>
  );
}

