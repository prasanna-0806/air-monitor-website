# 🌿 Smart Air Monitor

> A full-stack IoT system that monitors indoor air quality in real time, stores data in the cloud, and uses machine learning to predict future air conditions.

**Live Demo:** [smart-air-monitor-system.vercel.app](https://smart-air-monitor-system.vercel.app)  
**ML API:** [air-monitor-api.onrender.com](https://air-monitor-api.onrender.com)

---

## 📸 Overview

Indoor air quality directly affects focus, sleep, and long-term health — yet most people have no visibility into it. This project solves that with a fully deployed IoT + ML pipeline:

- **Hardware** reads real sensor data every 10 seconds
- **Cloud database** stores all readings permanently
- **React dashboard** visualizes live trends from anywhere in the world
- **ML model** predicts future air quality with 97.5% accuracy
- **FastAPI backend** serves predictions via REST API

---

## 🏗️ Architecture

```
ESP32 (Hardware)
    │
    ├── MQ135 Gas Sensor
    ├── DHT22 Temp/Humidity Sensor
    └── OLED Display (SPI)
         │
         ▼
    WiFi (HTTP POST)
         │
         ▼
  Supabase (PostgreSQL)
    ├── Stores every reading
    └── Accessible via REST API
         │
    ┌────┴────────────────────┐
    ▼                         ▼
React Dashboard          FastAPI (Python)
(Vercel)                 (Render)
    │                         │
    ├── Live charts            ├── /predict (ML model)
    ├── Sensor cards           └── /ai-advice (Claude AI)
    └── Recommendations
```

---

## ✨ Features

- **Real-time monitoring** — Temperature, humidity, and gas levels updated every 10 seconds
- **Live charts** — Area charts showing trends over time
- **Cloud storage** — All data stored in Supabase PostgreSQL, accessible from anywhere
- **ML predictions** — Random Forest model predicts gas levels 30 seconds ahead
- **Smart recommendations** — Actionable advice based on current sensor readings
- **OLED display** — Standalone device shows live readings without needing a laptop
- **Fully deployed** — Frontend on Vercel, API on Render, database on Supabase

---

## 🛠️ Tech Stack

### Hardware
| Component | Purpose |
|-----------|---------|
| ESP32 (38-pin) | Main microcontroller + WiFi |
| MQ135 | Gas/air quality sensor |
| DHT22 | Temperature + humidity sensor |
| OLED (SPI, 6-pin) | Local display |

### Embedded
| Tool | Usage |
|------|-------|
| Arduino IDE | C++ firmware development |
| Adafruit libraries | OLED + DHT22 drivers |
| HTTPClient | REST API calls from ESP32 |
| ArduinoJson | JSON serialization |

### Backend
| Tool | Usage |
|------|-------|
| Python 3.11 | Backend language |
| FastAPI | REST API framework |
| Scikit-learn | Random Forest ML model |
| Joblib | Model serialization |
| httpx | Async HTTP client for Claude AI |
| Uvicorn | ASGI server |

### Frontend
| Tool | Usage |
|------|-------|
| React | UI framework |
| Recharts | Live area charts |
| Supabase JS | Real-time database queries |
| Tailwind CSS | Styling |
| Lucide React | Icons |

### Infrastructure
| Service | Usage |
|---------|-------|
| Supabase | PostgreSQL cloud database |
| Vercel | Frontend deployment |
| Render | Python API deployment |
| GitHub | Version control |

---

## 📊 ML Model

The Random Forest Regressor was trained on real sensor data collected from the ESP32:

```
Dataset:     339 readings from real IoT sensors
Features:    Temperature, Humidity, Gas Level
Target:      Gas level 30 seconds in the future
Algorithm:   Random Forest Regressor (100 trees)
Accuracy:    97.5% (R² Score: 0.9746)
MAE:         10.61 gas units
```

**Feature Importance:**
- Gas (current): 83.7%
- Temperature: 13.1%
- Humidity: 3.1%

---

## 🚀 Getting Started

### Hardware Setup

#### Wiring

**DHT22 → ESP32:**
| DHT22 Pin | ESP32 Pin |
|-----------|-----------|
| VCC (1) | 3V3 |
| DATA (2) | GPIO4 |
| GND (3) | GND |

**MQ135 → ESP32:**
| MQ135 Pin | ESP32 Pin |
|-----------|-----------|
| VCC | VIN (5V) |
| GND | GND |
| AO | GPIO34 |

**OLED (SPI) → ESP32:**
| OLED Pin | ESP32 Pin |
|----------|-----------|
| GND | GND |
| VCC | 3V3 |
| DO (CLK) | GPIO18 |
| D1 (MOSI) | GPIO23 |
| RES | GPIO16 |
| DC | GPIO17 |

#### Arduino Setup

1. Install Arduino IDE 2
2. Add ESP32 board support via Boards Manager URL:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
3. Install libraries: `DHT sensor library`, `Adafruit SSD1306`, `Adafruit GFX`, `ArduinoJson`
4. Open `esp32/main.ino`, fill in your WiFi credentials and Supabase URL/key
5. Upload to ESP32

---

### Backend Setup

```bash
cd air-monitor-api
pip install -r requirements.txt

# Add your Claude API key as environment variable
export CLAUDE_API_KEY=your_key_here

uvicorn main:app --reload
```

API will be live at `http://localhost:8000`

**Endpoints:**
- `GET /` — Health check
- `POST /predict` — ML prediction from sensor data
- `POST /ai-advice` — Claude AI recommendations

---

### Frontend Setup

```bash
cd air-monitor-website
npm install
npm start
```

Dashboard will open at `http://localhost:3000`

---

### ML Model Training

```bash
cd air-monitor-ml
pip install pandas scikit-learn matplotlib joblib

# Export sensor_data_rows.csv from Supabase first
python air_ml.py
```

This trains the model, shows evaluation charts, and saves `air_quality_model.pkl`

---

## 📁 Project Structure

```
smart-air-monitor/
├── esp32/
│   └── main.ino              # ESP32 firmware (C++)
├── air-monitor-website/
│   ├── src/
│   │   └── App.js            # React dashboard
│   └── package.json
├── air-monitor-api/
│   ├── main.py               # FastAPI backend
│   ├── air_quality_model.pkl # Trained ML model
│   └── requirements.txt
├── air-monitor-ml/
│   ├── air_ml.py             # Model training script
│   └── sensor_data_rows.csv  # Training data
└── README.md
```

---

## 📈 How It Works

1. **ESP32 reads sensors** every 10 seconds — temperature, humidity, gas level
2. **Data is sent** via HTTP POST to Supabase REST API
3. **React dashboard** queries Supabase every 10 seconds and updates charts
4. **ML API** receives latest readings and returns predicted gas level for next 30 seconds
5. **Recommendations** are generated based on current readings and thresholds

---

## 🌡️ Air Quality Scale

| Gas Value | Quality | Action |
|-----------|---------|--------|
| < 1000 | 🟢 Good | No action needed |
| 1000–2000 | 🟡 Moderate | Consider ventilation |
| > 2000 | 🔴 Bad | Open windows immediately |

---

## 📝 Resume Description

> Built a full-stack IoT indoor air monitoring system using ESP32, MQ135, and DHT22 sensors. Transmitted real-time sensor data to Supabase PostgreSQL via REST API. Developed a React dashboard with live area charts and smart recommendations. Trained a Random Forest ML model achieving 97.5% accuracy (R²=0.9746) on real IoT data. Deployed ML inference as a FastAPI REST API on Render, with the frontend live on Vercel.

---

## 🔮 Future Improvements

- [ ] Push notifications when air quality drops
- [ ] Historical analytics page with daily/weekly trends
- [ ] Support for multiple rooms/devices
- [ ] Mobile app (React Native)
- [ ] CO₂ specific sensor (MH-Z19) for more accurate readings
- [ ] Automated fan/AC control via relay module

---

## 👨‍💻 Author

**Prasanna** — Built from scratch with hardware, firmware, ML, and full-stack web development.

---

## 📄 License

MIT License — feel free to use this project for learning or building on top of it.
