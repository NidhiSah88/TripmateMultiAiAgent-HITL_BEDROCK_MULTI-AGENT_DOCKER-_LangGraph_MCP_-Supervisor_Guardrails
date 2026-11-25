
import { NextRequest, NextResponse } from "next/server";

// export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.BACKEND_API_URL || "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.message || !body.message.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Message cannot be empty.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/travel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: body.message,
        thread_id: body.thread_id || null,
      }),
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });

  } catch (error) {
    console.error("Travel API proxy error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to connect to TripMate AI backend.",
      },
      { status: 502 }
    );
  }
}










