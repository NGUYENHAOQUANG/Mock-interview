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
import { MessageSquare, User, Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  feedbackInfo: FeedBackInfo;
  transcript?: { from: string; text: string }[]; // Thêm prop transcript
};

type FeedBackInfo = {
  feedback: string;
  rating: number;
  suggestion: string[];
};

function FeedbackDialog({ feedbackInfo, transcript }: Props) {
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
      {/* Tăng độ rộng dialog để chứa tab thoải mái hơn */}
      <DialogContent className="max-w-4xl bg-slate-900 border-white/10 text-white max-h-[85vh] flex flex-col">
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
            Review your AI feedback and conversation history.
          </DialogDescription>
        </DialogHeader>

        {/* SỬ DỤNG TABS ĐỂ GIỮ NGUYÊN BỐ CỤC CŨ TRONG TAB "FEEDBACK" */}
        <Tabs
          defaultValue="feedback"
          className="w-full h-full flex flex-col overflow-hidden mt-2"
        >
          <TabsList className="bg-slate-950 border border-white/10 w-fit justify-start">
            <TabsTrigger
              value="feedback"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
            >
              Feedback & Suggestions
            </TabsTrigger>
            <TabsTrigger
              value="transcript"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
            >
              Conversation History
            </TabsTrigger>
          </TabsList>

          {/* === TAB 1: GIỮ NGUYÊN 100% LOGIC HIỂN THỊ CŨ === */}
          <TabsContent
            value="feedback"
            className="flex-1 overflow-y-auto pr-2 custom-scrollbar"
          >
            <div className="space-y-6 mt-4">
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
                <div className="text-slate-300 text-sm leading-relaxed">
                  {Array.isArray(feedbackInfo?.suggestion) ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {feedbackInfo.suggestion.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>
                      {feedbackInfo?.suggestion || "No suggestions available."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* === TAB 2: THÊM MỚI - HIỂN THỊ CUỘC HỘI THOẠI === */}
          <TabsContent
            value="transcript"
            className="flex-1 overflow-hidden h-full mt-4"
          >
            <ScrollArea className="h-[50vh] w-full rounded-md border border-slate-800 bg-slate-950/50 p-4">
              {transcript && transcript.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {transcript.map((msg: any, index: number) => (
                    <div
                      key={index}
                      className={`flex w-full ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex max-w-[80%] gap-3 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        {/* Avatar Icon */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.from === "user" ? "bg-violet-600" : "bg-slate-700"}`}
                        >
                          {msg.from === "user" ? (
                            <User size={16} />
                          ) : (
                            <Bot size={16} />
                          )}
                        </div>

                        {/* Bubble Text */}
                        <div
                          className={`p-3 rounded-2xl text-sm ${
                            msg.from === "user"
                              ? "bg-violet-600 text-white rounded-tr-none"
                              : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                  <MessageSquare className="h-8 w-8 opacity-50" />
                  <p>No conversation transcript saved.</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
export default FeedbackDialog;
