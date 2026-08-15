"use client";

import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function IntroPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/chat");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#faf9f7] px-6">

      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
      >
        <ArrowLeft size={18} />
      </button>

      <div className="relative z-10 flex flex-col items-center text-center">

        <div className="flex h-16 w-16 items-center justify-center rounded-[1.2rem] bg-[#f3a6b8] shadow-lg">
          <div className="text-sm font-black tracking-[0.35em]">
            • •
          </div>
          <div className="absolute mt-7 text-xl font-black">
            ⌣
          </div>
        </div>

        <h1 className="mt-7 text-6xl font-extrabold tracking-[-0.08em]">
          MOYO
        </h1>

        <p className="mt-3 text-sm text-neutral-400">
          Take a breath.
          <br />
          I'm here when you're ready.
        </p>

        <div className="mt-7 flex gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-300" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-300 [animation-delay:200ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-300 [animation-delay:400ms]" />
        </div>

        <button
          onClick={() => router.replace("/chat")}
          className="mt-8 rounded-full bg-black px-7 py-3.5 text-sm font-bold text-white"
        >
          Enter MOYO
        </button>

      </div>

      <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#f4a7b9]/30 blur-3xl" />
      <div className="absolute -right-20 bottom-20 h-64 w-64 rounded-full bg-[#a99bea]/30 blur-3xl" />

    </main>
  );
}
