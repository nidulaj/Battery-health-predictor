"use client";

interface BatteryHealthScoreProps {
  score: number;
  status: string;
}

export default function BatteryHealthScore({ score, status }: BatteryHealthScoreProps) {
  const getGradientColor = () => {
    if (score >= 80) return "from-green-400 to-emerald-500";
    if (score >= 60) return "from-yellow-400 to-orange-500";
    return "from-red-400 to-rose-500";
  };

  const getStatusColor = () => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  // Calculate the stroke-dasharray and offset for the circular progress
  const circumference = 2 * Math.PI * 90; // radius = 90
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-gradient-to-br from-indigo-950/80 to-purple-950/80 backdrop-blur-lg border border-purple-400/20 rounded-3xl p-6 animate-[scaleIn_0.6s_ease-out]">
      <h2 className="text-xl font-semibold text-white mb-6 text-center">
        Battery Health Score
      </h2>
      
      <div className="relative w-56 h-56 mx-auto mb-4">
        {/* Background gradient blur effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-yellow-500/20 rounded-full blur-3xl"></div>
        
        {/* SVG Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="rgba(139, 92, 246, 0.1)"
            strokeWidth="12"
          />
          
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-amber-500 mb-2">
            {score}%
          </div>
          <div className={`text-xl font-medium ${getStatusColor()}`}>
            {status}
          </div>
        </div>
      </div>
      
      {/* Status bar */}
      <div className="mt-6">
        <div className="flex justify-between items-center text-xs text-purple-200 mb-2">
          <span>Critical</span>
          <span>Fair</span>
          <span>Excellent</span>
        </div>
        <div className="h-1.5 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"></div>
      </div>
    </div>
  );
}
