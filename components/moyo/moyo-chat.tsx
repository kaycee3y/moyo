"use client";

import { useState } from "react";
import { ArrowLeft, ArrowUp, Plus, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import MoodFace from "./mood-face";

type Mood = "calm" | "happy" | "sad" | "thinking" | "confused";

const moods: Record<Mood, { label: string; color: string }> = {
  calm: { label: "Calm", color: "#f3a6b8" },
  happy: { label: "Happy", color: "#f8d878" },
  sad: { label: "Sad", color: "#aaaee6" },
  thinking: { label: "Thinking", color: "#c8b8ef" },
  confused: { label: "Confused", color: "#a8dce8" },
};

export default function MoyoChat() {
  const router = useRouter();

  const [mood, setMood] = useState<Mood>("calm");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      from: "moyo",
      text: "Hey. I'm here. What's on your mind?",
    },
  ]);

  function detectMood(text: string): Mood {
    const value = text.toLowerCase();

    if (
      /happy|excited|great|amazing|wonderful|joy|love|proud|good news/.test(
        value
      )
    ) {
      return "happy";
    }

    if (
      /sad|cry|crying|hurt|lonely|upset|depressed|heartbroken|terrible|awful/.test(
        value
      )
    ) {
      return "sad";
    }

    if (
      /confused|confusing|don't understand|what does|why does|unsure/.test(
        value
      )
    ) {
      return "confused";
    }

    if (
      /how do i|how can i|should i|what should|plan|goal|start|figure out/.test(
        value
      )
    ) {
      return "thinking";
    }

    return "calm";
  }

  async function sendMessage(text = message) {
    const trimmed = text.trim();

    if (!trimmed || loading) return;

    const updated = [
      ...messages,
      { from: "user" as const, text: trimmed },
    ];

    setMood(detectMood(trimmed));
    setMessages(updated);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updated.map((item) => ({
            role: item.from === "user" ? "user" : "assistant",
            content: item.text,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setMessages((previous) => [
        ...previous,
        {
          from: "moyo",
          text: data.reply,
        },
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          from: "moyo",
          text: "I couldn't respond just now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[100dvh] bg-[#faf9f7] text-[#151515]">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-3xl flex-col">

        {/* Header */}
        <header className="flex shrink-0 items-center justify-between px-4 py-4 sm:px-6">

          {/* History */}
          <button
            onClick={() => router.push("/history")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105 sm:h-11 sm:w-11"
            aria-label="Conversation history"
          >
            <span className="text-lg">☰</span>
          </button>

          <div className="text-lg font-extrabold tracking-[-0.06em]">
            MOYO
          </div>

          {/* New conversation */}
          <button
            onClick={() => router.push("/chat")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105 sm:h-11 sm:w-11"
            aria-label="New conversation"
          >
            <Plus size={19} />
          </button>
        </header>

        {/* Character */}
        <section className="flex shrink-0 flex-col items-center px-4 pt-2 sm:pt-5">
          <MoodFace mood={mood} />

          {/* Mood controls */}
          <div className="mt-2 flex max-w-full gap-2 overflow-x-auto px-2 pb-2">
            {(Object.keys(moods) as Mood[]).map((item) => (
              <button
                key={item}
                onClick={() => setMood(item)}
                className={`shrink-0 rounded-full px-3.5 py-2 text-[11px] font-bold transition sm:px-4 sm:text-xs ${
                  mood === item
                    ? "bg-black text-white"
                    : "bg-white text-neutral-500 shadow-sm"
                }`}
              >
                {moods[item].label}
              </button>
            ))}
          </div>
        </section>

        {/* Conversation */}
        <section className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="mx-auto max-w-2xl space-y-3">

            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  item.from === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[88%] px-4 py-3 text-sm leading-6 sm:max-w-[75%] sm:px-5 ${
                    item.from === "user"
                      ? "rounded-[1.4rem] rounded-br-md bg-black text-white"
                      : "rounded-[1.4rem] rounded-bl-md bg-white shadow-sm"
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-[1.4rem] rounded-bl-md bg-white px-5 py-3 text-sm text-neutral-400 shadow-sm">
                  <span className="animate-pulse">
                    MOYO is thinking...
                  </span>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* Suggestions */}
        <div className="shrink-0 overflow-x-auto px-4 pb-3 sm:px-6">
          <div className="mx-auto flex max-w-2xl gap-2">

            <button
              onClick={() => sendMessage("I just want to talk.")}
              className="shrink-0 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold"
            >
              Just want to talk
            </button>

            <button
              onClick={() => sendMessage("Help me set a goal.")}
              className="flex shrink-0 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold"
            >
              <Target size={14} />
              Set a goal
            </button>

            <button
              onClick={() => sendMessage("I need some encouragement.")}
              className="shrink-0 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold"
            >
              Encourage me
            </button>

          </div>
        </div>

        {/* Composer */}
        <div className="shrink-0 px-4 pb-3 sm:px-6">
          <div className="mx-auto flex max-w-2xl items-end gap-2 rounded-[1.4rem] bg-white p-2 shadow-sm ring-1 ring-black/[0.03]">

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Talk to MOYO..."
              rows={1}
              className="max-h-28 min-w-0 flex-1 resize-none bg-transparent px-3 py-3 text-sm outline-none placeholder:text-neutral-400"
            />

            <button
              onClick={() => sendMessage()}
              disabled={loading || !message.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white transition hover:scale-105 disabled:opacity-30 sm:h-11 sm:w-11"
              aria-label="Send message"
            >
              <ArrowUp size={18} />
            </button>

          </div>
        </div>

        {/* Disclaimer */}
        <p className="shrink-0 px-6 pb-4 text-center text-[9px] leading-4 text-neutral-400 sm:text-[10px]">
          MOYO is an AI and can make mistakes. It doesn't replace
          professional or human support.
        </p>

      </div>
    </main>
  );
}
