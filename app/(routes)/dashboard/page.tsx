"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import EmptyState from "./EmptyState";
import CreateInterviewDialog from "../_components/CreateInterviewDialog";
function Dashboard() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  return (
    <div className="py-20 px-10 md:px-28 lg:px-44 xl:px-56">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg text-gray-500">My Dashboard</h2>
          <h2 className="text-3xl font-bold"> Welcome {user?.fullName}</h2>
        </div>
        <CreateInterviewDialog />
      </div>
      <div className="flex justify-center items-center">
        {interviewList.length === 0 && <EmptyState />}
      </div>
    </div>
  );
}
export default Dashboard;
