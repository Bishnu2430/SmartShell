import React, { useState, useEffect } from "react";
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
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

function App() {
  const [currentData, setCurrentData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [stats, setStats] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("24h");

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch current data
      const currentRes = await fetch(`${API_URL}/current`);
      const currentJson = await currentRes.json();
      if (currentJson.success) {
        setCurrentData(currentJson);
      }

      // Fetch history
      const historyRes = await fetch(`${API_URL}/history?limit=50`);
      const historyJson = await historyRes.json();
      if (historyJson.success) {
        setHistoryData(historyJson.data);
      }

      // Fetch stats
      const statsRes = await fetch(`${API_URL}/stats?period=${selectedPeriod}`);
      const statsJson = await statsRes.json();
      if (statsJson.success) {
        setStats(statsJson.stats);
      }

      // Fetch AQI
      const aqiRes = await fetch(`${API_URL}/aqi`);
      const aqiJson = await aqiRes.json();
      if (aqiJson.success) {
        setAqi(aqiJson.aqi);
      }

      setError(null);
    } catch (err) {
      setError(
        "Failed to fetch data. Make sure backend is running on port 5000."
      );
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !currentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading air quality data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Connection Error
          </h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={fetchAllData}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    if (status === "safe")
      return "bg-green-100 text-green-800 border-green-300";
    if (status === "warning")
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  const getTrendIcon = (trend) => {
    if (trend === "increasing")
      return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (trend === "decreasing")
      return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Air Quality Monitor
              </h1>
              <p className="text-gray-600 mt-1">
                Real-time environmental monitoring system
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Status Card */}
        {currentData && (
          <div
            className={`mb-8 p-6 rounded-xl shadow-lg border-2 ${getStatusColor(
              currentData.analysis.status
            )}`}
          >
            <div className="flex items-center justify-between">
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
                      : currentData.analysis.status === "warning"
                      ? "Air Quality Warning"
                      : "Air Quality Hazard"}
                  </h2>
                  <p className="text-sm mt-1">
                    {currentData.analysis.issues.length === 0
                      ? "All parameters within safe limits"
                      : `${currentData.analysis.issues.length} parameter(s) outside safe range`}
                  </p>
                </div>
              </div>
              {aqi && (
                <div className="text-right">
                  <p className="text-sm font-medium">Air Quality Index</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="text-3xl font-bold px-4 py-2 rounded-lg text-white"
                      style={{ backgroundColor: aqi.color }}
                    >
                      {aqi.value}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold">{aqi.category}</p>
                      <p className="text-xs">{aqi.primaryPollutant}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {currentData.analysis.issues.length > 0 && (
              <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                <p className="font-semibold mb-2">Issues Detected:</p>
                <ul className="space-y-1">
                  {currentData.analysis.issues.map((issue, idx) => (
                    <li key={idx} className="text-sm">
                      • {issue.parameter}: {issue.value.toFixed(1)} (Safe:{" "}
                      {issue.threshold})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Current Readings Grid */}
        {currentData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Temperature Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <Thermometer className="w-6 h-6 text-red-600" />
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
                {stats?.temperature && getTrendIcon(stats.temperature.trend)}
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Min: {stats?.temperature?.min.toFixed(1)}°C</span>
                <span>Avg: {stats?.temperature?.average.toFixed(1)}°C</span>
                <span>Max: {stats?.temperature?.max.toFixed(1)}°C</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Safe range: 10-35°C
              </div>
            </div>

            {/* Humidity Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Droplets className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Humidity
                    </p>
                    <p className="text-3xl font-bold text-gray-800">
                      {currentData.data.humidity.toFixed(1)}%
                    </p>
                  </div>
                </div>
                {stats?.humidity && getTrendIcon(stats.humidity.trend)}
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Min: {stats?.humidity?.min.toFixed(1)}%</span>
                <span>Avg: {stats?.humidity?.average.toFixed(1)}%</span>
                <span>Max: {stats?.humidity?.max.toFixed(1)}%</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Safe range: 30-70%
              </div>
            </div>

            {/* CO2 Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Wind className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      CO₂ Level
                    </p>
                    <p className="text-3xl font-bold text-gray-800">
                      {currentData.data.co2.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-500">ppm</p>
                  </div>
                </div>
                {stats?.co2 && getTrendIcon(stats.co2.trend)}
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Min: {stats?.co2?.min.toFixed(0)}</span>
                <span>Avg: {stats?.co2?.average.toFixed(0)}</span>
                <span>Max: {stats?.co2?.max.toFixed(0)}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Safe limit: &lt;1000 ppm
              </div>
            </div>

            {/* PM2.5 Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Activity className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">PM2.5</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {currentData.data.pm25.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500">μg/m³</p>
                  </div>
                </div>
                {stats?.pm25 && getTrendIcon(stats.pm25.trend)}
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Min: {stats?.pm25?.min.toFixed(1)}</span>
                <span>Avg: {stats?.pm25?.average.toFixed(1)}</span>
                <span>Max: {stats?.pm25?.max.toFixed(1)}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Safe limit: &lt;35 μg/m³
              </div>
            </div>

            {/* PM10 Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Activity className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">PM10</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {currentData.data.pm10.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500">μg/m³</p>
                  </div>
                </div>
                {stats?.pm10 && getTrendIcon(stats.pm10.trend)}
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Min: {stats?.pm10?.min.toFixed(1)}</span>
                <span>Avg: {stats?.pm10?.average.toFixed(1)}</span>
                <span>Max: {stats?.pm10?.max.toFixed(1)}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Safe limit: &lt;50 μg/m³
              </div>
            </div>

            {/* Light Level Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Light Level
                    </p>
                    <p className="text-3xl font-bold text-gray-800">
                      {currentData.data.light}
                    </p>
                    <p className="text-xs text-gray-500">Lux (analog)</p>
                  </div>
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

        {/* Charts Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Historical Trends
            </h2>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>

          {historyData.length > 0 ? (
            <div className="space-y-8">
              {/* Temperature & Humidity Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Temperature & Humidity
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={historyData}>
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
                    <Tooltip
                      labelFormatter={(ts) => new Date(ts).toLocaleString()}
                      formatter={(value, name) => [
                        `${Number(value).toFixed(1)}${
                          name === "temperature" ? "°C" : "%"
                        }`,
                        name === "temperature" ? "Temperature" : "Humidity",
                      ]}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="temperature"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="humidity"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Air Quality Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Air Quality (PM2.5 & PM10)
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={historyData}>
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
                    <Tooltip
                      labelFormatter={(ts) => new Date(ts).toLocaleString()}
                      formatter={(value, name) => [
                        `${Number(value).toFixed(1)} μg/m³`,
                        name === "pm25" ? "PM2.5" : "PM10",
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="pm25"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="pm10"
                      stroke="#eab308"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* CO2 Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  CO₂ Levels
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={historyData}>
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
                    <Tooltip
                      labelFormatter={(ts) => new Date(ts).toLocaleString()}
                      formatter={(value) => [
                        `${Number(value).toFixed(0)} ppm`,
                        "CO₂",
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="co2"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No historical data available yet</p>
              <p className="text-sm mt-2">
                Data will appear as your system collects readings
              </p>
            </div>
          )}
        </div>

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
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 py-6 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>IoT Air Quality Monitoring System</p>
          <p className="text-sm mt-1">
            Real-time environmental data powered by ESP32 & Firebase
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
