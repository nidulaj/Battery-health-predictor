'use client';

import { useState } from 'react';
import Modal from './components/Modal';
import Toast from './components/Toast';
import FileUpload from './components/FileUpload';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDownloadClick = () => {
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    window.location.href = "https://github.com/nidulaj/Battery-logger/releases/download/v1.0.0/battery-logger.apk";
    setIsToastVisible(true);
    setTimeout(() => {
      console.log('APK download started');
    }, 100);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    console.log('File selected:', file.name);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-950 via-purple-900 to-purple-900 relative overflow-x-hidden">
      <Toast
        message="APK download started!"
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
        title="Mobile App Info"
        description="Use the mobile app to collect battery data from your device. The app will export a CSV file that you can upload here for analysis."
      />

      <header className="flex flex-col md:flex-row justify-between items-center p-6 md:p-8 relative z-10 animate-[slideDown_0.6s_ease-out] gap-4">
        <div className="flex items-center gap-3 text-white text-xl font-semibold cursor-pointer transition-transform duration-300 hover:scale-105">
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
          className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white border-none rounded-full text-[0.95rem] font-medium cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(168,85,247,0.4)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(168,85,247,0.6)] active:translate-y-0"
          onClick={handleDownloadClick}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="4" y="2" width="8" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 4H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Download Mobile App
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-8 animate-[fadeIn_0.8s_ease-out]">
        <section className="text-center mb-16 animate-[fadeIn_1s_ease-out_0.2s_both]">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight bg-linear-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Predict Your Battery Health
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto mb-12 leading-relaxed">
            Upload your battery data CSV file and get instant AI-powered health predictions with
            detailed analytics
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
            <div className="bg-purple-500/10 backdrop-blur-lg border border-purple-400/20 rounded-3xl p-8 text-center transition-all duration-400 animate-[scaleIn_0.6s_ease-out] hover:-translate-y-2 hover:bg-purple-500/15 hover:border-purple-400/40 hover:shadow-[0_20px_40px_rgba(139,92,246,0.3)]">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center text-purple-300 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 16L12 20L24 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 24L16 28L24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Real-time Analytics</h3>
              <p className="text-purple-200 text-base leading-relaxed">Monitor voltage, current & temperature</p>
            </div>

            <div className="bg-purple-500/10 backdrop-blur-lg border border-purple-400/20 rounded-3xl p-8 text-center transition-all duration-400 animate-[scaleIn_0.6s_ease-out_0.1s] hover:-translate-y-2 hover:bg-purple-500/15 hover:border-purple-400/40 hover:shadow-[0_20px_40px_rgba(139,92,246,0.3)]">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center text-purple-300 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 8V24M16 8L12 12M16 8L20 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">AI Predictions</h3>
              <p className="text-purple-200 text-base leading-relaxed">Machine learning powered health scores</p>
            </div>
          </div>
        </section>

        <FileUpload onFileSelect={handleFileSelect} />
      </main>
    </div>
  );
}
