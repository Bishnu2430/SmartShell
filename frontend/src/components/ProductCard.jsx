import React from "react";
import { useAppContext } from "./AppContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useAppContext();
  return (
    <div
      style={{
        backgroundColor: "#222",
        color: "#FFD700",
        padding: "1rem",
        borderRadius: "8px",
        width: "220px",
        margin: "1rem",
      }}
    >
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>Price: ₹{product.price}</p>
      <button
        style={{
          backgroundColor: "#FFD700",
          color: "#000",
          border: "none",
          padding: "0.5rem",
          cursor: "pointer",
          borderRadius: "4px",
        }}
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
