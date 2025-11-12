"use client";
import React, { use, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import CreateInterviewDialog from "../_components/CreateInterviewDialog";
import { useConvex } from "convex/react";
import { UserDetailContext } from "@/context/UserDetailProvider";
import { api } from "@/convex/_generated/api";
import EmptyState from "./_components/EmptyState";
import InterviewCard from "./_components/InterviewCard";
import { Badge } from "@/components/ui/badge";
function Dashboard() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
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

    console.log(result);
    //@ts-ignore
    setInterviewList(result);
    setLoading(false);
  };

  return (
    <div className="py-20 px-10 md:px-28 lg:px-44 xl:px-56">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg text-gray-500">My Dashboard</h2>
          <h2 className="text-3xl font-bold"> Welcome {user?.fullName}</h2>
        </div>
        <CreateInterviewDialog />
      </div>
      <div className="flex justify-start items-center">
        {!loading && interviewList.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl gap-5 mt-10">
            {interviewList.map((interview, index) => (
              <InterviewCard key={index} interviewInfo={interview} />
            ))}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl gap-5 mt-10">
            {[1, 2, 3, 4, 5].map((item, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[450px]" />
                  <Skeleton className="h-4 w-[400px]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default Dashboard;
