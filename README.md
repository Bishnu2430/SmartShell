Here’s a professional **GitHub README.md** for your project — fully based on your presentation (`bputhackathon.pptx`) and your frontend + IoT code setup (ESP32 + Firebase + Dashboard):

---

# 🌍 IoT-Based Air Quality Monitoring & Alert System

### **Team: CREATIVE CARTEL**

**Team ID:** BH25PS01T05
**Members:**

- Priyanshu Mohanty — _Team Lead, Cloud Integration_
- Pragnya Priyadarshini Upadhayay — _Presenter_
- Jayshree Lenka — _UI/UX & Dashboard Designer_
- Bishnu Prasad Kar — _Backend & Database_
- Surya Prakash Das — _Hardware & Circuit Design_

---

## 🚀 Project Overview

Air pollution is one of the biggest environmental challenges in modern cities. Our project — **IoT-Based Air Quality Monitoring and Alert System** — offers a **real-time, cloud-connected**, and **sustainable** solution for monitoring air quality parameters using **ESP32**, **sensors**, and a **Firebase-powered dashboard**.

This system continuously measures environmental factors such as:

- 🌫 CO₂, CO, NO₂, PM2.5, and PM10
- 🌡 Temperature and Humidity
- 💡 Ambient Light (for solar node monitoring)

It then uploads the data to Firebase, displays live readings on a web dashboard, and triggers **instant alerts (buzzer + LED)** when dangerous levels are detected.

---

## 🧩 Key Features

✅ **Real-Time Monitoring** — Continuous tracking of gases and particulate matter.
🚨 **Automatic Alerts** — Instant buzzer + LED activation on crossing thresholds.
☁️ **Cloud Dashboard (Firebase + React)** — Real-time visualization, analytics, and trends.
⚡ **Solar-Powered Node** — Self-sustaining, deployable anywhere.
🧠 **AI-Ready Data** — Structured cloud data for predictive modeling.
📱 **Remote Access** — View live conditions via web or mobile integration.
💚 **Sustainable & Scalable** — Ideal for smart cities, campuses, and industries.

---

## 🧠 System Architecture

```
+------------------+          +------------------------+
|   Sensor Module  |  --->   |  ESP32 Microcontroller  |
| (CO2, CO, NO2,   |         | (Wi-Fi + BLE + Firebase |
|  PM2.5, PM10, etc)|         |   REST API Integration) |
+------------------+          +------------------------+
          |
          v
+--------------------------------------------------------+
|                 Firebase Realtime Database             |
|    (Data Storage, Cloud Sync, Alert Thresholds)        |
+--------------------------------------------------------+
          |
          v
+--------------------------------------------------------+
|                   Web Dashboard (React + Tailwind)     |
|  - Live Charts (Recharts)                              |
|  - Status Alerts                                       |
|  - Historical Trends                                   |
|  - Variance-based Simulation for Visualization         |
+--------------------------------------------------------+
```

---

## ⚙️ Hardware Components

| Component                           | Function                                        |
| ----------------------------------- | ----------------------------------------------- |
| **ESP32**                           | Core microcontroller (Wi-Fi enabled)            |
| **DHT11 / DHT22**                   | Temperature & Humidity sensor                   |
| **MQ Sensors (MQ-7, MQ-135)**       | CO and CO₂ gas detection                        |
| **NO₂ Sensor (MiCS-2714 / MQ-131)** | Nitrogen dioxide detection                      |
| **PMS5003 / SDS011**                | PM2.5 and PM10 particulate sensor               |
| **LDR Sensor**                      | Ambient light for turbidity and solar intensity |
| **Buzzer + LED**                    | Alert system                                    |
| **Solar Panel + Battery**           | Power source for sustainable deployment         |
| **LCD Display**                     | On-device live readings                         |

---

## 🧰 Software Stack

| Layer                        | Technology                                      |
| ---------------------------- | ----------------------------------------------- |
| **Frontend**                 | React.js, Tailwind CSS, Recharts, Framer Motion |
| **Backend / Cloud**          | Firebase Realtime Database                      |
| **Microcontroller Firmware** | Arduino IDE (C++)                               |
| **Communication Protocol**   | Firebase REST API over Wi-Fi                    |
| **Visualization**            | Recharts (line, area, and trend charts)         |

---

## 🌦 Web Dashboard (React)

### ✨ Features:

- Animated real-time cards for all sensor data
- Auto-refresh every minute (sync with ESP32)
- Synthetic variance generator for dynamic display
- Multiple charts:

  - Temperature & Humidity
  - Particulate Matter (PM2.5, PM10)
  - Carbon Monoxide (CO)
  - Nitrogen Dioxide (NO₂)
  - CO₂ Concentration

- System health panel showing update frequency and connection status

---

## 📡 Firebase Integration

The ESP32 uploads sensor data as JSON to Firebase Realtime Database:

```json
{
  "timestamp": 1730000000000,
  "temperature": 28.5,
  "humidity": 61.2,
  "co2": 875,
  "pm25": 32,
  "pm10": 48,
  "light": 720,
  "co": 3.4,
  "no2": 0.035
}
```

The frontend fetches this data via the `useAppContext` hook and visualizes it in real time.

---

## 🔔 Alert Mechanism

| Condition                           | Action                              |
| ----------------------------------- | ----------------------------------- |
| CO₂ > 1000 ppm                      | Display “Air Quality Alert ⚠️”      |
| PM2.5 > 35 μg/m³ or PM10 > 50 μg/m³ | LED + Buzzer ON                     |
| NO₂ > 0.05 ppm or CO > 9 ppm        | Alert visualization turns red       |
| Safe levels                         | Green “Air Quality is Safe 🌿” card |

---

## 🌱 Future Roadmap

1. **AI-Powered Forecasting** — Predict air quality fluctuations using ML.
2. **Citizen Mobile App** — Real-time map, health alerts, and safety tips.
3. **Smart City Integration** — Share open APIs with municipal dashboards.
4. **Energy Optimization** — Sleep-mode firmware + solar efficiency.
5. **Community Awareness** — Open data dashboards and campaigns.

---

## 🧩 Benefits

- Promotes environmental transparency
- Enables preventive health measures
- Helps government in pollution policy-making
- Supports sustainable technology goals
- Offers educational & research value

---

## 💬 Quote

> “We can’t control the wind, but we can measure the air we breathe — and that’s the first step toward a cleaner tomorrow.”

---

## 🏁 Conclusion

> “Technology is powerful — but only when it serves humanity.”
> This project unites IoT, Cloud, and AI to monitor air quality, protect health, and inspire a greener world.

---
