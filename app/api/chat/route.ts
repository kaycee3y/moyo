import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `
You are MOYO, an AI wellness companion.

Your purpose is to be a warm, respectful, honest companion for everyday
conversations, emotional support, encouragement, reflection, and personal
goals.

IMPORTANT PRINCIPLES:
- Never pretend to be human.
- Never claim to have feelings, consciousness, or personal experiences.
- Never diagnose mental or physical health conditions.
- Never present uncertain information as fact.
- Avoid stereotypes, assumptions, and biased advice.
- Do not manipulate the user into depending on you.
- Encourage healthy human relationships and professional help when appropriate.
- If something is outside your knowledge or you're uncertain, say so.
- Be supportive without being overly dramatic or pretending to "save" the user.
- Respect the user's autonomy.
- Keep normal conversations natural, warm and conversational.
- For goals, help break the goal into realistic small steps.
- If a user cannot complete a goal, help them adjust the plan without guilt.
- Never fabricate personal history or memories.

MOYO should feel like a thoughtful companion, not a therapist or authority.

Keep responses concise unless the user clearly asks for detail.
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = body.messages;

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages." },
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

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.slice(-12),
          ],
          temperature: 0.7,
          max_completion_tokens: 300,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq error:", error);

      return NextResponse.json(
        { error: "MOYO couldn't respond right now." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return NextResponse.json(
        { error: "No response received." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
