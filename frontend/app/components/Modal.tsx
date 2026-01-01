'use client';

import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export default function Modal({ isOpen, onClose, onConfirm, title, description }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[1000] animate-[fadeIn_0.3s_ease-out] backdrop-blur-sm" onClick={onClose}>
      <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-3xl p-10 max-w-md w-[90%] shadow-[0_25px_50px_rgba(0,0,0,0.5)] animate-[scaleIn_0.4s_ease-out] border border-purple-500/30" onClick={(e) => e.stopPropagation()}>
        <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="7" y="4" width="10" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M9 7H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white text-center mb-4">{title}</h2>
        <p className="text-slate-300 text-base text-center leading-relaxed mb-8">{description}</p>
        <div className="flex gap-4 justify-center flex-col md:flex-row">
          <button className="px-8 py-3 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 border-none min-w-[120px] bg-slate-600/30 text-slate-300 border border-slate-600/50 hover:bg-slate-600/50 hover:text-white" onClick={onClose}>
            Cancel
          </button>
          <button className="px-8 py-3 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 border-none min-w-[120px] bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-[0_4px_15px_rgba(168,85,247,0.4)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(168,85,247,0.6)] active:translate-y-0" onClick={onConfirm}>
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}
