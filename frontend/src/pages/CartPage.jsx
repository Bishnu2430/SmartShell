import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  X,
  CreditCard,
  Leaf,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
} from "lucide-react";

function CartPage() {
  const [cart, setCart] = useState([]);
  const [greenCoins, setGreenCoins] = useState(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (productId, delta) => {
    setCart(
      cart.map((item) => {
        if (item.id === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTotalCoins = () => {
    return Math.floor(getTotalPrice() * 0.1);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleCheckout = () => {
    const coins = getTotalCoins();
    setGreenCoins((prev) => prev + coins);
    setShowCheckoutModal(true);
    setTimeout(() => {
      setShowCheckoutModal(false);
      clearCart();
      window.location.href = "/dashboard";
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {cart.length === 0
              ? "Your cart is empty"
              : `${getTotalItems()} items in your cart`}
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <ShoppingCart className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added anything to your cart yet
            </p>
            <a
              href="/shop"
              className="inline-block bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition transform hover:scale-105"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-6">
                    {/* Product Image */}
                    <div className="bg-gradient-to-br from-green-100 to-blue-100 p-6 rounded-lg text-5xl flex-shrink-0">
                      {item.image}
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {item.category}
                        </span>
                        <span className="flex items-center gap-1 text-green-600">
                          <Leaf className="w-4 h-4" />+
                          {Math.floor(item.price * item.quantity * 0.1)} coins
                        </span>
                      </div>
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex flex-col items-end gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ₹{item.price} each
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-bold text-lg">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 transition flex items-center gap-1 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({getTotalItems()} items):</span>
                    <span className="font-semibold">₹{getTotalPrice()}</span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>Shipping:</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total:</span>
                      <span className="text-green-600">₹{getTotalPrice()}</span>
                    </div>
                  </div>
                </div>

                {/* Green Coins */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-green-600" />
                      Green Coins Earned:
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      {getTotalCoins()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    🌳 Plants{" "}
                    <strong>{Math.ceil(getTotalCoins() / 10)} trees</strong>
                  </p>
                </div>

                {/* Environmental Impact */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    🌍 Your Environmental Impact
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>
                      • CO₂ Offset: ~{(getTotalCoins() * 0.5).toFixed(1)} kg
                    </li>
                    <li>
                      • Oxygen Production: ~{(getTotalCoins() * 0.3).toFixed(1)}{" "}
                      kg/year
                    </li>
                    <li>• Wildlife Habitat Support</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">
                    Coins auto-sent to govt tree plantation programs
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-blue-700 transition transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                >
                  <CreditCard className="w-6 h-6" />
                  Proceed to Payment
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Secure checkout • 7-day return policy
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Success Modal */}
        {showCheckoutModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-bounce-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Order Placed! 🎉
              </h2>
              <p className="text-gray-600 mb-4">
                Your order has been confirmed
              </p>
              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <p className="font-semibold text-green-800">
                  +{getTotalCoins()} Green Coins Earned!
                </p>
                <p className="text-sm text-green-700">
                  🌳 {Math.ceil(getTotalCoins() / 10)} trees will be planted
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Redirecting to dashboard...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
