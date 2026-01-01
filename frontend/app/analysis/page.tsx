"use client";

import { useRouter } from "next/navigation";
import BatteryHealthScore from "./components/BatteryHealthScore";
import MetricsCard from "./components/MetricsCard";
import BatteryChart from "./components/BatteryChart";

// Generate dummy data for 50 data points
const generateDummyData = () => {
  const data = [];
  const baseTime = new Date("2024-01-01T22:44:16");
  
  for (let i = 0; i < 50; i++) {
    const time = new Date(baseTime.getTime() + i * 30000); // 30 seconds intervals
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    const seconds = time.getSeconds().toString().padStart(2, "0");
    
    data.push({
      timestamp: `${hours}:${minutes}:${seconds}`,
      voltage: 3.54 + Math.random() * (4.15 - 3.54),
      current: 1.15 + Math.random() * (2.47 - 1.15),
      temperature: 21.0 + Math.random() * (33.7 - 21.0),
    });
  }
  
  return data;
};

export default function AnalysisPage() {
  const router = useRouter();
  const dummyData = generateDummyData();
  
  // Calculate averages
  const avgVoltage = dummyData.reduce((sum, d) => sum + d.voltage, 0) / dummyData.length;
  const avgCurrent = dummyData.reduce((sum, d) => sum + d.current, 0) / dummyData.length;
  const avgTemperature = dummyData.reduce((sum, d) => sum + d.temperature, 0) / dummyData.length;
  
  // Calculate ranges
  const voltageRange = {
    min: Math.min(...dummyData.map((d) => d.voltage)),
    max: Math.max(...dummyData.map((d) => d.voltage)),
  };
  
  const currentRange = {
    min: Math.min(...dummyData.map((d) => d.current)),
    max: Math.max(...dummyData.map((d) => d.current)),
  };
  
  const temperatureRange = {
    min: Math.min(...dummyData.map((d) => d.temperature)),
    max: Math.max(...dummyData.map((d) => d.temperature)),
  };

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
            <path d="M10 2H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
              d="M12 8H4M4 8L8 12M4 8L8 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          New Analysis
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8 pb-16">
        {/* Top Section: Health Score and Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Battery Health Score */}
          <BatteryHealthScore score={68} status="Fair" />
          
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 gap-6">
            <MetricsCard
              title="Average Voltage"
              value={avgVoltage}
              unit="V"
              icon="voltage"
              gradient="from-purple-950/80 to-fuchsia-950/80"
            />
            <MetricsCard
              title="Average Current"
              value={avgCurrent}
              unit="A"
              icon="current"
              gradient="from-indigo-950/80 to-blue-950/80"
            />
            <MetricsCard
              title="Average Temperature"
              value={avgTemperature}
              unit="°C"
              icon="temperature"
              gradient="from-orange-950/80 to-amber-950/80"
            />
          </div>
        </div>

        {/* Chart Section */}
        <BatteryChart
          data={dummyData}
          voltageRange={voltageRange}
          currentRange={currentRange}
          temperatureRange={temperatureRange}
        />

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
            <h2 className="text-2xl font-semibold text-white">Health Analysis Summary</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-purple-300 text-sm mb-2">Data Points Analyzed</p>
              <p className="text-5xl font-bold text-white">{dummyData.length}</p>
            </div>
            <div>
              <p className="text-purple-300 text-sm mb-2">Health Assessment</p>
              <p className="text-5xl font-bold text-yellow-400">Fair</p>
            </div>
          </div>

          <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 flex items-start gap-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-yellow-400 flex-shrink-0 mt-1"
            >
              <path
                d="M12 2L2 22H22L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 9V13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="17" r="1" fill="currentColor" />
            </svg>
            <p className="text-yellow-100 text-base leading-relaxed">
              Your battery shows moderate wear. Consider optimizing charging patterns.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
