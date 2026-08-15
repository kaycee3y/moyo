"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#faf9f7] text-[#151515]">

      {/* Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 md:px-10">
        <div className="text-xl font-extrabold tracking-[-0.06em]">
          MOYO
        </div>

        <div className="hidden items-center gap-8 text-sm font-semibold text-neutral-500 md:flex">
          <a href="#why" className="transition hover:text-black">Why MOYO</a>
          <a href="#principles" className="transition hover:text-black">Principles</a>
          <a href="#start" className="transition hover:text-black">Start</a>
        </div>

        <a
          href="/intro"
          className="rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition hover:scale-105"
        >
          Meet MOYO
        </a>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto flex min-h-[82vh] max-w-7xl flex-col items-center justify-center px-6 text-center md:px-10">

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute left-[5%] top-[18%] h-32 w-32 rounded-full bg-[#a8dce8]/70 blur-2xl md:h-48 md:w-48"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="absolute right-[4%] top-[30%] h-36 w-36 rounded-full bg-[#f4a7b9]/60 blur-2xl md:h-52 md:w-52"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <p className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-neutral-400">
            Your everyday companion
          </p>

          <h1 className="max-w-5xl text-[clamp(4rem,12vw,9.5rem)] font-extrabold leading-[0.82] tracking-[-0.085em]">
            Feel it.
            <br />
            Talk about it.
          </h1>

          <p className="mx-auto mt-9 max-w-xl text-base leading-7 text-neutral-500 md:text-lg">
            MOYO is a thoughtful AI companion for the good days,
            difficult days, random thoughts, goals, and everything in between.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/intro"
              className="flex items-center gap-2 rounded-full bg-black px-7 py-4 text-sm font-bold text-white transition hover:scale-105"
            >
              Meet MOYO
              <ArrowUpRight size={17} />
            </a>

            <a
              href="#why"
              className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-7 py-4 text-sm font-bold transition hover:border-neutral-400"
            >
              Explore
              <ArrowDown size={17} />
            </a>
          </div>
        </motion.div>
      </section>

      {/* Why */}
      <section id="why" className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40">
        <div className="grid gap-14 md:grid-cols-2 md:items-end">
          <h2 className="text-5xl font-extrabold leading-[0.95] tracking-[-0.065em] md:text-7xl">
            You don't always
            <br />
            need an answer.
          </h2>

          <p className="max-w-md text-lg leading-8 text-neutral-500">
            Sometimes you need somewhere to talk.
            Sometimes you need encouragement.
            Sometimes you just need to get something off your chest.
          </p>
        </div>
      </section>

      {/* Companion visual */}
      <section className="relative px-6 py-10 md:px-10">
        <div className="mx-auto flex min-h-[520px] max-w-6xl items-center justify-center overflow-hidden rounded-[3rem] bg-[#f3a6b8]">
          <motion.div
            animate={{
              y: [0, -12, 0],
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative flex h-64 w-64 items-center justify-center rounded-[5rem] bg-[#ff5960] shadow-2xl md:h-80 md:w-80"
          >
            <div className="relative h-24 w-36">
              <span className="absolute left-3 top-3 h-8 w-8 rounded-full bg-[#151515]" />
              <span className="absolute right-3 top-3 h-8 w-8 rounded-full bg-[#151515]" />

              <motion.div
                animate={{ scaleX: [1, 0.8, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute bottom-2 left-1/2 h-8 w-16 -translate-x-1/2 rounded-full border-b-8 border-[#151515]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Principles */}
      <section id="principles" className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40">
        <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-neutral-400">
          How MOYO works
        </p>

        <h2 className="max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-[-0.065em] md:text-7xl">
          Warm, but honest.
          <br />
          Helpful, but human-led.
        </h2>

        <div className="mt-20 grid gap-5 md:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-8">
            <div className="mb-16 text-4xl font-extrabold">01</div>
            <h3 className="text-xl font-extrabold">Authentic</h3>
            <p className="mt-3 leading-7 text-neutral-500">
              MOYO won't pretend to be human or claim feelings it doesn't have.
            </p>
          </div>

          <div className="rounded-[2rem] bg-[#e9e4ff] p-8">
            <div className="mb-16 text-4xl font-extrabold">02</div>
            <h3 className="text-xl font-extrabold">Transparent</h3>
            <p className="mt-3 leading-7 text-neutral-600">
              AI can make mistakes. MOYO makes that clear instead of pretending certainty.
            </p>
          </div>

          <div className="rounded-[2rem] bg-[#dff5f7] p-8">
            <div className="mb-16 text-4xl font-extrabold">03</div>
            <h3 className="text-xl font-extrabold">Your data</h3>
            <p className="mt-3 leading-7 text-neutral-600">
              Your conversations and memories stay under your control.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="start" className="px-6 pb-10 md:px-10">
        <div className="mx-auto flex min-h-[500px] max-w-7xl flex-col items-center justify-center rounded-[3rem] bg-black px-6 text-center text-white">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500">
            Whenever you're ready
          </p>

          <h2 className="mt-6 text-6xl font-extrabold tracking-[-0.07em] md:text-8xl">
            Meet MOYO.
          </h2>

          <a
            href="/intro"
            className="mt-10 rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition hover:scale-105"
          >
            Start a conversation
          </a>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl justify-between px-6 py-10 text-xs text-neutral-400 md:px-10">
        <span>© 2026 MOYO</span>
        <span>AI wellness companion</span>
      </footer>
    </main>
  );
}
