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
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  console.log("Rendering BatteryChart with data:", data);

  const voltages = data.map(d => d.voltage).filter(v => !Number.isNaN(v));
  const currents = data.map(d => d.current).filter(c => !Number.isNaN(c));
  const temperatures = data.map(d => d.temperature).filter(t => !Number.isNaN(t));

  const badRows = data.filter(
  d =>
    Number.isNaN(d.voltage) ||
    Number.isNaN(d.current) ||
    Number.isNaN(d.temperature)
);

console.log("Bad rows:", badRows.length, badRows);


  // Calculate scales for visualization
  const maxVoltage = Math.max(...voltages);
const minVoltage = Math.min(...voltages);

const maxCurrent = Math.max(...currents);
const minCurrent = Math.min(...currents);

const maxTemperature = Math.max(...temperatures);
const minTemperature = Math.min(...temperatures);

  console.log("Max/Min Values:", {
    maxVoltage,
    minVoltage,
    maxCurrent,
    minCurrent,
    maxTemperature,
    minTemperature,
  });

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
    <div className="bg-gradient-to-br from-indigo-950/80 to-purple-950/80 backdrop-blur-lg border border-purple-400/20 rounded-3xl p-4 md:p-8 animate-[scaleIn_0.6s_ease-out_0.2s]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white">Battery Metrics Over Time</h2>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-300 ${
              filter === "all"
                ? "bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/50"
                : "bg-purple-500/20 text-purple-200 hover:bg-purple-500/30"
            }`}
          >
            <span className="flex items-center gap-1 md:gap-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-4 md:h-4">
                <path d="M2 8L8 2L14 8M8 2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="hidden sm:inline">All Metrics</span>
              <span className="sm:hidden">All</span>
            </span>
          </button>
          <button
            onClick={() => setFilter("voltage")}
            className={`px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-300 ${
              filter === "voltage"
                ? "bg-purple-500 text-white shadow-lg shadow-purple-500/50"
                : "bg-purple-500/20 text-purple-200 hover:bg-purple-500/30"
            }`}
          >
            Voltage
          </button>
          <button
            onClick={() => setFilter("current")}
            className={`px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-300 ${
              filter === "current"
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                : "bg-purple-500/20 text-purple-200 hover:bg-purple-500/30"
            }`}
          >
            Current
          </button>
          <button
            onClick={() => setFilter("temperature")}
            className={`px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-300 ${
              filter === "temperature"
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/50"
                : "bg-purple-500/20 text-purple-200 hover:bg-purple-500/30"
            }`}
          >
            <span className="hidden sm:inline">Temperature</span>
            <span className="sm:hidden">Temp</span>
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="relative bg-indigo-950/50 rounded-2xl p-2 md:p-6 overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto"
          style={{ minHeight: "200px" }}
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

          {/* Data points with hover effects */}
          {data.map((d, i) => {
            // Show every nth point to avoid clutter
            const showPoint = i % Math.max(1, Math.floor(data.length / 30)) === 0;
            if (!showPoint && hoveredPoint !== i) return null;

            // Calculate tooltip position - smart positioning to avoid edges
            const pointX = scaleX(i);
            const tooltipWidth = 160;
            const tooltipHeight = 85;
            const minY = Math.min(scaleVoltage(d.voltage), scaleCurrent(d.current), scaleTemperature(d.temperature));
            
            // Position tooltip to the left if too close to right edge
            const tooltipX = pointX + tooltipWidth + 10 > chartWidth - padding 
              ? pointX - tooltipWidth - 10 
              : pointX + 10;
            
            // Position tooltip above if too close to bottom
            const tooltipY = minY - tooltipHeight - 10 < padding 
              ? minY + 20 
              : minY - tooltipHeight - 10;

            return (
              <g key={`point-${i}`}>
                {/* Voltage point */}
                {shouldShow("voltage") && (
                  <circle
                    cx={scaleX(i)}
                    cy={scaleVoltage(d.voltage)}
                    r={hoveredPoint === i ? 8 : 4}
                    fill="#8b5cf6"
                    stroke="#4c1d95"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200"
                    style={{ zIndex: 10 }}
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                )}

                {/* Current point */}
                {shouldShow("current") && (
                  <circle
                    cx={scaleX(i)}
                    cy={scaleCurrent(d.current)}
                    r={hoveredPoint === i ? 8 : 4}
                    fill="#3b82f6"
                    stroke="#1e3a8a"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200"
                    style={{ zIndex: 10 }}
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                )}

                {/* Temperature point */}
                {shouldShow("temperature") && (
                  <circle
                    cx={scaleX(i)}
                    cy={scaleTemperature(d.temperature)}
                    r={hoveredPoint === i ? 8 : 4}
                    fill="#f97316"
                    stroke="#7c2d12"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200"
                    style={{ zIndex: 10 }}
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                )}

                {/* Tooltip on hover */}
                {hoveredPoint === i && (
                  <g style={{ pointerEvents: 'none' }}>
                    <rect
                      x={tooltipX}
                      y={tooltipY}
                      width={tooltipWidth}
                      height={tooltipHeight}
                      rx="8"
                      fill="rgba(17, 24, 39, 0.98)"
                      stroke="#8b5cf6"
                      strokeWidth="2"
                      filter="url(#tooltipShadow)"
                    />
                    <text
                      x={tooltipX + 10}
                      y={tooltipY + 20}
                      fill="#e0e7ff"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {d.timestamp}
                    </text>
                    {shouldShow("voltage") && (
                      <text
                        x={tooltipX + 10}
                        y={tooltipY + 38}
                        fill="#a78bfa"
                        fontSize="11"
                      >
                        Voltage: {d.voltage.toFixed(2)} V
                      </text>
                    )}
                    {shouldShow("current") && (
                      <text
                        x={tooltipX + 10}
                        y={tooltipY + 53}
                        fill="#60a5fa"
                        fontSize="11"
                      >
                        Current: {d.current.toFixed(2)} A
                      </text>
                    )}
                    {shouldShow("temperature") && (
                      <text
                        x={tooltipX + 10}
                        y={tooltipY + 68}
                        fill="#fb923c"
                        fontSize="11"
                      >
                        Temp: {d.temperature.toFixed(1)} °C
                      </text>
                    )}
                  </g>
                )}
              </g>
            );
          })}

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
            <filter id="tooltipShadow">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.5"/>
            </filter>
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
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-4 md:mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-blue-400 text-xs md:text-sm font-medium">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-orange-400 text-xs md:text-sm font-medium">Temperature</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-purple-400 text-xs md:text-sm font-medium">Voltage</span>
        </div>
      </div>

      {/* Range Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
        <div className="bg-purple-950/50 border border-purple-500/30 rounded-2xl p-4 md:p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-5 md:h-5">
              <path d="M10 2L6 10H10L10 18L14 10H10L10 2Z" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 className="text-purple-300 text-xs md:text-sm font-medium">Voltage Range</h3>
          </div>
          <p className="text-lg md:text-2xl font-bold text-white">
            {minVoltage.toFixed(2)} - {maxVoltage.toFixed(2)} V
          </p>
        </div>

        <div className="bg-blue-950/50 border border-blue-500/30 rounded-2xl p-4 md:p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-5 md:h-5">
              <path d="M2 10H18M13 5L18 10L13 15" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 className="text-blue-300 text-xs md:text-sm font-medium">Current Range</h3>
          </div>
          <p className="text-lg md:text-2xl font-bold text-white">
            {minCurrent.toFixed(2)} - {maxCurrent.toFixed(2)} A
          </p>
        </div>

        <div className="bg-orange-950/50 border border-orange-500/30 rounded-2xl p-4 md:p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-5 md:h-5">
              <path d="M10 15C11.6569 15 13 13.6569 13 12C13 11 12.5 10.2 11.8 9.7V5C11.8 5 10 5 10 5C9 5 8.5 5.5 8.5 6V9.7C7.8 10.2 7 11 7 12C7 13.6569 8.34315 15 10 15Z" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 className="text-orange-300 text-xs md:text-sm font-medium">Temp Range</h3>
          </div>
          <p className="text-lg md:text-2xl font-bold text-white">
            {minTemperature.toFixed(1)} - {maxTemperature.toFixed(1)} °C
          </p>
        </div>
      </div>
    </div>
  );
}
