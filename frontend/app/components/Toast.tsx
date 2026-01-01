'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[2000] animate-[slideDown_0.4s_ease-out]">
      <div className="bg-linear-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full flex items-center gap-3 shadow-[0_10px_30px_rgba(16,185,129,0.4)] font-semibold text-base">
        <div className="flex items-center justify-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
            <path
              d="M7 10L9 12L13 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="whitespace-nowrap">{message}</span>
      </div>
    </div>
  );
}
