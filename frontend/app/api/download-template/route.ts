import { NextResponse } from "next/server";

export async function GET() {
  // Define CSV headers / columns
  const headers = [
    "timestamp",
    "voltage_v",
    "current_ma",
    "temperature_c",
  ];

  // Create CSV content
  const csvContent = headers.join(",") + "\n";

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=battery_log_template.csv",
    },
  });
}
