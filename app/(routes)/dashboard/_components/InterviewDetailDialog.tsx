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
import { FileText, Lightbulb, MessageSquare } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function InterviewDetailDialog({ interviewInfo }: any) {
  // Parse câu hỏi từ JSON string hoặc object
  const questions =
    typeof interviewInfo?.interviewQuestion === "string"
      ? JSON.parse(interviewInfo?.interviewQuestion)
      : interviewInfo?.interviewQuestion;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-violet-400 hover:text-violet-300 hover:bg-violet-900/20 text-xs"
        >
          View Details
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl bg-slate-900 border-white/10 text-white max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            Interview Details
            <span className="text-xs font-normal px-2 py-1 bg-slate-800 rounded-full text-slate-400 border border-slate-700">
              {questions?.length || 0} Questions
            </span>
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Review the generated questions, model answers, and your attached
            resume.
          </DialogDescription>
        </DialogHeader>

        {/* --- ACTIONS BAR --- */}
        <div className="flex gap-3 my-2">
          {interviewInfo?.resumeUrl && (
            <Link
              href={interviewInfo.resumeUrl}
              target="_blank"
              className="w-full sm:w-auto"
            >
              <Button
                size="sm"
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white flex gap-2"
              >
                <FileText className="h-4 w-4 text-violet-400" /> View Uploaded
                Resume
              </Button>
            </Link>
          )}
        </div>

        {/* --- QUESTIONS LIST --- */}
        <ScrollArea className="flex-1 pr-4 mt-2">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {questions &&
              questions.map((item: any, index: number) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-white/5 rounded-lg bg-slate-950/50 px-4"
                >
                  <AccordionTrigger className="hover:no-underline hover:text-violet-400 transition-colors py-4">
                    <div className="flex text-left gap-3">
                      <span className="font-bold text-violet-500">
                        Q{index + 1}.
                      </span>
                      <span className="text-sm md:text-base font-medium text-slate-200">
                        {item?.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    {/* Model Answer */}
                    <div className="bg-slate-900/80 p-4 rounded-md border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2 text-fuchsia-400 text-sm font-semibold mb-1">
                        <Lightbulb className="h-4 w-4" /> Model / Reference
                        Answer:
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {item?.answer}
                      </p>
                    </div>

                    {/* Chỗ này hiển thị User Answer nếu bạn lưu nó vào object question sau khi phỏng vấn */}
                    {item?.userAnswer && (
                      <div className="bg-violet-900/10 p-4 rounded-md border border-violet-500/20 mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-violet-400 text-sm font-semibold mb-1">
                          <MessageSquare className="h-4 w-4" /> Your Answer:
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {item?.userAnswer}
                        </p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default InterviewDetailDialog;
