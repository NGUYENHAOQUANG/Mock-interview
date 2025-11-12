"use client";
import { api } from "@/convex/_generated/api";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { GenericAgoraSDK } from "akool-streaming-avatar-sdk";
import { Button } from "@/components/ui/button";
import { PhoneCall, Mic, MicOff, User } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CONTAINER_ID = "akool-avatar-container";
const AVATAR_ID = "dvp_Alinna_realisticbg_20241224";
const DUMMY_COVERSATION = [
  {
    from: "bot",
    text: "Tell me about yourself.",
  },
  {
    from: "user",
    text: "I am React Developer working in IT from last 7 years",
  },
  {
    from: "bot",
    text: "That's great to hear!",
  },
  {
    from: "bot",
    text: "Can you explain the role of state in React and how it differs from props?",
  },
  {
    from: "user",
    text: "It used to manage the state of the react application like setting the value or getting the value.",
  },
  {
    from: "user",
    text: "Prop is used to send value from one component to other",
  },
  {
    from: "bot",
    text: "That's a good explanation!",
  },
  {
    from: "bot",
    text: "How do you manage form state in a React application?",
  },
  {
    from: "user",
    text: "There are different library as well but you can manage it using the useState",
  },
  {
    from: "bot",
    text: "Great!",
  },
  {
    from: "bot",
    text: "Thank you for your insights.",
  },
];

type Messages = {
  from: "user" | "bot";
  text: string;
};

function StartInterview() {
  const { interviewId } = useParams();
  const convex = useConvex();
  const [interviewData, setInterviewData] = useState<any>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [agoraSdk, setAgoraSdk] = useState<GenericAgoraSDK | null>(null);
  const [micOn, setMicOn] = useState(false);
  const [kbId, setKbId] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Messages[]>([]);
  const updateFeedback = useMutation(api.interview.UpdateFeedback);
  const router = useRouter();

  useEffect(() => {
    GetInterviewQuestions();
  }, [interviewId]);

  const GetInterviewQuestions = async () => {
    try {
      const result = await convex.query(api.interview.getInterviewQuestions, {
        // @ts-ignore
        interviewRecordId: interviewId,
      });
      setInterviewData(result);
    } catch (error) {
      console.error("Error fetching interview questions:", error);
    }
  };

  useEffect(() => {
    if (interviewData) {
      GetKnowledgeBase();
    }
  }, [interviewData]);

  const GetKnowledgeBase = async () => {
    if (interviewData?.interviewQuestion) {
      const result = await axios.post("/api/akool-knowledge-base", {
        questions: interviewData.interviewQuestion,
      });
      setKbId(result.data?.data?._id);
    }
  };

  const startConversation = async () => {
    if (!agoraSdk || !kbId) return;
    setLoading(true);

    try {
      const result = await axios.post("/api/akool-session", {
        avatar_id: AVATAR_ID,
        knowledge_id: kbId,
      });

      const credentials = result.data?.data?.credentials;
      if (!credentials) throw new Error("Missing credentials");

      await agoraSdk.joinChannel({
        agora_app_id: credentials.agora_app_id,
        agora_channel: credentials.agora_channel,
        agora_token: credentials.agora_token,
        agora_uid: credentials.agora_uid,
      });

      await agoraSdk.joinChat({
        vid: "6889b610662160e2caad5d8e",
        lang: "vi-VN",
        mode: 2,
      });

      const prompt = `
Bạn là một **người phỏng vấn thân thiện và chuyên nghiệp**, có nhiệm vụ **phỏng vấn ứng viên** theo từng câu hỏi trong danh sách dưới đây.

Mục tiêu:
- Hỏi **từng câu hỏi một**, **chờ ứng viên trả lời xong** rồi mới hỏi câu tiếp theo.
- **Không lặp lại** hoặc **nhắc lại** các câu hỏi đã hỏi trước đó.
- Giữ phong thái **thân thiện, chuyên nghiệp, khích lệ** và tạo cảm giác tự nhiên như một buổi phỏng vấn thực sự.
- Có thể phản hồi ngắn gọn (ví dụ: “Cảm ơn bạn, rất hay!”) trước khi chuyển sang câu tiếp theo.

 Bắt đầu buổi phỏng vấn bằng câu:
"Hãy giới thiệu đôi chút về bạn."

Sau đó, lần lượt hỏi các câu hỏi dưới đây (theo thứ tự):
${interviewData?.interviewQuestion.map((q: any) => q.question).join("\n")}

Khi tất cả các câu hỏi đã được hỏi và trả lời, hãy kết thúc buổi phỏng vấn bằng một lời cảm ơn lịch sự, ví dụ:
"Buổi phỏng vấn hôm nay đến đây là kết thúc. Cảm ơn bạn đã chia sẻ và dành thời gian!"
`;

      await agoraSdk.sendMessage(prompt);

      await agoraSdk.toggleMic(); // Bật mic ngay khi join
      setMicOn(true);
      setJoined(true);
    } catch (error) {
      console.error("Failed to start conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  const leaveConversation = async () => {
    if (!agoraSdk) return;
    await agoraSdk.leaveChat();
    await agoraSdk.leaveChannel();
    await agoraSdk.closeStreaming();
    setJoined(false);
    setMicOn(false);

    await GenerateFeedBack();
  };

  const toggleMic = async () => {
    if (!agoraSdk) return;
    await agoraSdk.toggleMic();
    setMicOn(agoraSdk.isMicEnabled());
  };

  const GenerateFeedBack = async () => {
    if (message.length === 0) {
      toast.error("No conversation recorded.");
      return;
    }

    const cleanMessages = message
      .filter((msg) => msg.text?.trim())
      .map((msg) => ({
        from: msg.from,
        text: msg.text.trim(),
      }));

    console.log("Dữ liệu gửi đến backend:", cleanMessages);

    toast.warning("Generating feedback from real conversation...");

    try {
      const result = await axios.post("/api/interview-feedback", {
        messages: cleanMessages,
      });

      toast.success("Feedback generated!");

      await updateFeedback({
        feedback: result.data,
        // @ts-ignore
        recordId: interviewId,
      });

      toast.success("Feedback saved!");
      router.replace("/dashboard");
    } catch (error: any) {
      toast.error("Feedback failed: " + error.message);
    }
  };

  useEffect(() => {
    const sdk = new GenericAgoraSDK({ mode: "rtc", codec: "vp8" });

    sdk.on({
      onStreamMessage: (uid, message) => {
        console.log("Received message from", uid, ":", message);
        // @ts-ignore
        message.pld?.text?.length > 0 &&
          setMessage((prev: any) => [...prev, message.pld]);
      },
      onException: (error) => {
        console.error("An exception occurred:", error);
      },
      onMessageReceived: (message) => {
        console.log("New message:", message);
      },
      onMessageUpdated: (message) => {
        console.log("Message updated:", message);
      },
      onNetworkStatsUpdated: (stats) => {
        console.log("Network stats:", stats);
      },
      onTokenWillExpire: () => {
        console.log("Token will expire in 30s");
      },
      onTokenDidExpire: () => {
        console.log("Token expired");
      },
      onUserPublished: async (user, mediaType) => {
        if (mediaType === "video" && videoContainerRef.current) {
          await sdk.getClient().subscribe(user, mediaType);
          user?.videoTrack?.play(videoContainerRef.current);
        } else if (mediaType === "audio") {
          await sdk.getClient().subscribe(user, mediaType);
          user?.audioTrack?.play();
        }
      },
    });

    setAgoraSdk(sdk);

    return () => {
      sdk.leaveChat();
      sdk.leaveChannel();
      sdk.closeStreaming();
    };
  }, []);

  return (
    <div className="flex flex-row justify-evenly gap-20 min-h-screen bg-gray-50 p-4">
      <Button onClick={GenerateFeedBack}>test</Button>
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Interview Session
        </h2>

        {/* Avatar Video Container */}
        <div
          ref={videoContainerRef}
          id={CONTAINER_ID}
          className="relative w-full h-96 md:h-[480px] bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 flex items-center justify-center"
        >
          {!joined ? (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <User size={64} className="mb-2" />
              <p className="text-lg">Ready to start interview</p>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              {/* Avatar sẽ tự động play ở đây */}
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
          {/* Mic Button */}
          <Button
            onClick={toggleMic}
            disabled={!joined}
            className={`flex items-center gap-2 px-5 py-3 rounded-full shadow-lg transition-all ${
              micOn
                ? "bg-yellow-400 hover:bg-yellow-300 text-white"
                : "bg-gray-300 hover:bg-gray-200 text-gray-800"
            } ${!joined && "opacity-50 cursor-not-allowed"}`}
          >
            {micOn ? <Mic size={20} /> : <MicOff size={20} />}
            <span>{micOn ? "Mic On" : "Mic Off"}</span>
          </Button>

          {/* Connect / Leave Button */}
          {!joined ? (
            <Button
              onClick={startConversation}
              disabled={loading || !kbId}
              className="flex items-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-400 text-white rounded-full shadow-lg transition disabled:opacity-50"
            >
              <PhoneCall size={20} />
              {loading ? "Connecting..." : "Connect Call"}
            </Button>
          ) : (
            <Button
              onClick={leaveConversation}
              className="flex items-center gap-2 px-5 py-3 bg-red-500 hover:bg-red-400 text-white rounded-full shadow-lg transition"
            >
              <PhoneCall size={20} />
              Leave Call
            </Button>
          )}
        </div>

        {/* Status Indicator */}
        {loading && (
          <p className="text-center mt-4 text-sm text-gray-500 animate-pulse">
            Establishing connection...
          </p>
        )}
      </div>
      <div className="flex flex-col p-6 lg:w-1/3 h-screen overflow-y-auto">
        <h2 className="text-lg font-semibold my-4">Conversation</h2>
        <div className="flex-1  border border-gray-200 rounded-xl p-4 space-y-3">
          {message?.length == 0 ? (
            <div>
              <p>No Messages yet</p>
            </div>
          ) : (
            <div>
              {message.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[80%] mt-1 ${
                      msg.from === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StartInterview;
