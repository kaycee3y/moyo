"use client";

import { FormEvent, useMemo, useState } from "react";
import MoodFace from "./mood-face";

type Mood = "calm" | "happy" | "sad" | "concerned" | "thinking";

type Message = {
  role: "user" | "moyo";
  content: string;
};

function detectMood(text: string): Mood {
  const value = text.toLowerCase();

  if (
    /happy|great|excited|amazing|good news|love|wonderful|proud|glad/.test(
      value
    )
  ) {
    return "happy";
  }

  if (
    /sad|lonely|hurt|cry|crying|depressed|heartbroken|upset|miserable/.test(
      value
    )
  ) {
    return "sad";
  }

  if (
    /stress|stressed|angry|anxious|anxiety|worried|overwhelmed|frustrated|tired/.test(
      value
    )
  ) {
    return "concerned";
  }

  if (/think|thinking|confused|wonder|maybe|don't know|not sure/.test(value)) {
    return "thinking";
  }

  return "calm";
}

export default function MoyoChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState<Mood>("calm");

  const hasMessages = messages.length > 0;
  const faceMood: "calm" | "happy" | "sad" | "thinking" | "confused" =
    mood === "concerned" ? "thinking" : mood;

  const moodLabel = useMemo(() => {
    if (mood === "happy") return "Moyo feels happy";
    if (mood === "sad") return "Moyo is here with you";
    if (mood === "concerned") return "Moyo is listening";
    if (mood === "thinking") return "Moyo is thinking";
    return "Moyo is here";
  }, [mood]);

  async function sendMessage(event: FormEvent) {
    event.preventDefault();

    const text = input.trim();
    if (!text || loading) return;

    const nextMood = detectMood(text);
    setMood(nextMood);

    setMessages((current) => [
      ...current,
      { role: "user", content: text },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: "user", content: text },
          ],
        }),
      });

      const data = await response.json();
      console.log("MOYO API:", data);

      if (!response.ok) {
        throw new Error(data.error || "Chat request failed");
      }

      if (typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error("API returned no reply");
      }

      const reply = data.reply.trim();

      setMessages((current) => [
        ...current,
        { role: "moyo", content: reply },
      ]);

      setMood(detectMood(reply));
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "moyo",
          content:
            "I'm having a little trouble connecting right now. I'm still here.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="fixed inset-0 flex min-h-dvh flex-col overflow-hidden bg-[#faf9f7] text-neutral-900">
      {/* FIXED MOYO AREA */}
      <header className="shrink-0 px-5 pt-8 pb-4 sm:px-8">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
          <div>
            <p className="text-sm font-medium tracking-[0.18em] text-neutral-400">
              MOYO
            </p>
            <p className="mt-1 text-xs text-neutral-400">{moodLabel}</p>
          </div>

          <MoodFace mood={faceMood} />
        </div>
      </header>

      {/* ONLY THIS AREA SCROLLS */}
      <section className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 sm:px-8">
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-end gap-4 py-6">
          {!hasMessages && (
            <div className="my-auto flex flex-col items-center justify-center text-center">
              <p className="text-2xl font-medium tracking-tight sm:text-3xl">
                What&apos;s on your mind?
              </p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-400">
                You don&apos;t have to explain everything at once.
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-[24px] px-5 py-3.5 text-[15px] leading-6 sm:max-w-[70%] ${
                  message.role === "user"
                    ? "rounded-br-md bg-neutral-900 text-white"
                    : "rounded-bl-md bg-white text-neutral-800 shadow-sm ring-1 ring-neutral-100"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-[24px] rounded-bl-md bg-white px-5 py-4 shadow-sm ring-1 ring-neutral-100">
                <div className="flex gap-1.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-300" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-300 [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-300 [animation-delay:240ms]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FIXED INPUT */}
      <footer className="shrink-0 px-5 pb-5 pt-3 sm:px-8 sm:pb-8">
        <form
          onSubmit={sendMessage}
          className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-[28px] bg-white p-2 shadow-sm ring-1 ring-neutral-200"
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Talk to Moyo..."
            disabled={loading}
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-[15px] outline-none placeholder:text-neutral-400"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="shrink-0 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
          >
            Send
          </button>
        </form>
      </footer>


    </main>
  );
}
