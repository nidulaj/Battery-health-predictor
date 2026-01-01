"use client";

import { useState } from "react";

interface DataPoint {
  timestamp: string;
  voltage: number;
  current: number;
  temperature: number;
}

interface BatteryChartProps {
  data: DataPoint[];
  voltageRange: { min: number; max: number };
  currentRange: { min: number; max: number };
  temperatureRange: { min: number; max: number };
}

type MetricFilter = "all" | "voltage" | "current" | "temperature";

export default function BatteryChart({
  data,
  voltageRange,
  currentRange,
  temperatureRange,
}: BatteryChartProps) {
  const [filter, setFilter] = useState<MetricFilter>("all");

  // Calculate scales for visualization
  const maxVoltage = Math.max(...data.map((d) => d.voltage));
  const maxCurrent = Math.max(...data.map((d) => d.current));
  const maxTemperature = Math.max(...data.map((d) => d.temperature));
  
  const minVoltage = Math.min(...data.map((d) => d.voltage));
  const minCurrent = Math.min(...data.map((d) => d.current));
  const minTemperature = Math.min(...data.map((d) => d.temperature));

  const chartWidth = 1200;
  const chartHeight = 300;
  const padding = 40;

  // Scale functions
  const scaleX = (index: number) => {
    return (index / (data.length - 1)) * (chartWidth - 2 * padding) + padding;
  };

  const scaleVoltage = (value: number) => {
    const range = maxVoltage - minVoltage;
    return chartHeight - padding - ((value - minVoltage) / range) * (chartHeight - 2 * padding);
  };

  const scaleCurrent = (value: number) => {
    const range = maxCurrent - minCurrent;
    return chartHeight - padding - ((value - minCurrent) / range) * (chartHeight - 2 * padding);
  };

  const scaleTemperature = (value: number) => {
    const range = maxTemperature - minTemperature;
    return chartHeight - padding - ((value - minTemperature) / range) * (chartHeight - 2 * padding);
  };

  // Generate path strings for each metric
  const voltagePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${scaleX(i)} ${scaleVoltage(d.voltage)}`)
    .join(" ");

  const currentPath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${scaleX(i)} ${scaleCurrent(d.current)}`)
    .join(" ");

  const temperaturePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${scaleX(i)} ${scaleTemperature(d.temperature)}`)
    .join(" ");

  const shouldShow = (metric: string) => {
    return filter === "all" || filter === metric;
  };

  return (
    <div className="bg-gradient-to-br from-indigo-950/80 to-purple-950/80 backdrop-blur-lg border border-purple-400/20 rounded-3xl p-8 animate-[scaleIn_0.6s_ease-out_0.2s]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-white">Battery Metrics Over Time</h2>
        
        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              filter === "all"
                ? "bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/50"
                : "bg-purple-500/20 text-purple-200 hover:bg-purple-500/30"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 8L8 2L14 8M8 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              All Metrics
            </span>
          </button>
          <button
            onClick={() => setFilter("voltage")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              filter === "voltage"
                ? "bg-purple-500 text-white shadow-lg shadow-purple-500/50"
                : "bg-purple-500/20 text-purple-200 hover:bg-purple-500/30"
            }`}
          >
            Voltage
          </button>
          <button
            onClick={() => setFilter("current")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              filter === "current"
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                : "bg-purple-500/20 text-purple-200 hover:bg-purple-500/30"
            }`}
          >
            Current
          </button>
          <button
            onClick={() => setFilter("temperature")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              filter === "temperature"
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/50"
                : "bg-purple-500/20 text-purple-200 hover:bg-purple-500/30"
            }`}
          >
            Temperature
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="relative bg-indigo-950/50 rounded-2xl p-6 overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto"
          style={{ minHeight: "300px" }}
        >
          {/* Grid lines */}
          <g opacity="0.1">
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={`grid-${i}`}
                x1={padding}
                y1={padding + (i * (chartHeight - 2 * padding)) / 4}
                x2={chartWidth - padding}
                y2={padding + (i * (chartHeight - 2 * padding)) / 4}
                stroke="white"
                strokeWidth="1"
              />
            ))}
          </g>

          {/* Current line */}
          {shouldShow("current") && (
            <path
              d={currentPath}
              fill="none"
              stroke="url(#currentGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-[drawLine_2s_ease-out]"
            />
          )}

          {/* Temperature line */}
          {shouldShow("temperature") && (
            <path
              d={temperaturePath}
              fill="none"
              stroke="url(#temperatureGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-[drawLine_2s_ease-out]"
            />
          )}

          {/* Voltage line */}
          {shouldShow("voltage") && (
            <path
              d={voltagePath}
              fill="none"
              stroke="url(#voltageGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-[drawLine_2s_ease-out]"
            />
          )}

          {/* Gradients */}
          <defs>
            <linearGradient id="voltageGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
            <linearGradient id="currentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
            <linearGradient id="temperatureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
          </defs>

          {/* X-axis labels */}
          <g>
            {data.filter((_, i) => i % Math.floor(data.length / 8) === 0).map((d, i) => (
              <text
                key={`xlabel-${i}`}
                x={scaleX(i * Math.floor(data.length / 8))}
                y={chartHeight - 10}
                textAnchor="middle"
                fill="#a78bfa"
                fontSize="11"
              >
                {d.timestamp}
              </text>
            ))}
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center gap-8 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-blue-400 text-sm font-medium">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-orange-400 text-sm font-medium">Temperature</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-purple-400 text-sm font-medium">Voltage</span>
        </div>
      </div>

      {/* Range Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-purple-950/50 border border-purple-500/30 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2L6 10H10L10 18L14 10H10L10 2Z" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 className="text-purple-300 text-sm font-medium">Voltage Range</h3>
          </div>
          <p className="text-2xl font-bold text-white">
            {voltageRange.min.toFixed(2)} - {voltageRange.max.toFixed(2)} V
          </p>
        </div>

        <div className="bg-blue-950/50 border border-blue-500/30 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 10H18M13 5L18 10L13 15" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 className="text-blue-300 text-sm font-medium">Current Range</h3>
          </div>
          <p className="text-2xl font-bold text-white">
            {currentRange.min.toFixed(2)} - {currentRange.max.toFixed(2)} A
          </p>
        </div>

        <div className="bg-orange-950/50 border border-orange-500/30 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 15C11.6569 15 13 13.6569 13 12C13 11 12.5 10.2 11.8 9.7V5C11.8 5 10 5 10 5C9 5 8.5 5.5 8.5 6V9.7C7.8 10.2 7 11 7 12C7 13.6569 8.34315 15 10 15Z" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 className="text-orange-300 text-sm font-medium">Temp Range</h3>
          </div>
          <p className="text-2xl font-bold text-white">
            {temperatureRange.min.toFixed(1)} - {temperatureRange.max.toFixed(1)} °C
          </p>
        </div>
      </div>
    </div>
  );
}
