"use client";

import { motion } from "framer-motion";

export default function MoyoIntro() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#faf9f7] px-6">
      <motion.div
        className="absolute left-[-10%] top-[15%] h-72 w-72 rounded-full bg-[#f3a6b8]/50 blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-[5%] right-[-10%] h-80 w-80 rounded-full bg-[#a99bea]/40 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -20, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#f3a6b8] shadow-xl shadow-[#f3a6b8]/20">
            <div className="relative h-10 w-14">
              <span className="absolute left-1 top-1 h-3 w-3 rounded-full bg-neutral-900" />
              <span className="absolute right-1 top-1 h-3 w-3 rounded-full bg-neutral-900" />

              <span className="absolute bottom-1 left-1/2 h-3 w-7 -translate-x-1/2 rounded-full border-b-[3px] border-neutral-900" />
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-7xl font-bold tracking-[-0.07em] text-neutral-950 sm:text-8xl"
        >
          MOYO
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-4 max-w-xs text-base leading-7 text-neutral-500"
        >
          Take a breath.
          <br />
          I&apos;m here when you&apos;re ready.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-10 flex items-center gap-2"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-200" />
        </motion.div>
      </div>
    </main>
  );
}
