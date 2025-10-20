import React, { useState, useEffect } from "react";
import { Filter, Search } from "lucide-react";
import ProductCard from "../components/ProductCard";

const API_URL = "http://localhost:5000/api";

function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentData, setCurrentData] = useState(null);

  const products = [
    {
      id: 1,
      name: "N95 Protective Mask",
      price: 299,
      image: "😷",
      description: "Premium N95 mask for maximum protection",
      category: "mask",
      stock: 50,
      rating: 4.5,
    },
    {
      id: 2,
      name: "Medical Inhaler",
      price: 850,
      image: "💊",
      description: "Emergency respiratory inhaler",
      category: "medical",
      stock: 30,
      rating: 4.8,
    },
    {
      id: 3,
      name: "Air Purifier",
      price: 5999,
      image: "🌬️",
      description: "HEPA filter air purifier for home",
      category: "device",
      stock: 15,
      rating: 4.7,
    },
    {
      id: 4,
      name: "Oxygen Can",
      price: 399,
      image: "🫁",
      description: "Portable oxygen canister",
      category: "medical",
      stock: 40,
      rating: 4.3,
    },
    {
      id: 5,
      name: "Anti-Pollution Spray",
      price: 249,
      image: "💨",
      description: "Nasal protection spray",
      category: "medical",
      stock: 60,
      rating: 4.2,
    },
    {
      id: 6,
      name: "Vitamin C Tablets",
      price: 199,
      image: "🍊",
      description: "Immunity booster supplements",
      category: "supplement",
      stock: 100,
      rating: 4.6,
    },
    {
      id: 7,
      name: "Face Shield",
      price: 149,
      image: "🛡️",
      description: "Transparent face protection shield",
      category: "mask",
      stock: 45,
      rating: 4.1,
    },
    {
      id: 8,
      name: "Hand Sanitizer 500ml",
      price: 99,
      image: "🧴",
      description: "Alcohol-based sanitizer",
      category: "hygiene",
      stock: 80,
      rating: 4.4,
    },
  ];

  const categories = [
    { id: "all", label: "All Products", count: products.length },
    {
      id: "mask",
      label: "Masks",
      count: products.filter((p) => p.category === "mask").length,
    },
    {
      id: "medical",
      label: "Medical",
      count: products.filter((p) => p.category === "medical").length,
    },
    {
      id: "device",
      label: "Devices",
      count: products.filter((p) => p.category === "device").length,
    },
    {
      id: "supplement",
      label: "Supplements",
      count: products.filter((p) => p.category === "supplement").length,
    },
    {
      id: "hygiene",
      label: "Hygiene",
      count: products.filter((p) => p.category === "hygiene").length,
    },
  ];

  useEffect(() => {
    fetchAirQualityData();
  }, []);

  const fetchAirQualityData = async () => {
    try {
      const response = await fetch(`${API_URL}/current`);
      const data = await response.json();
      if (data.success) setCurrentData(data);
    } catch (err) {
      console.error("Error fetching air quality data:", err);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Health Protection Shop
          </h1>
          <p className="text-gray-600">
            Protect yourself and your loved ones with certified products
          </p>
        </div>

        {/* Air Quality Alert Banner */}
        {currentData &&
          currentData.analysis &&
          currentData.analysis.status !== "safe" && (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-l-4 border-orange-500 p-4 mb-8 rounded-lg shadow-md animate-pulse">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="text-orange-800 font-semibold">
                    Poor air quality detected! Protective equipment highly
                    recommended.
                  </p>
                  <p className="text-sm text-orange-700 mt-1">
                    Current AQI: {currentData.analysis.issues?.length || 0}{" "}
                    parameters outside safe range
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-700">
              Filter by Category:
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow"
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search query
            </p>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                🌳 Plant Trees with Every Purchase
              </h3>
              <p className="opacity-90">
                Earn 10% Green Coins on every order. Every 10 coins = 1 tree
                planted!
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-lg">
              <div className="text-3xl font-bold">342+</div>
              <div className="text-sm opacity-90">Trees Planted</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopPage;
