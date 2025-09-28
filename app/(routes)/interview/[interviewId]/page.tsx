"use client";

import React from "react";
import Lottie from "lottie-react";
import interviewAnimation from "@/public/interviewAnimation.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Send } from "lucide-react";

function Interview() {
  return (
    <div className="flex justify-center items-center flex-col border border-4 border-dashed border-fuchsia-800 rounded-2xl w-[1000px] my-0 mx-auto p-4 mt-2 border-opacity-30 ">
      <Lottie
        className="w-150 h-150 relative"
        animationData={interviewAnimation}
        loop={true}
      />
      <p className="text-3xl text-gray-950 font-bold absolute top-[65%]">
        Readdy to start Interview ?
      </p>

      <div className="flex text-center max-w-lg gap-4 flex-col justify-center items-center transform -translate-y-5">
        <p>the interview will last 30 minutes. Are you ready to begin?</p>
        <Button>
          start interview <ArrowRight />
        </Button>
      </div>
      <div className="bg-gray-100 p-6 rounded-lg  flex flex-col justify-center items-center">
        <p className="text-xl text-gray-950 font-bold mt-4">
          Want to sent interview link to someone?
        </p>
        <div className="flex gap-2 w-[600px]">
          <Input className="mt-4  bg-white" placeholder="Enter email address" />
          <Button className="mt-4">
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Interview;
