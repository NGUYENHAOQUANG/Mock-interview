import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

type Props = {
  feedbackInfo: FeedBackInfo;
};

type FeedBackInfo = {
  feedback: string;
  rating: number;
  suggestion: string[];
};

function FeedbackDialog({ feedbackInfo }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-violet-400 hover:text-violet-300 hover:bg-violet-900/20"
        >
          View Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-slate-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl flex items-center gap-2">
            Interview Result
            <span
              className={`text-sm px-3 py-1 rounded-full border ${feedbackInfo?.rating >= 5 ? "bg-green-500/10 border-green-500 text-green-400" : "bg-red-500/10 border-red-500 text-red-400"}`}
            >
              Score: {feedbackInfo?.rating ?? 0}/10
            </span>
          </DialogTitle>
          <DialogDescription className="text-slate-400 mt-2">
            Here is the detailed feedback provided by AI based on your answers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
            <h2 className="font-semibold text-violet-400 mb-2 flex items-center gap-2">
              Feedback
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {feedbackInfo?.feedback || "No feedback available."}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
            <h2 className="font-semibold text-fuchsia-400 mb-2">
              Suggestions for Improvement
            </h2>
            {/* Giả sử suggestion là string hoặc array, xử lý hiển thị an toàn */}
            <div className="text-slate-300 text-sm leading-relaxed">
              {Array.isArray(feedbackInfo?.suggestion) ? (
                <ul className="list-disc pl-5 space-y-1">
                  {feedbackInfo.suggestion.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p>{feedbackInfo?.suggestion || "No suggestions available."}</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default FeedbackDialog;
