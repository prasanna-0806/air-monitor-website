import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from "recharts";
import { Wind, Thermometer, Droplets, Activity } from "lucide-react";


const supabase = createClient(
  "https://wfxngnokkbabjuybzyie.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmeG5nbm9ra2JhYmp1eWJ6eWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMDU5NjYsImV4cCI6MjA4OTU4MTk2Nn0.wmPzedK43YUpKRxTnjaLvhLUABHT13xi5NnjcU2U3aM"
);

function getAirQuality(gas) {
  if (gas < 1000) return { label: "Good", color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)" };
  if (gas < 2000) return { label: "Moderate", color: "#eab308", bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.3)" };
  return { label: "Bad", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)" };
}

function getRecommendations(temp, humidity, gas) {
  const tips = [];
  if (gas > 2000) {
    tips.push({ icon: "🪟", text: "Open windows immediately to ventilate the room", level: "high" });
    tips.push({ icon: "🚫", text: "Avoid burning candles or incense right now", level: "high" });
    tips.push({ icon: "💨", text: "Turn on a fan or air purifier immediately", level: "high" });
  } else if (gas > 1000) {
    tips.push({ icon: "🪟", text: "Consider opening a window for fresh air", level: "medium" });
    tips.push({ icon: "🌿", text: "Add indoor plants to improve air quality", level: "medium" });
    tips.push({ icon: "⏰", text: "Monitor air quality over next 30 minutes", level: "medium" });
  } else {
    tips.push({ icon: "✅", text: "Air quality is great! Keep it up", level: "low" });
    tips.push({ icon: "🌿", text: "Maintain ventilation for continued fresh air", level: "low" });
    tips.push({ icon: "😊", text: "Great conditions for productivity and sleep", level: "low" });
  }
  if (humidity > 70) tips.push({ icon: "💧", text: "High humidity — turn on AC or dehumidifier", level: "medium" });
  if (humidity < 30) tips.push({ icon: "🌵", text: "Air too dry — consider using a humidifier", level: "medium" });
  if (temp > 32) tips.push({ icon: "🌡️", text: "High temperature — turn on fan or AC", level: "medium" });
  return tips;
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body { 
    font-family: 'Inter', sans-serif;
    background: #020817;
    color: #e2e8f0;
    overflow-x: hidden;
  }

  .hero-bg {
    background: radial-gradient(ellipse at top, #0f1f3d 0%, #020817 60%);
    position: relative;
    overflow: hidden;
  }

  .hero-bg::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 30% 40%, rgba(56,189,248,0.05) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(168,85,247,0.05) 0%, transparent 50%);
    animation: bgFloat 8s ease-in-out infinite alternate;
  }

  @keyframes bgFloat {
    0% { transform: translate(0, 0); }
    100% { transform: translate(2%, 2%); }
  }

  .glow-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .glow-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(56,189,248,0.2), rgba(168,85,247,0.2), transparent);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .glow-card:hover::before { opacity: 1; }
  .glow-card:hover { 
    background: rgba(255,255,255,0.05);
    transform: translateY(-2px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  }

  .stat-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 24px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .stat-card::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 80px; height: 80px;
    border-radius: 50%;
    filter: blur(30px);
    opacity: 0.3;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 25px 50px rgba(0,0,0,0.5);
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .pulse-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.5); }
  }

  .section-title {
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(135deg, #e2e8f0, #94a3b8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
  }

  .gradient-text {
    background: linear-gradient(135deg, #38bdf8, #818cf8, #c084fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tip-card {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 16px 20px;
    border-radius: 12px;
    transition: all 0.2s;
  }

  .tip-card:hover { transform: translateX(4px); }

  .nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    backdrop-filter: blur(20px);
    background: rgba(2,8,23,0.8);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .scroll-indicator {
    position: fixed;
    top: 0; left: 0;
    height: 3px;
    background: linear-gradient(90deg, #38bdf8, #818cf8, #c084fc);
    transition: width 0.1s;
    z-index: 101;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fade-in { animation: fadeInUp 0.6s ease forwards; }
  .fade-in-delay-1 { animation: fadeInUp 0.6s ease 0.1s forwards; opacity: 0; }
  .fade-in-delay-2 { animation: fadeInUp 0.6s ease 0.2s forwards; opacity: 0; }
  .fade-in-delay-3 { animation: fadeInUp 0.6s ease 0.3s forwards; opacity: 0; }

  .importance-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 28px;
    transition: all 0.3s;
  }
  .importance-card:hover {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.12);
    transform: translateY(-4px);
  }
`;

export default function App() {
  const [data, setData] = useState([]);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((window.scrollY / total) * 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

      const last = rows[0];
      try {
        const res = await fetch("https://air-monitor-api.onrender.com/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            temperature: last.temperature,
            humidity: last.humidity,
            gas: last.gas
          })
        });
        const pred = await res.json();
        setPrediction(pred);
      } catch (e) {
        console.log("Prediction error:", e);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#020817", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <style>{styles}</style>
      <div style={{ width: 48, height: 48, border: "3px solid rgba(56,189,248,0.2)", borderTop: "3px solid #38bdf8", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: "#64748b", fontSize: 14 }}>Loading sensor data...</p>
    </div>
  );

  const airQuality = latest ? getAirQuality(latest.gas) : null;
  const recommendations = latest ? getRecommendations(latest.temperature, latest.humidity, latest.gas) : [];

  return (
    <>
      <style>{styles}</style>

      {/* Scroll progress */}
      <div className="scroll-indicator" style={{ width: `${scrollProgress}%` }} />

      {/* Navbar */}
      <nav className="nav">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>🌿</span>
            <span style={{ fontWeight: 700, fontSize: 16, background: "linear-gradient(135deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Smart Air Monitor
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="pulse-dot" />
            <span style={{ fontSize: 13, color: "#64748b" }}>Live</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-bg" style={{ paddingTop: 120, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="fade-in">
            <div className="badge" style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", color: "#38bdf8", margin: "0 auto 24px" }}>
              <div className="pulse-dot" />
              Real-time IoT Monitoring
            </div>
          </div>
          <h1 className="fade-in-delay-1" style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
            Breathe <span className="gradient-text">Smarter</span><br />
            Live Healthier
          </h1>
          <p className="fade-in-delay-2" style={{ fontSize: 18, color: "#64748b", maxWidth: 600, margin: "0 auto 48px", lineHeight: 1.7 }}>
            Your indoor air quality directly impacts focus, sleep, and health. 
            Our IoT system monitors your environment 24/7 and gives you actionable insights.
          </p>

          {/* Quick stats hero */}
          {latest && (
            <div className="fade-in-delay-3" style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ padding: "12px 24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 100, fontSize: 14, color: "#94a3b8" }}>
                🌡️ {latest.temperature}°C
              </div>
              <div style={{ padding: "12px 24px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 100, fontSize: 14, color: "#94a3b8" }}>
                💧 {latest.humidity}% humidity
              </div>
              <div style={{ padding: "12px 24px", background: `rgba(${airQuality.color === '#22c55e' ? '34,197,94' : airQuality.color === '#eab308' ? '234,179,8' : '239,68,68'},0.1)`, border: `1px solid ${airQuality.border}`, borderRadius: 100, fontSize: 14, color: airQuality.color, fontWeight: 600 }}>
                ● Air: {airQuality.label}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why Air Quality Matters */}
      <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 className="section-title">Why Indoor Air Quality Matters</h2>
          <p style={{ color: "#64748b", fontSize: 15 }}>Poor air quality affects more than you think</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          {[
            { icon: "🧠", title: "Focus & Productivity", desc: "Poor air quality reduces cognitive performance by up to 50%. High CO₂ leads to brain fog and slower thinking.", color: "#38bdf8" },
            { icon: "😴", title: "Sleep Quality", desc: "Pollutants and high humidity disrupt sleep cycles. Clean air improves deep sleep duration significantly.", color: "#818cf8" },
            { icon: "❤️", title: "Long-term Health", desc: "Continuous exposure to indoor pollutants increases risk of respiratory and cardiovascular diseases.", color: "#f43f5e" },
            { icon: "⚡", title: "Energy Levels", desc: "Fresh, well-ventilated air boosts oxygen levels keeping you energized and alert throughout the day.", color: "#22c55e" },
          ].map((item, i) => (
            <div key={i} className="importance-card">
              <div style={{ fontSize: 36, marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: item.color, marginBottom: 10 }}>{item.title}</h3>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Data Section */}
      <section style={{ padding: "0 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 className="section-title">Live Sensor Data</h2>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              Last updated: {latest ? new Date(latest.created_at).toLocaleString() : "—"}
            </p>
          </div>
          <div className="badge" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e" }}>
            <div className="pulse-dot" />
            Updates every 10s
          </div>
        </div>

        {/* Stat Cards */}
        {latest && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
            <div className="stat-card" style={{ borderColor: "rgba(248,113,113,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ padding: 10, background: "rgba(248,113,113,0.1)", borderRadius: 12 }}>
                  <Thermometer size={20} color="#f87171" />
                </div>
                <span style={{ fontSize: 12, color: "#64748b" }}>Temperature</span>
              </div>
              <div style={{ fontSize: 40, fontWeight: 800, color: "#f87171", lineHeight: 1 }}>{latest.temperature}</div>
              <div style={{ fontSize: 16, color: "#64748b", marginTop: 4 }}>°Celsius</div>
            </div>

            <div className="stat-card" style={{ borderColor: "rgba(96,165,250,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ padding: 10, background: "rgba(96,165,250,0.1)", borderRadius: 12 }}>
                  <Droplets size={20} color="#60a5fa" />
                </div>
                <span style={{ fontSize: 12, color: "#64748b" }}>Humidity</span>
              </div>
              <div style={{ fontSize: 40, fontWeight: 800, color: "#60a5fa", lineHeight: 1 }}>{latest.humidity}</div>
              <div style={{ fontSize: 16, color: "#64748b", marginTop: 4 }}>% Relative</div>
            </div>

            <div className="stat-card" style={{ borderColor: "rgba(52,211,153,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ padding: 10, background: "rgba(52,211,153,0.1)", borderRadius: 12 }}>
                  <Wind size={20} color="#34d399" />
                </div>
                <span style={{ fontSize: 12, color: "#64748b" }}>Gas Level</span>
              </div>
              <div style={{ fontSize: 40, fontWeight: 800, color: "#34d399", lineHeight: 1 }}>{latest.gas}</div>
              <div style={{ fontSize: 16, color: "#64748b", marginTop: 4 }}>Raw value</div>
            </div>

            <div className="stat-card" style={{ borderColor: airQuality.border }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ padding: 10, background: airQuality.bg, borderRadius: 12 }}>
                  <Activity size={20} color={airQuality.color} />
                </div>
                <span style={{ fontSize: 12, color: "#64748b" }}>Air Quality</span>
              </div>
              <div style={{ fontSize: 40, fontWeight: 800, color: airQuality.color, lineHeight: 1 }}>{airQuality.label}</div>
              <div style={{ fontSize: 16, color: "#64748b", marginTop: 4 }}>Overall index</div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 20 }}>
          <div className="glow-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#94a3b8", marginBottom: 20 }}>Temperature & Humidity</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="time" tick={{ fill: "#475569", fontSize: 10 }} />
                <YAxis tick={{ fill: "#475569", fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0" }} />
                <Legend wrapperStyle={{ color: "#64748b", fontSize: 12 }} />
                <Area type="monotone" dataKey="temperature" stroke="#f87171" fill="url(#tempGrad)" strokeWidth={2} dot={false} name="Temp °C" />
                <Area type="monotone" dataKey="humidity" stroke="#60a5fa" fill="url(#humGrad)" strokeWidth={2} dot={false} name="Humidity %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glow-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#94a3b8", marginBottom: 20 }}>Gas Level Over Time</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="gasGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="time" tick={{ fill: "#475569", fontSize: 10 }} />
                <YAxis tick={{ fill: "#475569", fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e2e8f0" }} />
                <Area type="monotone" dataKey="gas" stroke="#34d399" fill="url(#gasGrad)" strokeWidth={2} dot={false} name="Gas Level" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ML Prediction */}
      {prediction && (
        <section style={{ padding: "0 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 32 }}>
            <h2 className="section-title">ML Prediction</h2>
            <p style={{ color: "#64748b", fontSize: 14 }}>Random Forest model — 97.5% accuracy</p>
          </div>
          <div className="glow-card" style={{ padding: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20, marginBottom: 24 }}>
              <div style={{ textAlign: "center", padding: 20, background: "rgba(168,85,247,0.05)", borderRadius: 12, border: "1px solid rgba(168,85,247,0.15)" }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: "#a855f7" }}>{prediction.predicted_gas}</div>
                <div style={{ color: "#64748b", fontSize: 13, marginTop: 6 }}>Predicted Gas</div>
              </div>
              <div style={{ textAlign: "center", padding: 20, background: "rgba(56,189,248,0.05)", borderRadius: 12, border: "1px solid rgba(56,189,248,0.15)" }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: "#38bdf8" }}>{prediction.predicted_quality}</div>
                <div style={{ color: "#64748b", fontSize: 13, marginTop: 6 }}>Predicted Quality</div>
              </div>
              <div style={{ textAlign: "center", padding: 20, background: "rgba(34,197,94,0.05)", borderRadius: 12, border: "1px solid rgba(34,197,94,0.15)" }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: "#22c55e" }}>{prediction.current_gas}</div>
                <div style={{ color: "#64748b", fontSize: 13, marginTop: 6 }}>Current Gas</div>
              </div>
              <div style={{ textAlign: "center", padding: 20, background: "rgba(234,179,8,0.05)", borderRadius: 12, border: "1px solid rgba(234,179,8,0.15)" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#eab308" }}>30s</div>
                <div style={{ color: "#64748b", fontSize: 13, marginTop: 6 }}>Prediction Window</div>
              </div>
            </div>
            <div style={{ padding: "14px 20px", background: "rgba(168,85,247,0.05)", borderRadius: 10, border: "1px solid rgba(168,85,247,0.15)" }}>
              <span style={{ color: "#a855f7", fontWeight: 600, fontSize: 13 }}>ML Insight: </span>
              <span style={{ color: "#94a3b8", fontSize: 13 }}>{prediction.advice}</span>
            </div>
          </div>
        </section>
      )}

      {/* Recommendations */}
      <section style={{ padding: "0 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <h2 className="section-title">Recommendations</h2>
          <p style={{ color: "#64748b", fontSize: 14 }}>Based on your current sensor readings</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
          {recommendations.map((tip, i) => (
            <div key={i} className="tip-card" style={{
              background: tip.level === "high" ? "rgba(239,68,68,0.05)" : tip.level === "medium" ? "rgba(234,179,8,0.05)" : "rgba(34,197,94,0.05)",
              border: `1px solid ${tip.level === "high" ? "rgba(239,68,68,0.2)" : tip.level === "medium" ? "rgba(234,179,8,0.2)" : "rgba(34,197,94,0.2)"}`,
            }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{tip.icon}</span>
              <div>
                <p style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.6 }}>{tip.text}</p>
                <span style={{ fontSize: 11, color: tip.level === "high" ? "#ef4444" : tip.level === "medium" ? "#eab308" : "#22c55e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {tip.level === "high" ? "Action Required" : tip.level === "medium" ? "Suggested" : "All Good"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontSize: 22, marginBottom: 12 }}>🌿</div>
          <p style={{ color: "#334155", fontSize: 13, marginBottom: 8 }}>
            Built with ESP32 • MQ135 • DHT22 • Supabase • React • FastAPI • Random Forest ML
          </p>
          <p style={{ color: "#1e293b", fontSize: 12 }}>Smart Air Monitor — Real-time IoT Dashboard</p>
        </div>
      </footer>
    </>
  );
}
