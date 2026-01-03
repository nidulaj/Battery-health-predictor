"use client";

import { useEffect, useState } from "react";
import { useBattery } from "@/app/context/BatteryContext";
import { useRouter } from "next/navigation";
import BatteryHealthScore from "./components/BatteryHealthScore";
import MetricsCard from "./components/MetricsCard";
import BatteryChart from "./components/BatteryChart";

export default function AnalysisPage() {
  const router = useRouter();
  const { file } = useBattery();

  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("");
  const [metrics, setMetrics] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (!file) return;

    const parseCSVForChart = async (file: File) => {
  const text = await file.text();
  const lines = text.split("\n").slice(1);

  return lines
    .filter(line => line.trim() !== "") // 🚀 removes empty last row
    .map(line => {
      const [timestamp, voltage_v, current_ma, temperature_c] = line.split(",");

      return {
        timestamp,
        voltage: Number(voltage_v),
        current: Number(current_ma),
        temperature: Number(temperature_c),
      };
    });
};


    const run = async () => {
      setLoading(true);

      // --- Backend prediction ---
      const formData = new FormData();
      formData.append("file", file);
      console.log("Uploading file for prediction:", file.name);

      const res = await fetch("http://localhost:5000/predict_csv", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Prediction data:", data);

      setHealth(data.predicted_battery_health);
      setStatus(data.battery_status);
      setMetrics(data.averages);

      // --- CSV parsing for chart ---
      const parsed = await parseCSVForChart(file);
      console.log("Parsed CSV Data:", parsed);
      setChartData(parsed);

      setLoading(false);
    };

    run();

  }, [file]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Analyzing battery data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-purple-900 relative overflow-x-hidden">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center p-6 md:p-8 relative z-10 animate-[slideDown_0.6s_ease-out] gap-4">
        <div
          className="flex items-center gap-3 text-white text-xl font-semibold cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => router.push("/")}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-purple-300"
          >
            <rect
              x="7"
              y="4"
              width="10"
              height="14"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M10 2H14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M9 12H15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span>BatteryHealth AI</span>
        </div>

        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-6 py-3 bg-purple-500/20 text-purple-200 border border-purple-400/30 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-purple-500/30 hover:text-white hover:border-purple-400/50"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 2V10M8 10L5 7M8 10L11 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 14H14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Download
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8 pb-16">
        {/* Top Section: Health Score and Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Battery Health Score */}
          {health !== null && (
            <BatteryHealthScore score={Math.round(health)} status={status} />
          )}

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 gap-6">
            <MetricsCard
              title="Average Voltage"
              value={metrics?.avg_voltage}
              unit="V"
              icon="voltage"
              gradient="from-purple-950/80 to-fuchsia-950/80"
            />
            <MetricsCard
              title="Average Current"
              value={metrics?.avg_current}
              unit="A"
              icon="current"
              gradient="from-indigo-950/80 to-blue-950/80"
            />
            <MetricsCard
              title="Average Temperature"
              value={metrics?.avg_temperature}
              unit="°C"
              icon="temperature"
              gradient="from-orange-950/80 to-amber-950/80"
            />
          </div>
        </div>

        {/* Chart Section */}
        {chartData.length > 0 && (
          <BatteryChart
            data={chartData}
            voltageRange={{
              min: Math.min(...chartData.map((d) => d.voltage_v)),
              max: Math.max(...chartData.map((d) => d.voltage_v)),
            }}
            currentRange={{
              min: Math.min(...chartData.map((d) => d.current_ma)),
              max: Math.max(...chartData.map((d) => d.current_ma)),
            }}
            temperatureRange={{
              min: Math.min(...chartData.map((d) => d.temperature_c)),
              max: Math.max(...chartData.map((d) => d.temperature_c)),
            }}
          />
        )}

        {/* Health Analysis Summary */}
        <div className="mt-8 bg-gradient-to-br from-indigo-950/80 to-purple-950/80 backdrop-blur-lg border border-purple-400/20 rounded-3xl p-8 animate-[scaleIn_0.6s_ease-out_0.3s]">
          <div className="flex items-center gap-3 mb-6">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-purple-300"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M9 12L11 14L15 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-white">
              Health Analysis Summary
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-purple-300 text-sm mb-2">
                Data Points Analyzed
              </p>
              <p className="text-3xl font-bold text-white">
                {chartData.length}
              </p>
            </div>
            <div>
              <p className="text-purple-300 text-sm mb-2">Health Assessment</p>
              <p className="text-3xl font-bold text-yellow-400">{status}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
