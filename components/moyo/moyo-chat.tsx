"use client";

import { FormEvent, useMemo, useState, useEffect, useRef } from "react";
import { Mic, Square, Volume2, Volume1 } from "lucide-react";
import MoodFace from "./mood-face";
import { MoyoGoal } from "@/lib/moyo-goals";

type Mood = "calm" | "happy" | "sad" | "concerned" | "thinking";

type VoiceState = "idle" | "listening" | "processing" | "speaking";

type Message = {
  role: "user" | "moyo";
  content: string;
};

interface MoyoChatProps {
  activeGoal?: MoyoGoal;
}

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

export default function MoyoChat({ activeGoal }: MoyoChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState<Mood>("calm");

  // Voice states
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Refs for voice features
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

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

  async function startRecording() {
    try {
      setVoiceState("listening");
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        stream.getTracks().forEach((track) => track.stop());

        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Microphone error:", error);
      setVoiceState("idle");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setVoiceState("processing");
    }
  }

  async function transcribeAudio(audioBlob: Blob) {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");

      const response = await fetch("/api/voice/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Could not transcribe audio");
      }

      const data = await response.json();
      const transcript = data.transcript;

      if (transcript) {
        setInput(transcript);
        setVoiceState("idle");
      }
    } catch (error) {
      console.error("Transcription error:", error);
      setVoiceState("idle");
    }
  }

  function speakResponse(text: string) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    setVoiceState("speaking");
    setIsPlayingAudio(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setVoiceState("idle");
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setVoiceState("idle");
      setIsPlayingAudio(false);
    };

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function stopAudio() {
    window.speechSynthesis.cancel();
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    setVoiceState("idle");
    setIsPlayingAudio(false);
  }

  async function handleSendMessage(event: FormEvent) {
    event.preventDefault();

    const text = input.trim();
    if (!text || loading) return;

    const nextMood = detectMood(text);
    setMood(nextMood);

    const userMessage = { role: "user" as const, content: text };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const payloadMessages = nextMessages.map((message) => ({
        role: message.role === "moyo" ? "assistant" : message.role,
        content: message.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: payloadMessages,
          goal: activeGoal
            ? {
                title: activeGoal.title,
                description: activeGoal.description,
                currentDay: activeGoal.currentDay,
                totalDays: activeGoal.totalDays,
                completedDays: activeGoal.completedDays.length,
                currentStep: activeGoal.firstStep,
                lastCheckInReason: activeGoal.lastCheckInReason,
              }
            : undefined,
        }),
      });

      let data: { reply?: string; error?: string } = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.error ?? "MOYO couldn't respond right now.");
      }

      const reply =
        typeof data.reply === "string" && data.reply.trim()
          ? data.reply.trim()
          : (() => {
              throw new Error(data.error ?? "No reply received.");
            })();

      setMessages((current) => [
        ...current,
        { role: "moyo", content: reply },
      ]);

      setMood(detectMood(reply));

      // Speak the reply if we're in voice mode
      if (voiceState !== "idle" && voiceState !== "speaking") {
        // Only auto-speak if the user sent a voice message
        // speakResponse(reply);
      }
    } catch (error) {
      const fallbackMessage =
        error instanceof Error && error.message
          ? error.message
          : "I'm having a little trouble connecting right now. I'm still here.";

      setMessages((current) => [
        ...current,
        {
          role: "moyo",
          content: fallbackMessage,
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
          onSubmit={handleSendMessage}
          className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-[28px] bg-white p-2 shadow-sm ring-1 ring-neutral-200"
        >
          {/* Voice control button */}
          <button
            type="button"
            onClick={
              voiceState === "listening" ? stopRecording : startRecording
            }
            disabled={loading || isPlayingAudio}
            className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
              voiceState === "listening"
                ? "bg-red-500 text-white"
                : voiceState === "processing"
                  ? "bg-yellow-500 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 disabled:opacity-50"
            }`}
            aria-label={
              voiceState === "listening" ? "Stop recording" : "Start recording"
            }
          >
            {voiceState === "listening" ? (
              <Square size={16} className="fill-current" />
            ) : (
              <Mic size={16} />
            )}
          </button>

          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Talk to Moyo..."
            disabled={loading || voiceState === "listening"}
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-[15px] outline-none placeholder:text-neutral-400"
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="shrink-0 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
          >
            Send
          </button>

          {/* Audio playback button */}
          {isPlayingAudio && (
            <button
              type="button"
              onClick={stopAudio}
              className="shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-red-500 text-white transition-colors hover:bg-red-600"
              aria-label="Stop audio"
            >
              <Square size={16} className="fill-current" />
            </button>
          )}
        </form>

        {/* Voice status indicator */}
        {voiceState === "processing" && (
          <div className="mt-2 text-center text-xs text-neutral-500">
            Transcribing audio...
          </div>
        )}
      </footer>


    </main>
  );
}
