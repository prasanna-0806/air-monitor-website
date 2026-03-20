import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Wind, Thermometer, Droplets, Activity } from "lucide-react";

const supabase = createClient(
  "https://wfxngnokkbabjuybzyie.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmeG5nbm9ra2JhYmp1eWJ6eWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMDU5NjYsImV4cCI6MjA4OTU4MTk2Nn0.wmPzedK43YUpKRxTnjaLvhLUABHT13xi5NnjcU2U3aM"
);

function getAirQuality(gas) {
  if (gas < 1000) return { label: "Good", color: "text-green-400", bg: "bg-green-400" };
  if (gas < 2000) return { label: "Moderate", color: "text-yellow-400", bg: "bg-yellow-400" };
  return { label: "Bad", color: "text-red-400", bg: "bg-red-400" };
}

function getRecommendations(temp, humidity, gas) {
  const tips = [];
  if (gas > 2000) {
    tips.push("🪟 Open windows immediately to ventilate the room");
    tips.push("🚫 Avoid burning candles or incense");
    tips.push("💨 Turn on a fan or air purifier");
  } else if (gas > 1000) {
    tips.push("🪟 Consider opening a window for fresh air");
    tips.push("🌿 Add indoor plants to improve air quality");
  } else {
    tips.push("✅ Air quality is good! Keep it up");
    tips.push("🌿 Maintain ventilation for fresh air");
  }
  if (humidity > 70) {
    tips.push("💧 Humidity is high — turn on AC or dehumidifier");
  } else if (humidity < 30) {
    tips.push("🌵 Air is too dry — use a humidifier");
  }
  if (temp > 32) {
    tips.push("🌡️ Temperature is high — turn on fan or AC");
  }
  return tips;
}

export default function App() {
  const [data, setData] = useState([]);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data: rows } = await supabase
      .from("sensor_data")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);

    if (rows && rows.length > 0) {
      const reversed = [...rows].reverse();
      const formatted = reversed.map((r) => ({
        ...r,
        time: new Date(r.created_at).toLocaleTimeString(),
      }));
      setData(formatted);
      setLatest(formatted[formatted.length - 1]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-cyan-400 text-2xl animate-pulse">Loading Air Monitor...</div>
    </div>
  );

  const airQuality = latest ? getAirQuality(latest.gas) : null;
  const recommendations = latest
    ? getRecommendations(latest.temperature, latest.humidity, latest.gas)
    : [];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-cyan-400">Smart Air Monitor</h1>
        <p className="text-gray-400 mt-2">Real-time indoor air quality monitoring</p>
        <p className="text-gray-600 text-sm mt-1">
          Last updated: {latest ? new Date(latest.created_at).toLocaleString() : "—"}
        </p>
      </div>

      {/* Stat Cards */}
      {latest && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <Thermometer size={20} />
              <span className="text-sm">Temperature</span>
            </div>
            <div className="text-3xl font-bold">{latest.temperature}°C</div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Droplets size={20} />
              <span className="text-sm">Humidity</span>
            </div>
            <div className="text-3xl font-bold">{latest.humidity}%</div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <Wind size={20} />
              <span className="text-sm">Gas Level</span>
            </div>
            <div className="text-3xl font-bold">{latest.gas}</div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Activity size={20} />
              <span className="text-sm">Air Quality</span>
            </div>
            <div className={`text-3xl font-bold ${airQuality.color}`}>
              {airQuality.label}
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">
            Temperature & Humidity
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="time" tick={{ fill: "#6b7280", fontSize: 10 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "none" }} />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#f87171" dot={false} name="Temp °C" />
              <Line type="monotone" dataKey="humidity" stroke="#60a5fa" dot={false} name="Humidity %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">Gas Level</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="time" tick={{ fill: "#6b7280", fontSize: 10 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "none" }} />
              <Line type="monotone" dataKey="gas" stroke="#34d399" dot={false} name="Gas" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-cyan-400">
          Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations.map((tip, i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-3 text-gray-300 text-sm">
              {tip}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-600 text-sm">
        Built with ESP32 • Supabase • React • ML Model
      </div>
    </div>
  );
}

