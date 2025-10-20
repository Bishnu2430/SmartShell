import React, { useEffect } from "react";
import {
  LineChart,
  Line,
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
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

const DashboardPage = () => {
  const { currentData, historyData, aqi, fetchAllData } = useAppContext();

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    if (status === "safe")
      return "bg-green-100 border-green-300 text-green-800";
    if (status === "warning")
      return "bg-yellow-100 border-yellow-300 text-yellow-800";
    return "bg-red-100 border-red-300 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Environmental Dashboard
        </h1>

        {/* Status Alert */}
        {currentData && currentData.analysis && (
          <div
            className={`mb-8 p-6 rounded-xl shadow-lg border-2 ${getStatusColor(
              currentData.analysis.status
            )}`}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {currentData.analysis.status === "safe" ? (
                  <CheckCircle className="w-12 h-12" />
                ) : (
                  <AlertTriangle className="w-12 h-12" />
                )}
                <div>
                  <h2 className="text-2xl font-bold">
                    {currentData.analysis.status === "safe"
                      ? "Air Quality is Safe"
                      : "Air Quality Alert"}
                  </h2>
                  <p className="text-sm mt-1">
                    {currentData.analysis.issues?.length || 0} issues detected
                  </p>
                </div>
              </div>
              {aqi && (
                <div className="text-center">
                  <div
                    className="text-4xl font-bold px-6 py-3 rounded-lg text-white"
                    style={{ backgroundColor: aqi.color }}
                  >
                    {aqi.value}
                  </div>
                  <p className="text-sm mt-1 font-semibold">{aqi.category}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Current Readings */}
        {currentData && currentData.data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Thermometer className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Temperature
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {currentData.data.temperature.toFixed(1)}°C
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500">Safe range: 10-35°C</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Droplets className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Humidity</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {currentData.data.humidity.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500">Safe range: 30-70%</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Wind className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">CO₂ Level</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {currentData.data.co2.toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-500">ppm</p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Safe limit: &lt;1000 ppm
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Activity className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">PM2.5</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {currentData.data.pm25.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500">μg/m³</p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Safe limit: &lt;35 μg/m³
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Activity className="w-8 h-8 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">PM10</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {currentData.data.pm10.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500">μg/m³</p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Safe limit: &lt;50 μg/m³
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Light Level
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {currentData.data.light}
                  </p>
                  <p className="text-xs text-gray-500">Lux</p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {currentData.data.light > 2000
                  ? "Bright"
                  : currentData.data.light > 500
                  ? "Moderate"
                  : "Dark"}
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        {historyData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              24-Hour Trends
            </h3>
            <div className="space-y-8">
              {/* Temperature & Humidity */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-700">
                  Temperature & Humidity
                </h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={historyData.slice(-20)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(ts) =>
                        new Date(ts).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      }
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="temperature"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={false}
                      name="Temperature (°C)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="humidity"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      name="Humidity (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Air Quality */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-700">
                  Air Quality (PM2.5 & PM10)
                </h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={historyData.slice(-20)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(ts) =>
                        new Date(ts).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      }
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="pm25"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={false}
                      name="PM2.5 (μg/m³)"
                    />
                    <Line
                      type="monotone"
                      dataKey="pm10"
                      stroke="#eab308"
                      strokeWidth={2}
                      dot={false}
                      name="PM10 (μg/m³)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* CO2 */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-700">
                  CO₂ Levels
                </h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={historyData.slice(-20)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(ts) =>
                        new Date(ts).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      }
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="co2"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={false}
                      name="CO₂ (ppm)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* System Info */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            System Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Data Points Collected</p>
              <p className="text-2xl font-bold text-indigo-600">
                {historyData.length}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Update Frequency</p>
              <p className="text-2xl font-bold text-indigo-600">10s</p>
            </div>
            <div>
              <p className="text-gray-500">Connection Status</p>
              <p className="text-2xl font-bold text-green-600">Connected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
