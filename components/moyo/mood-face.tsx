"use client";

import { motion } from "framer-motion";

type Mood = "calm" | "happy" | "sad" | "thinking" | "confused";

export default function MoodFace({ mood = "calm" }: { mood?: Mood }) {
  const config = {
    calm: {
      bg: "#F4A7B9",
      tilt: 0,
      eyeScale: 1,
      mouth: "calm",
    },
    happy: {
      bg: "#F7D978",
      tilt: -2,
      eyeScale: 0.82,
      mouth: "happy",
    },
    sad: {
      bg: "#A9ACE5",
      tilt: 3,
      eyeScale: 0.9,
      mouth: "sad",
    },
    thinking: {
      bg: "#C7B8ED",
      tilt: -3,
      eyeScale: 0.9,
      mouth: "thinking",
    },
    confused: {
      bg: "#A8DCE7",
      tilt: 5,
      eyeScale: 0.85,
      mouth: "confused",
    },
  }[mood];

  return (
    <div className="flex flex-col items-center select-none">
      <motion.div
        animate={{
          rotate: config.tilt,
          scale: [1, 1.025, 1],
        }}
        transition={{
          rotate: { type: "spring", stiffness: 180, damping: 14 },
          scale: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="relative h-56 w-56 sm:h-64 sm:w-64"
      >
        {/* Organic body */}
        <motion.div
          animate={{
            borderRadius:
              mood === "happy"
                ? "43% 57% 52% 48% / 48% 43% 57% 52%"
                : "48% 52% 45% 55% / 52% 45% 55% 48%",
          }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 shadow-[0_25px_60px_rgba(0,0,0,0.12)]"
          style={{ backgroundColor: config.bg }}
        />

        {/* Highlight */}
        <div className="absolute left-10 top-8 h-12 w-20 rounded-full bg-white/25 blur-xl" />

        {/* Left eye */}
        <motion.div
          animate={{
            scaleY: config.eyeScale,
            y: mood === "sad" ? 5 : mood === "happy" ? -2 : 0,
          }}
          className="absolute left-[25%] top-[34%] h-12 w-9 rounded-full bg-[#171717]"
        >
          <div className="absolute left-2 top-2 h-3 w-3 rounded-full bg-white/90" />
        </motion.div>

        {/* Right eye */}
        <motion.div
          animate={{
            scaleY: config.eyeScale,
            y: mood === "sad" ? 5 : mood === "happy" ? -2 : 0,
          }}
          className="absolute right-[25%] top-[34%] h-12 w-9 rounded-full bg-[#171717]"
        >
          <div className="absolute left-2 top-2 h-3 w-3 rounded-full bg-white/90" />
        </motion.div>

        {/* Brows */}
        {mood === "confused" && (
          <>
            <motion.div
              animate={{ rotate: -12 }}
              className="absolute left-[24%] top-[27%] h-2 w-9 rounded-full bg-[#171717]"
            />
            <motion.div
              animate={{ rotate: 18 }}
              className="absolute right-[23%] top-[30%] h-2 w-9 rounded-full bg-[#171717]"
            />
          </>
        )}

        {mood === "sad" && (
          <>
            <div className="absolute left-[24%] top-[29%] h-2 w-9 rotate-[20deg] rounded-full bg-[#171717]" />
            <div className="absolute right-[24%] top-[29%] h-2 w-9 -rotate-[20deg] rounded-full bg-[#171717]" />
          </>
        )}

        {/* Happy cheeks */}
        {mood === "happy" && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              className="absolute left-[13%] top-[53%] h-6 w-12 rounded-full bg-[#F27E91] blur-sm"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              className="absolute right-[13%] top-[53%] h-6 w-12 rounded-full bg-[#F27E91] blur-sm"
            />
          </>
        )}

        {/* Mouth */}
        {config.mouth === "happy" && (
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-[22%] left-1/2 h-12 w-24 -translate-x-1/2 rounded-b-[50%] bg-[#171717]"
          />
        )}

        {config.mouth === "calm" && (
          <div className="absolute bottom-[25%] left-1/2 h-7 w-16 -translate-x-1/2 rounded-b-full border-b-[6px] border-[#171717]" />
        )}

        {config.mouth === "sad" && (
          <motion.div
            animate={{ y: [0, 2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-[25%] left-1/2 h-7 w-16 -translate-x-1/2 rounded-t-full border-t-[6px] border-[#171717]"
          />
        )}

        {config.mouth === "thinking" && (
          <motion.div
            animate={{ scaleX: [1, 0.75, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-[26%] left-1/2 h-5 w-16 -translate-x-1/2 rounded-full bg-[#171717]"
          />
        )}

        {config.mouth === "confused" && (
          <motion.div
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="absolute bottom-[25%] left-1/2 h-4 w-16 -translate-x-1/2 rounded-full bg-[#171717]"
          />
        )}

        {/* Tiny floating spark */}
        {mood === "happy" && (
          <motion.span
            animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -right-3 top-8 text-2xl font-black"
          >
            ✦
          </motion.span>
        )}
      </motion.div>

      <motion.p
        key={mood}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-5 text-xs font-semibold text-neutral-400"
      >
        {mood === "happy" && "That sounds lovely."}
        {mood === "sad" && "I'm listening."}
        {mood === "thinking" && "Let me think about that."}
        {mood === "confused" && "Tell me a little more."}
        {mood === "calm" && "I'm here with you."}
      </motion.p>
    </div>
  );
}
