"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 overflow-hidden py-10 px-4">
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
        <div className="h-[500px] w-[500px] rounded-full bg-fuchsia-600/20 blur-[120px]" />
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[15%] top-0 h-full w-px bg-gradient-to-b from-transparent via-violet-500/10 to-transparent" />
        <div className="absolute right-[15%] top-0 h-full w-px bg-gradient-to-b from-transparent via-violet-500/10 to-transparent" />
      </div>

      {/* --- CONTENT WRAPPER --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center w-full max-w-md"
      >
        {/* 1. CUSTOM LOGO & HEADER */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-fuchsia-600 blur-2xl opacity-40 animate-pulse" />
            <div className="relative rounded-2xl bg-slate-900/50 border border-white/10 p-4 backdrop-blur-md shadow-xl">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={60}
                height={60}
                className="h-12 w-12 object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            Login to continue your interview preparation
          </p>
        </div>

        {/* 2. CLERK FORM (SIGN IN) */}
        <div className="w-full flex justify-center">
          <SignIn
            // BẮT BUỘC: Chuyển hướng cưỡng chế sang dashboard
            forceRedirectUrl="/dashboard"
            appearance={{
              layout: {
                socialButtonsPlacement: "bottom",
                logoPlacement: "none",
              },
              variables: {
                colorPrimary: "#8b5cf6",
                colorText: "#f1f5f9",
                colorBackground: "#0f172a",
                colorInputBackground: "#1e293b",
                colorInputText: "#ffffff",
              },
              elements: {
                card: "bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl w-full mx-0 shadow-fuchsia-500/10",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                formFieldLabel: "text-slate-300 font-medium",
                formFieldInput:
                  "bg-slate-950/50 border-slate-700/50 focus:border-violet-500 focus:ring-violet-500/20 transition-all rounded-lg h-10",
                formButtonPrimary:
                  "bg-gradient-to-r from-violet-600 to-fuchsia-600 border-0 hover:brightness-110 shadow-lg shadow-violet-600/20 transition-all transform hover:scale-[1.02] h-10 font-bold",
                socialButtonsBlockButton:
                  "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:text-white transition-all h-10",
                dividerLine: "bg-slate-800",
                dividerText: "text-slate-500 text-xs uppercase tracking-wider",
                footer: "hidden",
              },
            }}
          />
        </div>

        {/* 3. FOOTER */}
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-violet-400 hover:text-violet-300 hover:underline transition-colors decoration-2 underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
