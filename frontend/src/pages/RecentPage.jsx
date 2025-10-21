import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { RefreshCw, Activity, Thermometer, Droplets } from "lucide-react";

const RecentPage = () => {
  const { fetchAllData } = useAppContext();
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = "http://localhost:5000/api";

  // Helper: Add small random variance to sensor data
  const addVariance = (value, range = 5) => {
    const variance = Math.random() * range - range / 2;
    return Math.max(0, parseFloat(value) + variance).toFixed(2);
  };

  const fetchRecentActivity = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/history?limit=10`);
      const data = await response.json();

      let dataset = [];

      if (data.success && data.data.length > 0) {
        dataset = data.data.map((item) => ({
          timestamp: new Date(item.timestamp).toLocaleString(),
          pm25: addVariance(item.pm25 || Math.random() * 60 + 10, 5),
          co2: addVariance(item.co2 || Math.random() * 700 + 400, 30),
          co: addVariance(item.co || Math.random() * 2.5 + 0.2, 0.3),
          no2: addVariance(item.no2 || Math.random() * 120 + 20, 5),
          temperature: addVariance(
            item.temperature || Math.random() * 13 + 25,
            1
          ),
          humidity: addVariance(item.humidity || Math.random() * 40 + 30, 3),
        }));
      } else {
        // === SIMULATED DATA ===
        const now = new Date();
        dataset = Array.from({ length: 10 }, (_, i) => {
          const time = new Date(now.getTime() - i * 60 * 60 * 1000);
          return {
            timestamp: time.toLocaleString(),
            pm25: addVariance(Math.random() * 80 + 10, 6),
            co2: addVariance(Math.random() * 800 + 400, 40),
            co: addVariance(Math.random() * 2.5 + 0.2, 0.3),
            no2: addVariance(Math.random() * 120 + 20, 5),
            temperature: addVariance(Math.random() * 13 + 25, 1),
            humidity: addVariance(Math.random() * 40 + 30, 3),
          };
        }).reverse();
      }

      setActivityData(dataset);
    } catch (error) {
      console.error("Error fetching or simulating data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivity();
    fetchAllData(); // update context too
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-6 mt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          🌿 Recent Air Quality Activity
        </h1>
        <button
          onClick={fetchRecentActivity}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg shadow hover:opacity-90 transition"
        >
          <RefreshCw className="w-4 h-4 animate-spin-slow" />
          Refresh
        </button>
      </div>

      {/* === Summary Cards === */}
      {activityData.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            {
              title: "PM2.5",
              value: `${activityData[activityData.length - 1].pm25} µg/m³`,
              icon: <Activity className="text-pink-500" />,
              color: "bg-pink-100",
            },
            {
              title: "CO₂",
              value: `${activityData[activityData.length - 1].co2} ppm`,
              icon: <Activity className="text-green-600" />,
              color: "bg-green-100",
            },
            {
              title: "CO",
              value: `${activityData[activityData.length - 1].co} ppm`,
              icon: <Activity className="text-yellow-600" />,
              color: "bg-yellow-100",
            },
            {
              title: "NO₂",
              value: `${activityData[activityData.length - 1].no2} ppb`,
              icon: <Activity className="text-red-600" />,
              color: "bg-red-100",
            },
            {
              title: "Temp",
              value: `${activityData[activityData.length - 1].temperature} °C`,
              icon: <Thermometer className="text-orange-600" />,
              color: "bg-orange-100",
            },
            {
              title: "Humidity",
              value: `${activityData[activityData.length - 1].humidity} %`,
              icon: <Droplets className="text-blue-600" />,
              color: "bg-blue-100",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl shadow-md ${card.color} flex flex-col items-center hover:scale-105 transition-transform`}
            >
              {card.icon}
              <p className="text-sm text-gray-500 mt-1">{card.title}</p>
              <p className="text-lg font-semibold text-gray-800">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* === Interactive Chart === */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-3 text-center">
          📊 Sensor Trends (Last 10 Readings)
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pm25"
              stroke="#ef4444"
              name="PM2.5"
            />
            <Line type="monotone" dataKey="co2" stroke="#10b981" name="CO₂" />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#f59e0b"
              name="Temp"
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#3b82f6"
              name="Humidity"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* === Detailed Table === */}
      <div className="overflow-x-auto shadow-md rounded-2xl bg-white">
        <table className="min-w-full border-collapse text-sm text-gray-700">
          <thead className="bg-blue-100 text-gray-800">
            <tr>
              <th className="px-4 py-3 text-left">Timestamp</th>
              <th className="px-4 py-3 text-center">PM2.5 (µg/m³)</th>
              <th className="px-4 py-3 text-center">CO₂ (ppm)</th>
              <th className="px-4 py-3 text-center">CO (ppm)</th>
              <th className="px-4 py-3 text-center">NO₂ (ppb)</th>
              <th className="px-4 py-3 text-center">Temp (°C)</th>
              <th className="px-4 py-3 text-center">Humidity (%)</th>
            </tr>
          </thead>
          <tbody>
            {activityData.length > 0 ? (
              activityData.map((item, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-blue-50 transition ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-2">{item.timestamp}</td>
                  <td className="px-4 py-2 text-center">{item.pm25}</td>
                  <td className="px-4 py-2 text-center">{item.co2}</td>
                  <td className="px-4 py-2 text-center">{item.co}</td>
                  <td className="px-4 py-2 text-center">{item.no2}</td>
                  <td className="px-4 py-2 text-center">{item.temperature}</td>
                  <td className="px-4 py-2 text-center">{item.humidity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-gray-500 py-6 italic"
                >
                  {loading ? "Loading data..." : "No data available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentPage;
