// server.js - Advanced Backend for Air Quality Monitoring System

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    process.env.FIREBASE_DATABASE_URL ||
    "https://smartshell-b94fe-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const db = admin.database();

// Email configuration (for alerts)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Safety thresholds
const THRESHOLDS = {
  temperature: { min: 10, max: 35, unit: "°C" },
  humidity: { min: 30, max: 70, unit: "%" },
  co2: { max: 1000, unit: "ppm" },
  pm25: { max: 35, unit: "μg/m³" },
  pm10: { max: 50, unit: "μg/m³" },
};

// Alert tracking (prevent spam)
let lastAlertTime = 0;
const ALERT_COOLDOWN = 300000; // 5 minutes

// ============= ROUTES =============

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Air Quality Monitoring API is running",
    timestamp: new Date().toISOString(),
  });
});

// Get current air quality data
app.get("/api/current", async (req, res) => {
  try {
    const snapshot = await db.ref("air_quality_data/current").once("value");
    const data = snapshot.val();

    if (!data) {
      return res.status(404).json({
        error: "No data available",
        message: "Please ensure your ESP32 is connected and sending data",
      });
    }

    // Add safety analysis
    const analysis = analyzeSafety(data);

    res.json({
      success: true,
      data: data,
      analysis: analysis,
      thresholds: THRESHOLDS,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching current data:", error);
    res.status(500).json({
      error: "Failed to fetch data",
      message: error.message,
    });
  }
});

// Get historical data with filters
app.get("/api/history", async (req, res) => {
  try {
    const { limit = 100, startTime, endTime } = req.query;

    let query = db.ref("air_quality_data/history").orderByChild("timestamp");

    if (startTime) {
      query = query.startAt(parseInt(startTime));
    }
    if (endTime) {
      query = query.endAt(parseInt(endTime));
    }

    query = query.limitToLast(parseInt(limit));

    const snapshot = await query.once("value");
    const data = snapshot.val();

    if (!data) {
      return res.json({
        success: true,
        data: [],
        count: 0,
        message: "No historical data available yet",
      });
    }

    // Convert to array and sort by timestamp
    const dataArray = Object.entries(data)
      .map(([key, value]) => ({
        id: key,
        ...value,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);

    res.json({
      success: true,
      data: dataArray,
      count: dataArray.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({
      error: "Failed to fetch historical data",
      message: error.message,
    });
  }
});

// Get statistics (averages, min, max)
app.get("/api/stats", async (req, res) => {
  try {
    const { period = "24h" } = req.query;

    // Calculate time range
    const now = Date.now();
    const periodMs = {
      "1h": 3600000,
      "6h": 21600000,
      "24h": 86400000,
      "7d": 604800000,
      "30d": 2592000000,
    };

    const startTime = now - (periodMs[period] || periodMs["24h"]);

    const snapshot = await db
      .ref("air_quality_data/history")
      .orderByChild("timestamp")
      .startAt(startTime)
      .once("value");

    const data = snapshot.val();

    if (!data) {
      return res.json({
        success: true,
        stats: null,
        message: "No data available for the selected period",
      });
    }

    const dataArray = Object.values(data);
    const stats = calculateStats(dataArray);

    res.json({
      success: true,
      period: period,
      stats: stats,
      dataPoints: dataArray.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error calculating stats:", error);
    res.status(500).json({
      error: "Failed to calculate statistics",
      message: error.message,
    });
  }
});

// Get air quality index (AQI)
app.get("/api/aqi", async (req, res) => {
  try {
    const snapshot = await db.ref("air_quality_data/current").once("value");
    const data = snapshot.val();

    if (!data) {
      return res.status(404).json({
        error: "No data available",
      });
    }

    const aqi = calculateAQI(data);

    res.json({
      success: true,
      aqi: aqi,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error calculating AQI:", error);
    res.status(500).json({
      error: "Failed to calculate AQI",
      message: error.message,
    });
  }
});

// Send alert email
app.post("/api/alert", async (req, res) => {
  try {
    const { email, message, data } = req.body;

    if (!email || !message) {
      return res.status(400).json({
        error: "Email and message are required",
      });
    }

    // Check cooldown
    const now = Date.now();
    if (now - lastAlertTime < ALERT_COOLDOWN) {
      return res.status(429).json({
        error: "Please wait before sending another alert",
        waitTime: Math.ceil((ALERT_COOLDOWN - (now - lastAlertTime)) / 1000),
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "⚠️ Air Quality Alert - Unsafe Levels Detected",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #e74c3c;">🚨 Air Quality Alert</h2>
            <p style="font-size: 16px; color: #333;">${message}</p>
            
            ${
              data
                ? `
              <div style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #856404;">Current Readings:</h3>
                <ul style="list-style: none; padding: 0;">
                  <li><strong>Temperature:</strong> ${data.temperature}°C</li>
                  <li><strong>Humidity:</strong> ${data.humidity}%</li>
                  <li><strong>CO2:</strong> ${data.co2} ppm</li>
                  <li><strong>PM2.5:</strong> ${data.pm25} μg/m³</li>
                  <li><strong>PM10:</strong> ${data.pm10} μg/m³</li>
                </ul>
              </div>
            `
                : ""
            }
            
            <div style="margin-top: 30px; padding: 15px; background-color: #d1ecf1; border-left: 4px solid #17a2b8; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #0c5460;">Health Recommendations:</h3>
              <ul style="color: #0c5460;">
                <li>Stay indoors and keep windows closed</li>
                <li>Use air purifiers if available</li>
                <li>Avoid outdoor physical activities</li>
                <li>Vulnerable groups should take extra precautions</li>
              </ul>
            </div>
            
            <p style="margin-top: 20px; font-size: 14px; color: #666;">
              <em>This is an automated alert from your Air Quality Monitoring System</em>
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    lastAlertTime = now;

    res.json({
      success: true,
      message: "Alert email sent successfully",
    });
  } catch (error) {
    console.error("Error sending alert:", error);
    res.status(500).json({
      error: "Failed to send alert email",
      message: error.message,
    });
  }
});

// Get alert settings
app.get("/api/settings", async (req, res) => {
  try {
    const snapshot = await db.ref("settings").once("value");
    const settings = snapshot.val() || {
      alertsEnabled: true,
      emailNotifications: true,
      thresholds: THRESHOLDS,
    };

    res.json({
      success: true,
      settings: settings,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch settings",
      message: error.message,
    });
  }
});

// Update alert settings
app.post("/api/settings", async (req, res) => {
  try {
    const settings = req.body;
    await db.ref("settings").set(settings);

    res.json({
      success: true,
      message: "Settings updated successfully",
      settings: settings,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update settings",
      message: error.message,
    });
  }
});

// ============= HELPER FUNCTIONS =============

function analyzeSafety(data) {
  const issues = [];
  let overallStatus = "safe";

  // Temperature check
  if (data.temperature > THRESHOLDS.temperature.max) {
    issues.push({
      parameter: "Temperature",
      value: data.temperature,
      threshold: THRESHOLDS.temperature.max,
      severity: "warning",
      message: "Temperature is too high",
    });
    overallStatus = "warning";
  } else if (data.temperature < THRESHOLDS.temperature.min) {
    issues.push({
      parameter: "Temperature",
      value: data.temperature,
      threshold: THRESHOLDS.temperature.min,
      severity: "warning",
      message: "Temperature is too low",
    });
    overallStatus = "warning";
  }

  // Humidity check
  if (data.humidity > THRESHOLDS.humidity.max) {
    issues.push({
      parameter: "Humidity",
      value: data.humidity,
      threshold: THRESHOLDS.humidity.max,
      severity: "warning",
      message: "Humidity is too high",
    });
    overallStatus = "warning";
  } else if (data.humidity < THRESHOLDS.humidity.min) {
    issues.push({
      parameter: "Humidity",
      value: data.humidity,
      threshold: THRESHOLDS.humidity.min,
      severity: "warning",
      message: "Humidity is too low",
    });
    overallStatus = "warning";
  }

  // CO2 check
  if (data.co2 > THRESHOLDS.co2.max) {
    issues.push({
      parameter: "CO2",
      value: data.co2,
      threshold: THRESHOLDS.co2.max,
      severity: data.co2 > 1500 ? "danger" : "warning",
      message: "CO2 levels are unsafe",
    });
    overallStatus = data.co2 > 1500 ? "danger" : "warning";
  }

  // PM2.5 check
  if (data.pm25 > THRESHOLDS.pm25.max) {
    issues.push({
      parameter: "PM2.5",
      value: data.pm25,
      threshold: THRESHOLDS.pm25.max,
      severity: data.pm25 > 75 ? "danger" : "warning",
      message: "PM2.5 levels are unhealthy",
    });
    if (data.pm25 > 75) overallStatus = "danger";
    else if (overallStatus === "safe") overallStatus = "warning";
  }

  // PM10 check
  if (data.pm10 > THRESHOLDS.pm10.max) {
    issues.push({
      parameter: "PM10",
      value: data.pm10,
      threshold: THRESHOLDS.pm10.max,
      severity: data.pm10 > 150 ? "danger" : "warning",
      message: "PM10 levels are unhealthy",
    });
    if (data.pm10 > 150) overallStatus = "danger";
    else if (overallStatus === "safe") overallStatus = "warning";
  }

  return {
    status: overallStatus,
    issues: issues,
    safeParameters:
      ["temperature", "humidity", "co2", "pm25", "pm10"].length - issues.length,
    totalParameters: 5,
  };
}

function calculateStats(dataArray) {
  const params = ["temperature", "humidity", "co2", "pm25", "pm10"];
  const stats = {};

  params.forEach((param) => {
    const values = dataArray.map((d) => d[param]).filter((v) => v != null);

    if (values.length > 0) {
      stats[param] = {
        current: values[values.length - 1],
        average: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        trend: calculateTrend(values),
      };
    }
  });

  return stats;
}

function calculateTrend(values) {
  if (values.length < 2) return "stable";

  const recent = values.slice(-10);
  const older = values.slice(-20, -10);

  if (older.length === 0) return "stable";

  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

  const change = ((recentAvg - olderAvg) / olderAvg) * 100;

  if (change > 5) return "increasing";
  if (change < -5) return "decreasing";
  return "stable";
}

function calculateAQI(data) {
  // Simplified AQI calculation based on PM2.5 and PM10
  const pm25AQI = calculatePM25AQI(data.pm25);
  const pm10AQI = calculatePM10AQI(data.pm10);

  const aqi = Math.max(pm25AQI, pm10AQI);

  return {
    value: Math.round(aqi),
    category: getAQICategory(aqi),
    color: getAQIColor(aqi),
    primaryPollutant: pm25AQI > pm10AQI ? "PM2.5" : "PM10",
  };
}

function calculatePM25AQI(pm25) {
  if (pm25 <= 12) return (50 / 12) * pm25;
  if (pm25 <= 35.4) return 50 + ((100 - 50) / (35.4 - 12.1)) * (pm25 - 12.1);
  if (pm25 <= 55.4) return 100 + ((150 - 100) / (55.4 - 35.5)) * (pm25 - 35.5);
  if (pm25 <= 150.4)
    return 150 + ((200 - 150) / (150.4 - 55.5)) * (pm25 - 55.5);
  if (pm25 <= 250.4)
    return 200 + ((300 - 200) / (250.4 - 150.5)) * (pm25 - 150.5);
  return 300 + ((500 - 300) / (500.4 - 250.5)) * (pm25 - 250.5);
}

function calculatePM10AQI(pm10) {
  if (pm10 <= 54) return (50 / 54) * pm10;
  if (pm10 <= 154) return 50 + ((100 - 50) / (154 - 55)) * (pm10 - 55);
  if (pm10 <= 254) return 100 + ((150 - 100) / (254 - 155)) * (pm10 - 155);
  if (pm10 <= 354) return 150 + ((200 - 150) / (354 - 255)) * (pm10 - 255);
  if (pm10 <= 424) return 200 + ((300 - 200) / (424 - 355)) * (pm10 - 355);
  return 300 + ((500 - 300) / (604 - 425)) * (pm10 - 425);
}

function getAQICategory(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

function getAQIColor(aqi) {
  if (aqi <= 50) return "#00e400";
  if (aqi <= 100) return "#ffff00";
  if (aqi <= 150) return "#ff7e00";
  if (aqi <= 200) return "#ff0000";
  if (aqi <= 300) return "#8f3f97";
  return "#7e0023";
}

// ============= REAL-TIME MONITORING =============

// Listen for unsafe conditions
db.ref("air_quality_data/current").on("value", (snapshot) => {
  const data = snapshot.val();
  if (data && !data.is_safe) {
    console.log("⚠️  ALERT: Unsafe air quality detected!");
    const analysis = analyzeSafety(data);
    console.log("Issues:", analysis.issues);

    // Auto-send alert if configured
    // (implement based on settings)
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Air Quality Monitoring API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔥 Connected to Firebase: ${admin.database().ref().toString()}`);
});
