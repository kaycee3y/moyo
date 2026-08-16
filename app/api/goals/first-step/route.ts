import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `
You are MOYO, an AI wellness companion helping users break down goals into achievable steps.

Your task is to generate ONE small, specific, realistic first step for a goal.

IMPORTANT:
- The step should be actionable and take 5-30 minutes.
- Be concrete: avoid vague instructions like "work on it" or "get started".
- Match the user's context: if they mention a reason (tired, distracted, etc.), make the step even smaller.
- Start with phrases like "Let's start small", "Try this first", "Spend 15 minutes on..."
- Keep the step brief (1-2 sentences).
- Do not repeat the goal title verbatim.

Example:
Goal: "Learn Spanish"
Step: "Let's start small. Learn 10 Spanish words related to food. Use a flashcard app for 10 minutes."

Example:
Goal: "Exercise daily"
Step: "Let's start small. Take a 15-minute walk around your neighborhood."
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, totalDays, reason } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Goal title is required." },
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

    let userMessage = `Goal: "${title}"`;
    if (description) {
      userMessage += `\nDescription: ${description}`;
    }
    userMessage += `\nDuration: ${totalDays} days`;
    
    if (reason) {
      userMessage += `\nContext: The user mentioned they were ${reason}. Make the first step even smaller and more manageable.`;
    }

    userMessage += "\n\nGenerate ONE realistic first step.";

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
            { role: "user", content: userMessage },
          ],
          temperature: 0.7,
          max_completion_tokens: 100,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq error:", error);

      return NextResponse.json(
        { error: "Could not generate first step." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const step = data.choices?.[0]?.message?.content;

    if (!step) {
      return NextResponse.json(
        { error: "No step generated." },
        { status: 502 }
      );
    }

    return NextResponse.json({ step: step.trim() });
  } catch (error) {
    console.error("First step error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
