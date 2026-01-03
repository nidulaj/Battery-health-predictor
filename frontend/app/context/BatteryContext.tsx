"use client";

import { createContext, useContext, useState } from "react";

interface BatteryContextType {
  file: File | null;
  setFile: (file: File | null) => void;
}

const BatteryContext = createContext<BatteryContextType | null>(null);

export const BatteryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <BatteryContext.Provider value={{ file, setFile }}>
      {children}
    </BatteryContext.Provider>
  );
};

export const useBattery = () => {
  const context = useContext(BatteryContext);
  if (!context) {
    throw new Error("useBattery must be used inside BatteryProvider");
  }
  return context;
};
