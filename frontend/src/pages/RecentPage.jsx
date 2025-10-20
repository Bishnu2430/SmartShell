import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Clock,
  AlertTriangle,
  Leaf,
  DollarSign,
  TrendingUp,
  Package,
  CheckCircle,
  XCircle,
  Truck,
  Box,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

function RecentPage() {
  const [greenCoins, setGreenCoins] = useState(156);
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    // Load user activity data
    const savedCoins = localStorage.getItem("greenCoins");
    if (savedCoins) {
      setGreenCoins(parseInt(savedCoins));
    }

    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch(`${API_URL}/history?limit=10`);
      const data = await response.json();
      if (data.success) {
        setActivityData(data.data);
      }
    } catch (err) {
      console.error("Error fetching activity:", err);
    }
  };

  const recentOrders = [
    {
      id: 1,
      product: "N95 Mask x2",
      date: "Today, 2:30 PM",
      price: 598,
      status: "delivered",
      statusLabel: "Delivered",
      icon: CheckCircle,
      color: "green",
    },
    {
      id: 2,
      product: "Air Purifier",
      date: "Yesterday, 11:20 AM",
      price: 5999,
      status: "transit",
      statusLabel: "In Transit",
      icon: Truck,
      color: "blue",
    },
    {
      id: 3,
      product: "Medical Inhaler",
      date: "2 days ago",
      price: 850,
      status: "processing",
      statusLabel: "Processing",
      icon: Box,
      color: "yellow",
    },
    {
      id: 4,
      product: "Vitamin C Tablets",
      date: "3 days ago",
      price: 199,
      status: "delivered",
      statusLabel: "Delivered",
      icon: CheckCircle,
      color: "green",
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      type: "High PM2.5 Detected",
      time: "2 hours ago",
      value: "67 μg/m³",
      severity: "high",
      color: "red",
    },
    {
      id: 2,
      type: "CO₂ Warning Level",
      time: "5 hours ago",
      value: "1,250 ppm",
      severity: "medium",
      color: "yellow",
    },
    {
      id: 3,
      type: "Air Quality Improved",
      time: "8 hours ago",
      value: "AQI: 45",
      severity: "low",
      color: "green",
    },
    {
      id: 4,
      type: "Temperature Alert",
      time: "12 hours ago",
      value: "38°C",
      severity: "medium",
      color: "orange",
    },
  ];

  const spendingData = [
    { month: "Sep", amount: 2400, coins: 240 },
    { month: "Oct", amount: 3800, coins: 380 },
    { month: "Nov", amount: 1900, coins: 190 },
    { month: "Dec", amount: 4200, coins: 420 },
  ];

  const activityTimeline = [
    {
      type: "order",
      title: "Order Delivered",
      desc: "Your N95 mask order has been delivered",
      time: "Today at 2:30 PM",
      icon: CheckCircle,
      color: "green",
    },
    {
      type: "alert",
      title: "Air Quality Warning",
      desc: "PM2.5 levels exceeded safe limits",
      time: "2 hours ago",
      icon: AlertTriangle,
      color: "red",
    },
    {
      type: "order",
      title: "Order Placed",
      desc: "Air Purifier - Order #12345",
      time: "Yesterday at 11:20 AM",
      icon: Package,
      color: "blue",
    },
    {
      type: "coins",
      title: "Green Coins Earned",
      desc: "Earned 60 coins from recent purchase",
      time: "Yesterday at 11:20 AM",
      icon: Leaf,
      color: "green",
    },
    {
      type: "tree",
      title: "Trees Planted",
      desc: "5 trees planted from your contributions",
      time: "2 days ago",
      icon: TrendingUp,
      color: "green",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Recent Activities
          </h1>
          <p className="text-gray-600">
            Track your orders, alerts, and environmental impact
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <Leaf className="w-10 h-10 mb-3 opacity-90" />
            <div className="text-3xl font-bold mb-1">{greenCoins}</div>
            <div className="text-sm opacity-90">Green Coins</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <Package className="w-10 h-10 mb-3 opacity-90" />
            <div className="text-3xl font-bold mb-1">{recentOrders.length}</div>
            <div className="text-sm opacity-90">Recent Orders</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <AlertTriangle className="w-10 h-10 mb-3 opacity-90" />
            <div className="text-3xl font-bold mb-1">{recentAlerts.length}</div>
            <div className="text-sm opacity-90">Alerts Today</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <TrendingUp className="w-10 h-10 mb-3 opacity-90" />
            <div className="text-3xl font-bold mb-1">12</div>
            <div className="text-sm opacity-90">Trees Planted</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" />
              Recent Orders
            </h3>
            <div className="space-y-3">
              {recentOrders.map((order) => {
                const Icon = order.icon;
                return (
                  <div
                    key={order.id}
                    className={`border-l-4 border-${order.color}-500 pl-4 py-3 hover:bg-gray-50 transition rounded-r-lg`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800">
                          {order.product}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.date} • ₹{order.price}
                        </p>
                      </div>
                      <Icon
                        className={`w-5 h-5 text-${order.color}-600 flex-shrink-0`}
                      />
                    </div>
                    <span
                      className={`inline-block mt-2 text-xs bg-${order.color}-100 text-${order.color}-800 px-3 py-1 rounded-full font-medium`}
                    >
                      {order.statusLabel}
                    </span>
                  </div>
                );
              })}
            </div>
            <a
              href="/shop"
              className="mt-4 block text-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View All Orders →
            </a>
          </div>

          {/* Air Quality Alerts */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              Air Quality Alerts
            </h3>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`bg-${alert.color}-50 border-l-4 border-${alert.color}-500 p-4 rounded hover:shadow-md transition`}
                >
                  <p className={`font-semibold text-${alert.color}-800`}>
                    {alert.type}
                  </p>
                  <p className={`text-sm text-${alert.color}-700 mt-1`}>
                    {alert.time} • {alert.value}
                  </p>
                </div>
              ))}
            </div>
            <a
              href="/dashboard"
              className="mt-4 block text-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View Dashboard →
            </a>
          </div>

          {/* Green Impact */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-600" />
              Green Impact
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">
                  Trees Planted This Month
                </span>
                <span className="text-2xl font-bold text-green-600">12</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-gray-700 font-medium">
                  Green Coins Earned
                </span>
                <span className="text-2xl font-bold text-yellow-600">
                  {greenCoins}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-medium">CO₂ Offset</span>
                <span className="text-2xl font-bold text-blue-600">240 kg</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-700 font-medium">
                  Community Rank
                </span>
                <span className="text-2xl font-bold text-purple-600">#47</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
              <p className="text-sm text-gray-800">
                <strong>🎉 Great work!</strong> Your contributions have helped
                plant <strong>12 trees</strong> this month. Keep shopping to
                make a bigger impact!
              </p>
            </div>
          </div>

          {/* Spending Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-purple-600" />
              Spending Summary
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={spendingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="amount" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-xl font-bold text-gray-800">₹12,300</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Avg/Month</p>
                <p className="text-xl font-bold text-gray-800">₹3,075</p>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-indigo-600" />
              Activity Timeline
            </h3>
            <div className="space-y-4">
              {activityTimeline.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div
                      className={`bg-${activity.color}-100 p-3 rounded-full flex-shrink-0`}
                    >
                      <Icon className={`w-6 h-6 text-${activity.color}-600`} />
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.desc}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecentPage;
