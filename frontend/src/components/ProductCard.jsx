import React, { useState } from "react";
import { ShoppingCart, Star, Leaf } from "lucide-react";
import { useAppContext } from "../context/AppContext"; // ✅ use global context

const ProductCard = ({ product }) => {
  const { addToCart } = useAppContext(); // ✅ get from AppContext
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = () => {
    // ✅ Add product with selected quantity
    addToCart({ ...product, quantity });

    // ✅ Show temporary success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const greenCoins = Math.floor(product.price * quantity * 0.1);

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden">
      {/* Product Image */}
      <div className="bg-gradient-to-br from-green-100 to-blue-100 p-8 text-center">
        <div className="text-6xl mb-2">{product.image}</div>
        {product.stock < 20 && (
          <span className="inline-block bg-red-500 text-white text-xs px-3 py-1 rounded-full">
            Low Stock
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
          <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
            {product.category}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(product.rating)
                  ? "text-yellow-500 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-3xl font-bold text-green-600">
              ₹{product.price}
            </div>
            <div className="text-xs text-gray-500">
              Stock: {product.stock} units
            </div>
          </div>
        </div>

        {/* Green Coins Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 flex items-center gap-1">
              <Leaf className="w-4 h-4 text-green-600" />
              Green Coins:
            </span>
            <span className="font-bold text-green-600">+{greenCoins}</span>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-700">Quantity:</span>
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            -
          </button>
          <span className="w-12 text-center font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105 ${
            product.stock === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 shadow-lg"
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>

        {/* Success Message */}
        {showSuccess && (
          <div className="mt-3 p-2 bg-green-100 border border-green-300 rounded text-center text-sm text-green-800 font-medium animate-bounce">
            ✓ Added to cart!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
