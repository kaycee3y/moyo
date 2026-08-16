import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "No text provided." },
        { status: 400 }
      );
    }

    // Limit text length for audio generation
    if (text.length > 500) {
      return NextResponse.json(
        { error: "Text too long (max 500 characters)." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is missing." },
        { status: 500 }
      );
    }

    // Note: Groq doesn't have native TTS. Using browser-based TTS is recommended.
    // This endpoint is a placeholder for future TTS integration.
    // For now, return a signal to use browser Web Speech API.

    return NextResponse.json({
      status: "ready",
      message:
        "Use browser Web Speech API for text-to-speech. This is more efficient than server-side generation.",
    });
  } catch (error) {
    console.error("Text-to-speech error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
