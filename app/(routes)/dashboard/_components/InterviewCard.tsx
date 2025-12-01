import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  FileText,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import FeedbackDialog from "./FeedbackDialog";
import InterviewDetailDialog from "./InterviewDetailDialog";

function InterviewCard({ interviewInfo }: any) {
  // Helper format ngày tháng
  const formatDate = (timestamp: number) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="group relative p-5 border border-white/10 rounded-2xl bg-slate-900/40 backdrop-blur-sm hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] transition-all duration-300 flex flex-col justify-between h-full">
      {/* --- HEADER --- */}
      <div>
        {/* Status Badge & Icon */}
        <div className="flex justify-between items-start mb-3">
          <div className="absolute top-4 right-4 text-violet-500/20 group-hover:text-violet-500 transition-colors">
            <Sparkles className="w-8 h-8" />
          </div>
          {/* Nếu status là completed thì hiện badge xanh */}
          {interviewInfo?.feedback ? (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Completed
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Draft
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="font-bold text-lg text-white group-hover:text-violet-300 transition-colors pr-8">
          {interviewInfo?.jobTitle || "Resume Based Interview"}
        </h2>

        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 mb-3">
          <Calendar className="w-3 h-3" />
          Created: {formatDate(interviewInfo?._creationTime)}
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-sm text-slate-400 h-10 mb-4">
          {interviewInfo?.resumeUrl
            ? "Questions generated based on your CV analysis."
            : interviewInfo?.jobDescription || "No job description provided."}
        </p>
      </div>

      {/* --- FOOTER ACTIONS --- */}
      <div className="flex flex-col gap-3">
        {/* Row 1: Resume & Details Links */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          {interviewInfo?.resumeUrl ? (
            <Link
              href={interviewInfo.resumeUrl}
              target="_blank"
              title="View Resume"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-fit text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <FileText className="w-4 h-4" /> view Resume
              </Button>
            </Link>
          ) : (
            <div className="w-8"></div>
          )}

          {/* Nút xem chi tiết câu hỏi/câu trả lời mẫu */}
          <InterviewDetailDialog interviewInfo={interviewInfo} />
        </div>

        {/* Row 2: Main Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          {interviewInfo?.feedback ? (
            <div className="w-full">
              {/* TRUYỀN THÊM TRANSCRIPT VÀO ĐÂY */}
              <FeedbackDialog
                feedbackInfo={interviewInfo.feedback}
                transcript={interviewInfo.transcript}
              />
            </div>
          ) : null}

          <Link href={`/interview/${interviewInfo?._id}`} className="w-full">
            <Button
              size="sm"
              className="w-full bg-slate-800 hover:bg-violet-600 text-white border border-white/10 hover:border-violet-500 transition-all shadow-lg shadow-black/20"
            >
              {interviewInfo?.feedback ? "Retake" : "Start"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default InterviewCard;
