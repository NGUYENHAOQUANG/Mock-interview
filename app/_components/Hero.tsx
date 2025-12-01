"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

// --- VARIANTS DEFINITION ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const textVariant = {
  hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// Hiệu ứng tay: Tăng độ mượt và quãng đường di chuyển một chút
const handLeftVariant = {
  hidden: { x: -250, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.5,
    },
  },
};

const handRightVariant = {
  hidden: { x: 250, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.5,
    },
  },
};

// Logo xuất hiện với hiệu ứng xoay và scale mạnh hơn
const logoWrapperVariant = {
  hidden: { scale: 0, opacity: 0, rotate: -180 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      delay: 1.6,
      type: "spring",
      stiffness: 150,
      damping: 10,
    },
  },
};

// Hiệu ứng sóng sung kích (Shockwave) lặp lại liên tục
const shockwaveVariant = {
  animate: {
    scale: [1, 3], // Phóng to từ 1 lên 3 lần
    opacity: [0.5, 0], // Mờ dần khi to ra
    transition: {
      duration: 2.5,
      repeat: Infinity, // Lặp lại mãi mãi
      repeatDelay: 1, // Nghỉ 1 giây giữa các lần nổ
      ease: "easeOut",
    },
  },
};

// Hiệu ứng nhịp thở của Logo (Pulse)
const logoPulseVariant = {
  animate: {
    scale: [1, 1.05, 1],
    filter: [
      "drop-shadow(0 0 10px rgba(167, 139, 250, 0.5)) brightness(1)",
      "drop-shadow(0 0 30px rgba(192, 132, 252, 1)) brightness(1.2)", // Sáng rực lên
      "drop-shadow(0 0 10px rgba(167, 139, 250, 0.5)) brightness(1)",
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

function Hero() {
  const titleText = "master job interview with ai practice sessions";
  const words = titleText.toUpperCase().split(" ");

  return (
    <div className="relative mx-auto flex min-h-screen w-full flex-col items-center justify-start overflow-hidden bg-slate-950 pt-20">
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 transform">
        <div className="h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-[120px]" />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[10%] top-0 h-full w-px bg-gradient-to-b from-transparent via-violet-500/10 to-transparent" />
        <div className="absolute right-[10%] top-0 h-full w-px bg-gradient-to-b from-transparent via-violet-500/10 to-transparent" />
      </div>

      {/* --- MAIN CONTENT --- */}
      <motion.div
        className="relative z-10 px-4 py-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 1. TITLE SECTION */}
        <h1 className="relative mx-auto max-w-5xl text-3xl font-extrabold tracking-tight md:text-5xl lg:text-7xl">
          {words.map((word, index) => (
            <motion.span
              key={index}
              variants={textVariant}
              className="mr-2 inline-block bg-gradient-to-br from-white via-violet-200 to-violet-400 bg-clip-text text-transparent drop-shadow-sm"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          variants={textVariant}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 md:text-xl"
        >
          “Prepare for your dream role with{" "}
          <span className="text-violet-400 font-semibold">
            interactive AI avatars
          </span>
          . Refine your skills and walk into every interview with confidence.”
        </motion.p>

        {/* 2. VISUAL INTERACTION SECTION */}
        {/* Tăng chiều cao container lên một chút để chứa hình to hơn */}
        <div className="relative mt-12 flex h-[250px] w-full items-center justify-center md:h-[400px]">
          {/* Left Hand (Human) - Added Mask Gradient */}
          <motion.div
            variants={handLeftVariant}
            className="absolute left-[5%] md:left-[10%] z-20 flex w-[160px] md:w-[350px] origin-left items-center justify-end"
            style={{
              // Gradient mask: Trong suốt ở bên trái (0%) -> Đen đặc (hiện hình) ở 30%
              maskImage: "linear-gradient(to right, transparent 0%, black 30%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 30%)",
            }}
          >
            <Image
              src="/human-hand.png"
              alt="Human Hand"
              width={600}
              height={600}
              className="h-auto w-full object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>

          {/* Right Hand (Robot) - Added Mask Gradient */}
          <motion.div
            variants={handRightVariant}
            className="absolute right-[5%] md:right-[10%] z-20 flex w-[160px] md:w-[350px] origin-right items-center justify-start"
            style={{
              // Gradient mask: Đen đặc ở 70% -> Trong suốt ở bên phải (100%)
              maskImage:
                "linear-gradient(to right, black 70%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, black 70%, transparent 100%)",
            }}
          >
            <Image
              src="/robot-hand.png"
              alt="Robot Hand"
              width={600}
              height={600}
              className="h-auto w-full object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>

          {/* Center Logo Area */}
          <motion.div
            className="relative z-30 flex items-center justify-center"
            variants={logoWrapperVariant}
          >
            {/* Recurring Shockwaves (Vòng nổ lặp lại) */}
            <motion.div
              variants={shockwaveVariant}
              animate="animate"
              className="absolute inset-0 -z-10 rounded-full border border-violet-400/30 bg-violet-500/10"
            />

            {/* The Glowing Core */}
            <motion.div
              variants={logoPulseVariant}
              animate="animate"
              className="relative rounded-full bg-slate-950 p-2 shadow-2xl" // Thêm nền tối nhỏ sau logo để nổi bật hơn
            >
              {/* Static Glow Background */}
              <div className="absolute inset-0 -z-10 rounded-full bg-violet-600 blur-2xl opacity-60" />

              <Image
                src="/logo.svg"
                alt="AI Core Logo"
                width={150} // Tăng kích thước logo
                height={150}
                className="h-20 w-20 md:h-32 md:w-32 object-contain"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* 3. BUTTONS SECTION */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { delay: 2.2, duration: 0.5 },
            },
          }}
          className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-6"
        >
          {/* Explore Button */}
          <Link href="/dashboard">
            <Button
              size={"lg"}
              className="relative overflow-hidden border-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-10 py-7 text-xl font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.8)]"
            >
              <span className="relative z-10">Explore Now</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform hover:translate-x-full duration-1000" />
            </Button>
          </Link>

          {/* Contact Button */}
          <button className="group relative rounded-lg border border-slate-700 bg-slate-900/50 px-8 py-4 text-lg font-medium text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-violet-500 hover:text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]">
            Contact Support
          </button>
        </motion.div>
      </motion.div>

      {/* Bottom Light Line */}
      <div className="absolute bottom-0 h-px w-full bg-gradient-to-r from-transparent via-violet-800 to-transparent opacity-50" />
    </div>
  );
}

export default Hero;
