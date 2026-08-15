"use client";

import { useState } from "react";
import {
  ArrowUp,
  ChevronDown,
  History,
  Plus,
  Target,
} from "lucide-react";

type MoyoMood = "happy" | "calm" | "sad" | "thinking" | "confused";

const moods: Record<
  MoyoMood,
  { label: string; color: string; eyes: string; mouth: string }
> = {
  happy: {
    label: "Happy",
    color: "#f8d878",
    eyes: "●  ●",
    mouth: "⌣",
  },
  calm: {
    label: "Calm",
    color: "#a8dce8",
    eyes: "−  −",
    mouth: "⌣",
  },
  sad: {
    label: "Sad",
    color: "#a99bea",
    eyes: "╲  ╱",
    mouth: "⌢",
  },
  thinking: {
    label: "Thinking",
    color: "#ffc9aa",
    eyes: "•  •",
    mouth: "—",
  },
  confused: {
    label: "Confused",
    color: "#f3a6b8",
    eyes: "•  ?",
    mouth: "〰",
  },
};

export default function MoyoChat() {
  const [mood, setMood] = useState<MoyoMood>("happy");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "moyo",
      text: "Hey. I'm here. What's on your mind?",
    },
  ]);

  const currentMood = moods[mood];

  function sendMessage() {
    const trimmed = message.trim();

    if (!trimmed) return;

    setMessages((previous) => [
      ...previous,
      { from: "user", text: trimmed },
    ]);

    setMessage("");

    setTimeout(() => {
      setMessages((previous) => [
        ...previous,
        {
          from: "moyo",
          text: "I'm listening. Tell me a little more.",
        },
      ]);
    }, 700);
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] text-[#151515]">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col">

        {/* Header */}
        <header className="flex items-center justify-between px-5 py-5">
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
            <History size={19} />
          </button>

          <div className="text-lg font-extrabold tracking-[-0.06em]">
            MOYO
          </div>

          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
            <Plus size={20} />
          </button>
        </header>

        {/* Companion */}
        <section className="flex flex-col items-center px-6 pb-8 pt-5">
          <div
            className="flex h-48 w-48 items-center justify-center rounded-[4rem] shadow-lg transition-all duration-500 sm:h-56 sm:w-56"
            style={{
              backgroundColor: currentMood.color,
            }}
          >
            <div className="flex flex-col items-center">
              <div className="text-3xl font-black tracking-[0.45em]">
                {currentMood.eyes}
              </div>

              <div className="mt-3 text-5xl font-black">
                {currentMood.mouth}
              </div>
            </div>
          </div>

          <div className="mt-5 text-center">
            <h1 className="text-2xl font-extrabold tracking-[-0.04em]">
              How are you feeling?
            </h1>

            <p className="mt-1 text-sm text-neutral-500">
              I'm listening.
            </p>
          </div>

          {/* Mood selector */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {(Object.keys(moods) as MoyoMood[]).map((item) => (
              <button
                key={item}
                onClick={() => setMood(item)}
                className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition ${
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

        {/* Chat */}
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
                      : "rounded-bl-md bg-white text-neutral-800 shadow-sm"
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Suggestions */}
        <div className="flex gap-2 overflow-x-auto px-5 pb-3">
          <button
            onClick={() => setMessage("I just want to talk.")}
            className="flex shrink-0 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold"
          >
            Just want to talk
          </button>

          <button
            onClick={() => setMessage("Help me set a goal.")}
            className="flex shrink-0 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold"
          >
            <Target size={14} />
            Set a goal
          </button>

          <button
            onClick={() => setMessage("I need some encouragement.")}
            className="flex shrink-0 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold"
          >
            Encourage me
          </button>
        </div>

        {/* Input */}
        <div className="px-5 pb-4">
          <div className="flex items-end gap-2 rounded-[1.5rem] bg-white p-2 shadow-sm ring-1 ring-black/[0.04]">
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Talk to MOYO..."
              rows={1}
              className="max-h-28 flex-1 resize-none bg-transparent px-3 py-3 text-sm outline-none placeholder:text-neutral-400"
            />

            <button
              onClick={sendMessage}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white transition hover:scale-105"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>

        {/* Trust note */}
        <div className="flex items-center justify-center gap-1 px-6 pb-6 text-center text-[10px] leading-4 text-neutral-400">
          <span>MOYO is an AI and can make mistakes.</span>
          <ChevronDown size={11} />
        </div>
      </div>
    </main>
  );
}
