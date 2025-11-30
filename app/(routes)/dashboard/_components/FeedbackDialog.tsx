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

type Props = {
  feedbackInfo: FeedBackInfo;
};

type FeedBackInfo = {
  feedback: string;
  rating: number;
  suggestion: string[];
  
};

function FeedbackDialog({ feedbackInfo }: Props) {
  // Thêm kiểm tra dữ liệu
  console.log("feedbackInfo in Dialog:", feedbackInfo);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>feedback</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">
            Interview Feedback
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-4">
              <div>
                <h2 className="font-bold text-lg text-black">Feedback:</h2>
                <p className="text-gray-700">
                  {feedbackInfo?.feedback || "N/A"}
                </p>
              </div>

              <div>
                <h2 className="font-bold text-lg text-black">Suggestions:</h2>
                <p className="text-gray-700">
                  {feedbackInfo?.suggestion || "N/A"}
                </p>
              </div>

              <div>
                <h2 className="font-bold text-lg text-black">Rating:</h2>
                <p className="text-lg font-semibold">
                  {feedbackInfo?.rating ?? "N/A"} / 10
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
export default FeedbackDialog;
