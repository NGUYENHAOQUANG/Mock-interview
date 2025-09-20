import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import React from "react";

function JobDescription({ handleInputChange }: any) {
  return (
    <div className="flex flex-col gap-4 border rounded-lg p-10">
      <div>
        <label>Job Title</label>
        <Input
          placeholder="ex. Full Stack Developer..."
          onChange={(e) => handleInputChange("jobTitle", e.target.value)}
        />
      </div>
      <div>
        <label>Job Description</label>
        <Textarea
          placeholder="Enter job description..."
          className="min-h-[200px]"
          onChange={(e) => handleInputChange("jobDescription", e.target.value)}
        />
      </div>
    </div>
  );
}

export default JobDescription;
