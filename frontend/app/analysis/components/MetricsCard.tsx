"use client";

interface MetricsCardProps {
  title: string;
  value: number;
  unit: string;
  icon: "voltage" | "current" | "temperature";
  gradient: string;
}

export default function MetricsCard({ title, value, unit, icon, gradient }: MetricsCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "voltage":
        return (
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M16 4L8 16H16L16 28L24 16H16L16 4Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="currentColor"
              fillOpacity="0.2"
            />
          </svg>
        );
      case "current":
        return (
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M4 16 H28 M20 8 L28 16 L20 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 12 L4 20 M8 12 L8 20 M12 12 L12 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case "temperature":
        return (
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M16 24C18.2091 24 20 22.2091 20 20C20 18.6863 19.4148 17.5053 18.5 16.7324V8C18.5 6.61929 17.3807 5.5 16 5.5C14.6193 5.5 13.5 6.61929 13.5 8V16.7324C12.5852 17.5053 12 18.6863 12 20C12 22.2091 13.7909 24 16 24Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="currentColor"
              fillOpacity="0.2"
            />
            <path
              d="M16 20V12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
    }
  };

  const getGlowColor = () => {
    switch (icon) {
      case "voltage":
        return "rgba(236, 72, 153, 0.3)";
      case "current":
        return "rgba(59, 130, 246, 0.3)";
      case "temperature":
        return "rgba(249, 115, 22, 0.3)";
    }
  };

  return (
    <div
      className={`bg-gradient-to-br ${gradient} backdrop-blur-lg border border-purple-400/20 rounded-2xl p-6 relative overflow-hidden animate-[scaleIn_0.6s_ease-out] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
      style={{
        boxShadow: `0 8px 32px ${getGlowColor()}`,
      }}
    >
      {/* Decorative dot */}
      <div className="absolute top-4 right-4">
        <div className={`w-2 h-2 rounded-full bg-${icon === 'voltage' ? 'pink' : icon === 'current' ? 'blue' : 'orange'}-400 animate-pulse`}></div>
      </div>

      {/* Icon */}
      <div className="mb-4 w-12 h-12 flex items-center justify-center">
        {getIcon()}
      </div>

      {/* Title */}
      <h3 className="text-purple-200 text-sm font-medium mb-2">{title}</h3>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-bold text-white">{value.toFixed(2)}</span>
        <span className="text-2xl font-semibold text-purple-200">{unit}</span>
      </div>

      {/* Decorative bottom border gradient */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
        icon === 'voltage' ? 'from-pink-500 via-fuchsia-500 to-purple-500' :
        icon === 'current' ? 'from-blue-500 via-cyan-500 to-teal-500' :
        'from-orange-500 via-amber-500 to-yellow-500'
      }`}></div>
    </div>
  );
}
