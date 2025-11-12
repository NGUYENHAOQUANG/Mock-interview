import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import FeedbackDialog from "./FeedbackDialog";

function InterviewCard({ interviewInfo }: any) {
  return (
    <div className="p-4 border rounded-xl ">
      <h2 className="font-semibold text-xl">
        {interviewInfo?.resumeUrl ? "Resume Interview" : "null"}
      </h2>
      <p className="line-clamp-2 text-gray-500">
        {interviewInfo?.resumeUrl
          ? "we generated questions from the uploaded resume"
          : "null"}
      </p>
      <div className="mt-5 flex justify-between items-center">
        {interviewInfo?.feedback && (
          <FeedbackDialog feedbackInfo={interviewInfo.feedback} />
        )}
        <Link href={`/interview/` + interviewInfo?._id}>
          <Button className="" variant={"outline"}>
            Start Interview <ArrowRight />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default InterviewCard;
