import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const backendRes = await fetch(
      `${process.env.API_INTERNAL_URL}/predict_csv`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Backend communication failed" },
      { status: 500 }
    );
  }
}
