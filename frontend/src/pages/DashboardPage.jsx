import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Thermometer,
  Droplets,
  Wind,
  Activity,
  AlertTriangle,
  CheckCircle,
  Cloud,
  CloudFog,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";

// 🔹 Add variance
const addVariance = (value, variance = 0.05) => {
  if (typeof value !== "number" || isNaN(value)) return value;
  const factor = 1 + (Math.random() * 2 - 1) * variance;
  return parseFloat((value * factor).toFixed(2));
};

// 🔹 Random CO and NO₂ data
const generateGasData = () => ({
  co: parseFloat((Math.random() * 5 + 2).toFixed(2)), // 2–7 ppm
  no2: parseFloat((Math.random() * 0.04 + 0.01).toFixed(3)), // 0.01–0.05 ppm
});

const DashboardPage = () => {
  const { currentData, historyData, aqi, fetchAllData } = useAppContext();
  const [syntheticData, setSyntheticData] = useState(null);
  const [syntheticHistory, setSyntheticHistory] = useState([]);

  // Fetch Firebase data once on mount
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Generate synthetic data once every minute
  useEffect(() => {
    const generateSyntheticData = () => {
      if (currentData?.data) {
        // Apply variance to Firebase data
        const varied = {
          ...currentData.data,
          temperature: addVariance(currentData.data.temperature, 0.05),
          humidity: addVariance(currentData.data.humidity, 0.08),
          co2: addVariance(currentData.data.co2, 0.1),
          pm25: addVariance(currentData.data.pm25, 0.15),
          pm10: addVariance(currentData.data.pm10, 0.15),
          light: addVariance(currentData.data.light, 0.2),
          ...generateGasData(),
        };

        setSyntheticData({ ...currentData, data: varied });

        const newEntry = { timestamp: Date.now(), ...varied };
        setSyntheticHistory((prev) => [...prev.slice(-48), newEntry]);
      }
    };

    generateSyntheticData(); // Generate immediately
    const interval = setInterval(generateSyntheticData, 60000); // Then every 1 minute
    return () => clearInterval(interval);
  }, [currentData]);

  const getSafe = (val, precision = 1) =>
    typeof val === "number" ? val.toFixed(precision) : "--";

  const getStatusColor = (status) => {
    if (status === "safe")
      return "bg-green-100/80 border-green-300 text-green-800";
    if (status === "warning")
      return "bg-yellow-100/80 border-yellow-300 text-yellow-800";
    return "bg-red-100/80 border-red-300 text-red-800";
  };

  const displayData = syntheticData?.data || currentData?.data;
  const displayHistory =
    syntheticHistory.length > 0 ? syntheticHistory : historyData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.h1
          className="text-4xl font-extrabold text-gray-800 mb-10 tracking-tight text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          SmartShell Environmental Dashboard
        </motion.h1>

        {/* Status Alert */}
        {currentData?.analysis && (
          <motion.div
            className={`mb-10 p-6 rounded-2xl shadow-xl border ${getStatusColor(
              currentData.analysis.status
            )} backdrop-blur-md`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {currentData.analysis.status === "safe" ? (
                  <CheckCircle className="w-12 h-12 text-green-600" />
                ) : (
                  <AlertTriangle className="w-12 h-12 text-yellow-600" />
                )}
                <div>
                  <h2 className="text-2xl font-bold">
                    {currentData.analysis.status === "safe"
                      ? "Air Quality is Safe 🌿"
                      : "Air Quality Alert ⚠️"}
                  </h2>
                  <p className="text-sm mt-1">
                    {currentData.analysis.issues?.length || 0} issues detected
                  </p>
                </div>
              </div>
              {aqi && (
                <div className="text-center">
                  <motion.div
                    className="text-4xl font-bold px-6 py-3 rounded-lg text-white shadow-md"
                    style={{ backgroundColor: aqi.color }}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {aqi.value}
                  </motion.div>
                  <p className="text-sm mt-1 font-semibold">{aqi.category}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Current Readings */}
        {displayData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                label: "Temperature",
                icon: <Thermometer className="w-8 h-8 text-red-600" />,
                bg: "bg-red-100",
                value: `${getSafe(displayData.temperature)}°C`,
                note: "Safe range: 10–35°C",
              },
              {
                label: "Humidity",
                icon: <Droplets className="w-8 h-8 text-blue-600" />,
                bg: "bg-blue-100",
                value: `${getSafe(displayData.humidity)}%`,
                note: "Safe range: 30–70%",
              },
              {
                label: "CO₂ Level",
                icon: <Wind className="w-8 h-8 text-purple-600" />,
                bg: "bg-purple-100",
                value: `${getSafe(displayData.co2, 0)} ppm`,
                note: "Safe limit: <1000 ppm",
              },
              {
                label: "PM2.5",
                icon: <Activity className="w-8 h-8 text-orange-600" />,
                bg: "bg-orange-100",
                value: `${getSafe(displayData.pm25)} μg/m³`,
                note: "Safe limit: <35 μg/m³",
              },
              {
                label: "PM10",
                icon: <Activity className="w-8 h-8 text-yellow-600" />,
                bg: "bg-yellow-100",
                value: `${getSafe(displayData.pm10)} μg/m³`,
                note: "Safe limit: <50 μg/m³",
              },
              {
                label: "Light Level",
                icon: <Activity className="w-8 h-8 text-green-600" />,
                bg: "bg-green-100",
                value: `${getSafe(displayData.light, 0)} Lux`,
                note:
                  displayData.light > 2000
                    ? "Bright"
                    : displayData.light > 500
                    ? "Moderate"
                    : "Dark",
              },
              {
                label: "CO",
                icon: <Cloud className="w-8 h-8 text-gray-600" />,
                bg: "bg-gray-100",
                value: `${getSafe(displayData.co, 2)} ppm`,
                note: "Safe limit: <9 ppm",
              },
              {
                label: "NO₂",
                icon: <CloudFog className="w-8 h-8 text-indigo-600" />,
                bg: "bg-indigo-100",
                value: `${getSafe(displayData.no2, 3)} ppm`,
                note: "Safe limit: <0.05 ppm",
              },
            ].map((card) => (
              <motion.div
                key={card.label}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-2xl p-6 shadow-lg bg-white/80 backdrop-blur-md border border-gray-100 hover:shadow-2xl transition-transform hover:bg-gradient-to-br from-white to-blue-50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${card.bg} p-3 rounded-lg`}>{card.icon}</div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      {card.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-800">
                      {card.value}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{card.note}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Charts */}
        {displayHistory.length > 0 && (
          <motion.div
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 mb-12 border border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-3xl font-bold mb-8 text-gray-800 text-center">
              24-Hour Trends
            </h3>

            <div className="space-y-12">
              <ChartCard
                title="Temperature & Humidity"
                data={displayHistory}
                lines={[
                  {
                    key: "temperature",
                    color: "#ef4444",
                    name: "Temperature (°C)",
                  },
                  { key: "humidity", color: "#3b82f6", name: "Humidity (%)" },
                ]}
              />
              <ChartCard
                title="Particulate Matter (PM2.5, PM10)"
                data={displayHistory}
                lines={[
                  { key: "pm25", color: "#f97316", name: "PM2.5 (μg/m³)" },
                  { key: "pm10", color: "#eab308", name: "PM10 (μg/m³)" },
                ]}
              />
              <ChartCard
                title="Carbon Monoxide (CO)"
                data={displayHistory}
                lines={[{ key: "co", color: "#6b7280", name: "CO (ppm)" }]}
              />
              <ChartCard
                title="Nitrogen Dioxide (NO₂)"
                data={displayHistory}
                lines={[{ key: "no2", color: "#6366f1", name: "NO₂ (ppm)" }]}
              />
              <ChartCard
                title="CO₂ Levels"
                data={displayHistory}
                lines={[{ key: "co2", color: "#8b5cf6", name: "CO₂ (ppm)" }]}
              />
            </div>
          </motion.div>
        )}

        {/* System Info */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            System Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <InfoItem
              label="Data Points Collected"
              value={displayHistory.length}
            />
            <InfoItem label="Update Frequency" value="1 min" />
            <InfoItem
              label="Connection Status"
              value="Connected"
              color="text-green-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// 🔹 ChartCard Component
const ChartCard = ({ title, data, lines }) => (
  <div>
    <h4 className="text-lg font-semibold mb-4 text-gray-700">{title}</h4>
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data.slice(-30)}>
        <defs>
          {lines.map((line) => (
            <linearGradient
              key={line.key}
              id={`color-${line.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={line.color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={line.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(ts) =>
            new Date(ts).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          }
          tick={{ fill: "#6b7280" }}
        />
        <YAxis tick={{ fill: "#6b7280" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          }}
        />
        <Legend />
        {lines.map((line) => (
          <Area
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#color-${line.key})`}
            name={line.name}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

// 🔹 InfoItem
const InfoItem = ({ label, value, color = "text-indigo-600" }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

export default DashboardPage;
