import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import FeedbackDialog from "./FeedbackDialog";

function InterviewCard({ interviewInfo }: any) {
  return (
    <div className="p-4 border rounded-xl">
      <h2 className="font-semibold text-xl">
        {interviewInfo?.resumeUrl
          ? "Resume-Based Interview"
          : interviewInfo?.jobTitle || "Untitled Interview"}
      </h2>
      <p className="line-clamp-2 text-gray-500">
        {interviewInfo?.resumeUrl
          ? "Questions generated from your uploaded resume"
          : interviewInfo?.jobDescription || "No job description"}
      </p>
      <div className="mt-5 flex justify-between items-center">
        {interviewInfo?.feedback && (
          <FeedbackDialog feedbackInfo={interviewInfo.feedback} />
        )}
        <Link href={`/interview/${interviewInfo?._id}`}>
          <Button variant="outline">
            Start Interview <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default InterviewCard;
