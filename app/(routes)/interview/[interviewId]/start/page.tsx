"use client";
import { api } from "@/convex/_generated/api";
import axios from "axios";
import { useConvex } from "convex/react";
import { useParams } from "next/navigation";
import React, { use, useEffect, useState, useRef } from "react";
import { GenericAgoraSDK } from "akool-streaming-avatar-sdk";
import { Button } from "@/components/ui/button";
import { start } from "repl";
type InterviewQuestion = {
  question: string;
  answer: string;
};

type InterviewData = {
  _id: string;
  interviewQuestion: InterviewQuestion[];
  resumeUrl?: string;
  userId: string;
};
const CONTAINER_ID = "akool-avatar-container";
const AVATAR_ID = "data_lira_sp-02";

function StartInterview() {
  const { interviewId } = useParams();
  const convex = useConvex();
  const [interviewData, setInterviewData] = useState<any>(null);
  const videoContainerRef = useRef<any>(null);
  const [agoraSdk, setAgoraSdk] = useState<GenericAgoraSDK | null>(null);
  const [micOn, setMicOn] = useState(false);
  const [kbId, setKbId] = useState<string | null>();
  const [joined, setJoined] = useState(false);
  useEffect(() => {
    GetInterviewQuestions();
  }, [interviewId]);

  const GetInterviewQuestions = async () => {
    try {
      const result = await convex.query(api.interview.getInterviewQuestions, {
        // @ts-ignore
        interviewRecordId: interviewId,
      });
      console.log(result);
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
    if (interviewData && interviewData.interviewQuestion) {
      const result = await axios.post("/api/akool-knowledge-base", {
        questions: interviewData.interviewQuestion,
      });
      console.log(result);
      setKbId(result.data?.data?._id);
      console.log(interviewData.interviewQuestion);
    } else {
      console.log("Interview data is not ready or empty");
    }
  };

  const startConversation = async () => {
    if (!agoraSdk) return;
    const result = await axios.post("/api/akool-session", {
      avatar_id: AVATAR_ID,
      knowledge_id: kbId,
    });

    console.log(result.data);
    const credentials = result.data?.data?.credentials;
    if (!credentials) throw new Error("Missing credentials");

    await agoraSdk?.joinChannel({
      agora_app_id: credentials.agora_app_id,
      agora_channel: credentials.agora_channel,
      agora_token: credentials.agora_token,
      agora_uid: credentials.agora_uid,
    });

    agoraSdk?.joinChat({
      vid: "en-US-Wavenet-A",
      lang: "en",
      mode: 2,
    });
    await agoraSdk?.toggleMic();
    setMicOn(true);
    setJoined(true);
  };

  const leaveConversation = async () => {
    if (!agoraSdk) return;
    await agoraSdk.leaveChat();
    await agoraSdk.leaveChannel();
    await agoraSdk.closeStreaming();
    setJoined(false);
    setMicOn(false);
  };

  const toggleMic = async () => {
    if (!agoraSdk) return;
    await agoraSdk.toggleMic();
    setMicOn(agoraSdk?.isMicEnabled());
  };

  useEffect(() => {
    const sdk = new GenericAgoraSDK({ mode: "rtc", codec: "vp8" });
    // Register event handlers
    sdk.on({
      onStreamMessage: (uid, message) => {
        console.log("Received message from", uid, ":", message);
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
        if (mediaType === "video") {
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
    <div>
      <div
        ref={videoContainerRef}
        id={CONTAINER_ID}
        style={{
          width: 640,
          height: 480,
          background: "#000000",
          marginTop: "20px",
        }}
      ></div>
      <div>
        <Button onClick={toggleMic}>{micOn ? "Mute Mic" : "Unmute Mic"}</Button>

        {!joined ? (
          <Button onClick={startConversation}>start conversation</Button>
        ) : (
          <Button onClick={leaveConversation}>Leave conversation</Button>
        )}
      </div>
    </div>
  );
}

export default StartInterview;
