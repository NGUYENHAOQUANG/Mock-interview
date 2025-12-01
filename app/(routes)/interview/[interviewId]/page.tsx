"use client";

import React, { useState } from "react";
import Lottie from "lottie-react";
import interviewAnimation from "@/public/interviewAnimation.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Copy, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

function Interview() {
  const { interviewId } = useParams();
  const [email, setEmail] = useState("");

  const handleCopyLink = () => {
    const link = `${window.location.origin}/interview/${interviewId}/start`;
    navigator.clipboard.writeText(link);
    toast.success("Interview link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-10 px-4 relative overflow-hidden">
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      {/* --- MAIN CARD --- */}
      <div className="relative z-10 w-full max-w-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-0 shadow-2xl flex flex-col items-center text-center">
        {/* 1. Header & Animation */}
        <div className="relative mb-6">
          <div className="w-[250px] h-[250px] md:w-[500px] md:h-[500px]">
            <Lottie
              animationData={interviewAnimation}
              loop={true}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* 2. Title & Description */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Ready to start your
          <span className="text-violet-400">Interview?</span>
        </h1>
        <p className="text-slate-400 max-w-md text-base md:text-lg mb-8 leading-relaxed">
          The interview will last approximately
          <span className="text-white font-semibold">30 minutes</span>. Make
          sure your camera and microphone are working properly before you begin.
        </p>

        {/* 3. Action Button */}
        <Link
          href={`/interview/${interviewId}/start`}
          className="w-full md:w-auto"
        >
          <Button className="w-full md:w-auto px-10 py-6 text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:brightness-110 shadow-lg shadow-violet-500/25 transition-all rounded-full group">
            Start Interview
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>

        {/* 4. Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-10" />

        {/* 5. Share Section */}
        <div className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-6 flex flex-col items-center gap-4">
          <p className="text-slate-300 font-medium flex items-center gap-2">
            Want to share this interview link?
          </p>

          <div className="flex w-full max-w-md gap-3 items-center">
            <div className="relative w-full">
              <Input
                className="bg-slate-900 border-slate-700 text-white focus-visible:ring-violet-500 pr-10"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              onClick={() => toast.info("Feature coming soon!")}
            >
              <Send size={18} />
            </Button>

            {/* Nút copy link nhanh tiện lợi */}
            <Button
              variant="outline"
              className="bg-transparent border-slate-700 text-violet-400 hover:text-violet-300 hover:bg-violet-900/20 hover:border-violet-500/50"
              onClick={handleCopyLink}
              title="Copy Link"
            >
              <Copy size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;
