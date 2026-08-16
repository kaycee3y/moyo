import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio");

    if (!audioFile || !(audioFile instanceof File)) {
      return NextResponse.json(
        { error: "No audio file provided." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is missing." },
        { status: 500 }
      );
    }

    // Create a new FormData to send to Groq
    const groqFormData = new FormData();
    groqFormData.append("file", audioFile);
    groqFormData.append("model", "whisper-large-v3-turbo");

    const response = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: groqFormData,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq Whisper error:", error);

      return NextResponse.json(
        { error: "Could not transcribe audio." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const transcript = data.text;

    if (!transcript) {
      return NextResponse.json(
        { error: "No transcript generated." },
        { status: 502 }
      );
    }

    return NextResponse.json({ transcript: transcript.trim() });
  } catch (error) {
    console.error("Speech-to-text error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
