"use client";
import { api } from "@/convex/_generated/api";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { GenericAgoraSDK } from "akool-streaming-avatar-sdk";
import { Button } from "@/components/ui/button";
import {
  PhoneCall,
  Mic,
  MicOff,
  User,
  Send,
  Settings,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch"; 
import { Label } from "@/components/ui/label";

const CONTAINER_ID = "akool-avatar-container";
const AVATAR_ID = "dvp_Alinna_realisticbg_20241224";

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

  // --- STT & Auto Mode State ---
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  // Chế độ tự động
  const [autoMode, setAutoMode] = useState(false);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);

  const [kbId, setKbId] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Messages[]>([]);
  const updateFeedback = useMutation(api.interview.UpdateFeedback);
  const router = useRouter();

  // --- 1. Khởi tạo Speech Recognition ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "vi-VN"; // Đổi thành en-US nếu cần

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          // Không tắt mic khi lỗi trong Auto Mode để trải nghiệm mượt hơn
          if (!autoMode) setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [autoMode]); // Re-init nếu đổi mode (optional)

  // --- 2. Logic Tự Động Gửi (Auto Send) ---
  useEffect(() => {
    // Chỉ chạy khi ở Auto Mode và có nội dung transcript
    if (autoMode && transcript.trim().length > 0 && isListening) {
      // Clear timer cũ mỗi khi transcript thay đổi (người dùng đang nói tiếp)
      if (silenceTimer.current) clearTimeout(silenceTimer.current);

      // Set timer mới: Nếu im lặng 1.5s -> Tự động gửi
      silenceTimer.current = setTimeout(() => {
        console.log("Auto sending due to silence...");
        handleSendMessage();
      }, 1500); // 1.5 giây im lặng
    }

    return () => {
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
    };
  }, [transcript, autoMode, isListening]);

  // --- Logic API & Agora cũ ---
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
        Bạn là người phỏng vấn. Hãy bắt đầu bằng câu: "Chào bạn, hãy giới thiệu về bản thân."
        Sau đó hỏi lần lượt các câu hỏi sau:
        ${interviewData?.interviewQuestion.map((q: any) => q.question).join("\n")}
        Chờ người dùng trả lời xong mới hỏi câu tiếp theo.
      `;

      await agoraSdk.sendMessage(prompt);
      setJoined(true);

      // Nếu bật Auto Mode, tự động bật mic luôn khi bắt đầu
      if (autoMode) {
        toggleListening();
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast.error("Không thể kết nối với Avatar");
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
    setIsListening(false);
    if (recognitionRef.current) recognitionRef.current.stop();

    await GenerateFeedBack();
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async () => {
    // Lấy giá trị transcript hiện tại (do hàm async closure có thể lấy giá trị cũ, nên cẩn thận)
    // Ở đây ta dùng transcript từ state, nhưng trong useEffect debounce đã đảm bảo trigger đúng lúc.
    // Tuy nhiên để an toàn, ta check lại lần nữa.

    // Lưu ý: State `transcript` trong hàm này sẽ là giá trị tại thời điểm render.
    // Với logic Auto Mode dùng useEffect, nó đã gọi hàm này với context mới nhất.

    // Nếu gọi từ nút bấm, transcript cũng là mới nhất.

    if (!transcript && transcript.trim() === "") return;

    const textToSend = transcript; // Copy lại để tránh race condition khi clear

    setMessage((prev) => [...prev, { from: "user", text: textToSend }]);

    try {
      if (agoraSdk) {
        await agoraSdk.sendMessage(textToSend);
        setTranscript(""); // Xóa text

        // Logic quan trọng:
        // Nếu là Manual Mode -> Tắt Mic sau khi gửi (để người dùng bấm lại).
        // Nếu là Auto Mode -> TẠM THỜI cũng nên tắt Mic để tránh thu tiếng Avatar (Echo).
        // Người dùng sẽ cần bấm lại Mic hoặc ta dùng tai nghe để mic luôn mở.

        // CẬP NHẬT THEO YÊU CẦU: "tự thu những gì tôi trả lời"
        // Để tránh Echo, tốt nhất là tắt mic khi gửi.
        // Sau đó người dùng bấm lại khi muốn nói.
        // HOẶC nếu bạn đeo tai nghe, bạn có thể comment dòng dưới để mic luôn mở.

        recognitionRef.current?.stop();
        setIsListening(false);

        if (autoMode) {
          toast.success("Đã tự động gửi. Bấm mic khi bạn muốn trả lời tiếp.");
        }
      }
    } catch (e) {
      console.error("Lỗi gửi tin nhắn:", e);
      toast.error("Gửi tin nhắn thất bại");
    }
  };

  const GenerateFeedBack = async () => {
    if (message.length === 0) {
      toast.error("No conversation recorded.");
      return;
    }
    const cleanMessages = message
      .filter((msg) => msg.text?.trim())
      .map((msg) => ({ from: msg.from, text: msg.text.trim() }));

    toast.warning("Generating feedback...");
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
      router.replace("/dashboard");
    } catch (error: any) {
      toast.error("Feedback failed: " + error.message);
    }
  };

  useEffect(() => {
    const sdk = new GenericAgoraSDK({ mode: "rtc", codec: "vp8" });
    sdk.on({
      onStreamMessage: (uid, message) => {
        // @ts-ignore
        message.pld?.text?.length > 0 &&
          setMessage((prev: any) => [...prev, message.pld]);
      },
      onUserPublished: async (user, mediaType) => {
        // Fix Avatar biến mất: Đảm bảo ref tồn tại
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
    <div className="flex flex-row justify-evenly gap-10 min-h-screen bg-gray-50 p-4 pt-20">
      {/* Cột Trái */}
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Interview Session
        </h2>

        {/* Ta dùng thẻ div wrapper relative. Video container nằm dưới tuyệt đối. Transcript nằm đè lên. */}
        <div className="relative w-full h-[400px] md:h-[500px] bg-black rounded-2xl overflow-hidden shadow-lg border border-gray-200">
          {/* 1. Lớp Video (Luôn cố định, React không can thiệp vào children của nó) */}
          <div
            ref={videoContainerRef}
            id={CONTAINER_ID}
            className="absolute inset-0 w-full h-full"
          />

          {/* 2. Lớp Overlay (Hiển thị trạng thái/Transcript) */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
            {/* Header Overlay */}
            <div className="flex justify-end">
              {/* Icon trạng thái Mic */}
              {joined && (
                <div
                  className={`p-2 rounded-full ${isListening ? "bg-red-500 animate-pulse" : "bg-black/50"} text-white`}
                >
                  {isListening ? <Mic size={20} /> : <MicOff size={20} />}
                </div>
              )}
            </div>

            {/* Center (Waiting state) */}
            {!joined && (
              <div className="flex flex-col items-center justify-center text-gray-400 h-full">
                <User size={64} className="mb-2" />
                <p className="text-lg">Ready to start</p>
              </div>
            )}

            {/* Bottom (Transcript) */}
            {transcript && (
              <div className="bg-black/70 text-white p-4 rounded-xl text-center backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-5">
                <p className="text-lg font-medium">{transcript}</p>
                {autoMode && isListening && (
                  <p className="text-xs text-gray-300 mt-2 italic">
                    ...đang lắng nghe (tự gửi sau 1.5s im lặng)...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* --- BẢNG ĐIỀU KHIỂN --- */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
          {/* Toggle Auto Mode */}
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <Sparkles
                className={`w-5 h-5 ${autoMode ? "text-violet-600" : "text-gray-400"}`}
              />
              <Label
                htmlFor="auto-mode"
                className="font-semibold text-gray-700"
              >
                {autoMode ? "Chế độ Tự Động" : "Chế độ Thủ Công"}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                {autoMode ? "Tự gửi khi ngừng nói" : "Gửi thủ công"}
              </span>
              <Switch
                id="auto-mode"
                checked={autoMode}
                onCheckedChange={setAutoMode}
                disabled={!joined}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {!joined ? (
              <Button
                onClick={startConversation}
                disabled={loading || !kbId}
                className="bg-green-600 hover:bg-green-500 text-white px-8 py-6 rounded-full text-lg shadow-lg"
              >
                <PhoneCall size={24} className="mr-2" /> Start Interview
              </Button>
            ) : (
              <>
                {/* Nút Mic chính */}
                <Button
                  onClick={toggleListening}
                  className={`px-8 py-6 rounded-full text-lg shadow-lg transition-all ${isListening ? "bg-red-500 hover:bg-red-400 animate-pulse" : "bg-blue-600 hover:bg-blue-500"}`}
                >
                  {isListening ? (
                    <MicOff size={24} className="mr-2" />
                  ) : (
                    <Mic size={24} className="mr-2" />
                  )}
                  {isListening ? "Dừng nói" : "Bắt đầu nói"}
                </Button>

                {/* Nút Gửi (Hiện khi tắt Auto Mode hoặc muốn gửi ngay) */}
                {(!autoMode || transcript) && (
                  <Button
                    onClick={handleSendMessage}
                    disabled={!transcript}
                    className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-6 rounded-full text-lg shadow-lg"
                  >
                    <Send size={24} className="mr-2" /> Gửi
                  </Button>
                )}

                <Button
                  onClick={leaveConversation}
                  variant="destructive"
                  size="icon"
                  className="w-14 h-14 rounded-full"
                >
                  <PhoneCall size={24} />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cột Phải: Chat History */}
      <div className="hidden lg:flex flex-col w-1/3 h-[600px] border border-gray-200 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-100 border-b">
          <h2 className="text-lg font-semibold">Transcript History</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {message.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[85%] text-sm ${msg.from === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200"}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StartInterview;
