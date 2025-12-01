"use client";
import React, { useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import CreateInterviewDialog from "../_components/CreateInterviewDialog";
import { useConvex } from "convex/react";
import { UserDetailContext } from "@/context/UserDetailProvider";
import { api } from "@/convex/_generated/api";
import EmptyState from "./_components/EmptyState";
import InterviewCard from "./_components/InterviewCard";

function Dashboard() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const { userDetails } = useContext(UserDetailContext);
  const convex = useConvex();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userDetails && GetInterviewList();
  }, [userDetails]);

  const GetInterviewList = async () => {
    setLoading(true);
    const result = await convex.query(api.interview.GetInterviewList, {
      uid: userDetails?._id,
    });
    //@ts-ignore
    setInterviewList(result);
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      {/* --- BACKGROUND EFFECTS (Copy từ trang Login) --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 transform">
        <div className="h-[600px] w-[600px] rounded-full bg-fuchsia-600/10 blur-[120px]" />
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[10%] top-0 h-full w-px bg-gradient-to-b from-transparent via-violet-500/5 to-transparent" />
        <div className="absolute right-[10%] top-0 h-full w-px bg-gradient-to-b from-transparent via-violet-500/5 to-transparent" />
      </div>

      {/* --- CONTENT --- */}
      <div className="relative z-10 py-10 px-6 md:px-20 lg:px-32 xl:px-44">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <h2 className="text-lg text-violet-400 font-medium">
              My Dashboard
            </h2>
            <h2 className="text-3xl font-bold text-white mt-1">
              Welcome back,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                {user?.fullName}
              </span>
            </h2>
            <p className="text-slate-400 mt-2 text-sm">
              Start your AI-powered interview preparation today.
            </p>
          </div>
          <CreateInterviewDialog />
        </div>

        <div className="mt-10">
          {!loading && interviewList.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviewList.map((interview, index) => (
                <InterviewCard key={index} interviewInfo={interview} />
              ))}
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col space-y-3 p-4 border border-white/5 rounded-xl bg-slate-900/30"
                >
                  <Skeleton className="h-[100px] w-full rounded-lg bg-slate-800" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[80%] bg-slate-800" />
                    <Skeleton className="h-4 w-[60%] bg-slate-800" />
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
export default Dashboard;
