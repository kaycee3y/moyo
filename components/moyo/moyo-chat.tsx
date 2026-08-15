"use client";

import MoodFace from "./mood-face";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUp, History, Plus, Target } from "lucide-react";

type Mood = "happy" | "calm" | "sad" | "thinking" | "confused";

const moods: Record<Mood, { label: string; color: string }> = {
  happy: { label: "Happy", color: "#f8d878" },
  calm: { label: "Calm", color: "#a8dce8" },
  sad: { label: "Sad", color: "#a99bea" },
  thinking: { label: "Thinking", color: "#ffc9aa" },
  confused: { label: "Confused", color: "#f3a6b8" },
};

export default function MoyoChat() {
  const router = useRouter();
  const [mood, setMood] = useState<Mood>("happy");
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
      { from: "user", text: trimmed },
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
    <main className="min-h-screen bg-[#faf9f7] text-[#151515]">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col">

        <header className="flex items-center justify-between px-5 py-5">
          <button
            onClick={() => router.push("/")}
            aria-label="Back to home"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft size={19} />
          </button>

          <div className="text-lg font-extrabold tracking-[-0.06em]">
            MOYO
          </div>

          <button
            aria-label="New conversation"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <Plus size={20} />
          </button>
        </header>

        <MoodFace mood={mood} />

        <section className="flex flex-col items-center px-6 pb-8 pt-5">
          <div
            className="flex h-48 w-48 items-center justify-center rounded-[4rem] shadow-lg transition-all duration-500 sm:h-56 sm:w-56"
            style={{ backgroundColor: moods[mood].color }}
          >
            <div className="text-center">
              <div className="text-3xl font-black tracking-[0.45em]">
                ● ●
              </div>
              <div className="mt-3 text-5xl font-black">⌣</div>
            </div>
          </div>

          <h1 className="mt-5 text-2xl font-extrabold tracking-[-0.04em]">
            How are you feeling?
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            I'm listening.
          </p>

          <div className="mt-5 flex max-w-full gap-2 overflow-x-auto pb-1">
            {(Object.keys(moods) as Mood[]).map((item) => (
              <button
                key={item}
                onClick={() => setMood(item)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${
                  mood === item
                    ? "bg-black text-white"
                    : "bg-white text-neutral-500"
                }`}
              >
                {moods[item].label}
              </button>
            ))}
          </div>
        </section>

        <section className="flex-1 px-5 pb-5">
          <div className="space-y-3">
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
                  className={`max-w-[82%] rounded-3xl px-5 py-3.5 text-sm leading-6 ${
                    item.from === "user"
                      ? "rounded-br-md bg-black text-white"
                      : "rounded-bl-md bg-white shadow-sm"
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="w-fit rounded-3xl rounded-bl-md bg-white px-5 py-3.5 text-sm text-neutral-400 shadow-sm">
                MOYO is thinking...
              </div>
            )}
          </div>
        </section>

        <div className="flex gap-2 overflow-x-auto px-5 pb-3">
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

        <div className="px-5 pb-4">
          <div className="flex items-end gap-2 rounded-[1.5rem] bg-white p-2 shadow-sm">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Talk to MOYO..."
              rows={1}
              className="flex-1 resize-none bg-transparent px-3 py-3 text-sm outline-none"
            />

            <button
              onClick={() => sendMessage()}
              disabled={loading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white disabled:opacity-40"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>

        <p className="px-6 pb-6 text-center text-[10px] leading-4 text-neutral-400">
          MOYO is an AI and can make mistakes. For important decisions,
          consider checking reliable sources or talking to a qualified person.
        </p>
      </div>
    </main>
  );
}
