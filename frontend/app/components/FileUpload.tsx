"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBattery } from "@/app/context/BatteryContext";

export default function FileUpload() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setFile } = useBattery();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].name.endsWith(".csv")) {
      setSelectedFile(files[0]);
      setFile(files[0]);
      setTimeout(() => setIsUploaded(true), 300);
    }
  };

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  const file = files[0];

  if (!file.name.toLowerCase().endsWith(".csv")) {
    alert("Please upload a CSV file only");
    e.target.value = "";
    return;
  }

  setSelectedFile(file);
  setFile(file);
  setTimeout(() => setIsUploaded(true), 300);
};


  const handleClick = () => {
    if (!isUploaded) {
      fileInputRef.current?.click();
    }
  };

  const handleContinue = () => {
    console.log("Continue to analysis with file:", selectedFile?.name);
    setIsNavigating(true);
    router.push("/analysis");
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setIsUploaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChangeFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const downloadCSV = async () => {
    const response = await fetch("/api/download-template");
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "battery_log_template.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto animate-[scaleIn_0.8s_ease-out_0.4s_both]">
      {/* Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-purple-900">
          <div className="flex flex-col items-center gap-6">
            {/* Animated Battery Loading Icon */}
            <div className="relative">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="animate-pulse"
              >
                <rect
                  x="20"
                  y="15"
                  width="40"
                  height="50"
                  rx="4"
                  stroke="#8b5cf6"
                  strokeWidth="3"
                />
                <rect x="35" y="8" width="10" height="4" rx="2" fill="#a78bfa" />
                <rect x="25" y="25" width="30" height="8" rx="2" fill="#8b5cf6" className="animate-pulse">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
                </rect>
                <rect x="25" y="38" width="30" height="8" rx="2" fill="#a78bfa" className="animate-pulse">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
                </rect>
                <rect x="25" y="51" width="30" height="8" rx="2" fill="#c4b5fd" className="animate-pulse">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.6s" repeatCount="indefinite" />
                </rect>
              </svg>
            </div>
            
            {/* Loading Text */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Preparing Analysis</h3>
              <p className="text-purple-200">Loading your battery data...</p>
            </div>
            
            {/* Loading Spinner */}
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input - Always present */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="bg-indigo-950/60 backdrop-blur-lg border-2 border-dashed border-purple-400/30 rounded-3xl p-12 text-center relative overflow-hidden transition-all duration-400">
        {!isUploaded ? (
          <div
            className="cursor-pointer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <div
              className={`text-purple-300 mb-6 flex justify-center transition-transform duration-300 ${
                isDragging ? "animate-[customPulse_1s_infinite] scale-110" : ""
              }`}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 32V16M24 16L18 22M24 16L30 22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 32V36C12 37.1046 12.8954 38 14 38H34C35.1046 38 36 37.1046 36 36V32"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="mb-4">
              <p className="text-xl font-semibold text-white mb-2">
                Drop your CSV file here
              </p>
              <p className="text-purple-200 text-base">or click to browse</p>
            </div>
          </div>
        ) : (
          <div className="animate-[scaleIn_0.5s_ease-out]">
            {/* Remove Button */}
            <button
              onClick={handleRemoveFile}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-slate-700/50 hover:bg-slate-600/70 text-slate-300 hover:text-white transition-all duration-300 hover:scale-110 z-10"
              title="Remove file"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 5L5 15M5 5L15 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Success Icon */}
            <div className="w-24 h-24 mx-auto mb-8 relative animate-[scaleIn_0.6s_ease-out]">
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
              <div className="relative w-24 h-24 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(16,185,129,0.4)]">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white animate-[scaleIn_0.8s_ease-out_0.2s_both]"
                >
                  <path
                    d="M10 24L18 32L38 12"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* File Info */}
            <div className="mb-8 animate-[fadeIn_0.8s_ease-out_0.3s_both]">
              <div className="flex items-center justify-center gap-3 mb-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-purple-300"
                >
                  <path
                    d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2V8H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-xl font-semibold text-white">
                  {selectedFile?.name}
                </p>
              </div>
              <p className="text-purple-200 text-lg">
                {selectedFile && formatFileSize(selectedFile.size)}
              </p>
            </div>

            {/* Change File Button */}
            <button
              onClick={handleChangeFile}
              className="inline-flex items-center gap-2 px-6 py-2 text-purple-300 hover:text-white text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.5 8.5L15 10L13.5 11.5M2.5 7.5L1 6L2.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 10H9C7.34315 10 6 8.65685 6 7V6M1 6H7C8.65685 6 10 7.34315 10 9V10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Upload Different File
            </button>
          </div>
        )}
      </div>

      {/* Continue Button - Below Container */}
      {isUploaded && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleContinue}
            className="inline-flex items-center gap-3 px-12 py-4 bg-linear-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white rounded-2xl text-lg font-semibold cursor-pointer transition-all duration-300 shadow-[0_8px_25px_rgba(168,85,247,0.5)] hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(168,85,247,0.7)] active:translate-y-0 animate-[scaleIn_0.8s_ease-out_0.5s_both]"
          >
            Continue to Analysis
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 10H16M16 10L10 4M16 10L10 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Download Template Button - Always visible */}
      <button
        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-300/15 text-purple-200 border border-purple-400/30 rounded-full text-[0.95rem] font-medium cursor-pointer mt-6 transition-all duration-300 hover:bg-purple-300/25 hover:text-white hover:border-purple-400/50 hover:-translate-y-0.5"
        onClick={downloadCSV}
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
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        Download CSV Template
      </button>
      <p className="text-slate-400 text-sm mt-4 text-center">
        CSV format: timestamp, voltage, current, temperature
      </p>
    </div>
  );
}
