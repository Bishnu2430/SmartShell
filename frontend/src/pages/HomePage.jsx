import React, { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Leaf,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

function HomePage() {
  const [currentData, setCurrentData] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const currentRes = await fetch(`${API_URL}/current`);
      const currentJson = await currentRes.json();
      if (currentJson.success) setCurrentData(currentJson);

      const aqiRes = await fetch(`${API_URL}/aqi`);
      const aqiJson = await aqiRes.json();
      if (aqiJson.success) setAqi(aqiJson.aqi);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">
              Breathe Safe, Live Better
            </h1>
            <p className="text-xl mb-8">
              Real-time air quality monitoring for your society
            </p>

            {loading ? (
              <div className="inline-block bg-white/20 backdrop-blur-md rounded-2xl p-6">
                <div className="animate-pulse">
                  <div className="h-16 w-32 bg-white/30 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-white/30 rounded"></div>
                </div>
              </div>
            ) : aqi ? (
              <div className="inline-block bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-6xl font-bold mb-2">{aqi.value}</div>
                <div className="text-lg font-semibold">{aqi.category}</div>
                <div className="text-sm mt-2 opacity-90">Current AQI Level</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Alert Section */}
      {currentData &&
        currentData.analysis &&
        currentData.analysis.status !== "safe" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-red-100 border-2 border-red-400 rounded-xl p-6 animate-bounce-slow">
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-12 h-12 text-red-600" />
                <div>
                  <h3 className="text-2xl font-bold text-red-800">
                    ⚠️ Air Quality Alert!
                  </h3>
                  <p className="text-red-700 mt-1">
                    Poor air quality detected. Consider protective measures.
                  </p>
                  <a
                    href="/shop"
                    className="mt-3 inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Shop Protection Products
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Live Data Cards */}
      {currentData && currentData.data && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Live Environmental Data
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Temperature
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    currentData.data.temperature > 35 ||
                    currentData.data.temperature < 10
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {currentData.data.temperature > 35 ||
                  currentData.data.temperature < 10
                    ? "Alert"
                    : "Normal"}
                </span>
              </div>
              <div className="text-4xl font-bold text-blue-600">
                {currentData.data.temperature.toFixed(1)}°C
              </div>
              <p className="text-sm text-gray-500 mt-2">Safe: 10-35°C</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Humidity
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    currentData.data.humidity > 70 ||
                    currentData.data.humidity < 30
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {currentData.data.humidity > 70 ||
                  currentData.data.humidity < 30
                    ? "Warning"
                    : "Normal"}
                </span>
              </div>
              <div className="text-4xl font-bold text-cyan-600">
                {currentData.data.humidity.toFixed(1)}%
              </div>
              <p className="text-sm text-gray-500 mt-2">Safe: 30-70%</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  CO₂ Level
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    currentData.data.co2 > 1000
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {currentData.data.co2 > 1000 ? "High" : "Good"}
                </span>
              </div>
              <div className="text-4xl font-bold text-purple-600">
                {currentData.data.co2.toFixed(0)}
              </div>
              <p className="text-sm text-gray-500 mt-2">ppm (Safe: &lt;1000)</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Community Impact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition transform hover:-translate-y-1">
            <Leaf className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800">156</div>
            <div className="text-gray-600">Green Coins Today</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition transform hover:-translate-y-1">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800">1,247</div>
            <div className="text-gray-600">Community Members</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition transform hover:-translate-y-1">
            <Package className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800">856</div>
            <div className="text-gray-600">Orders Delivered</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition transform hover:-translate-y-1">
            <TrendingUp className="w-12 h-12 text-orange-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800">342</div>
            <div className="text-gray-600">Trees Planted</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Our Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all transform hover:scale-105">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-time Monitoring</h3>
            <p className="text-gray-600">
              Track air quality 24/7 with IoT sensors and get instant alerts
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all transform hover:scale-105">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Health Products</h3>
            <p className="text-gray-600">
              Buy certified protective gear and medical supplies
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all transform hover:scale-105">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Green Impact</h3>
            <p className="text-gray-600">
              Every purchase plants trees for cleaner air
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl mb-8 opacity-90">
            Help us create a healthier environment for everyone
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/shop"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition transform hover:scale-105"
            >
              Start Shopping
            </a>
            <a
              href="/dashboard"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition transform hover:scale-105"
            >
              View Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
