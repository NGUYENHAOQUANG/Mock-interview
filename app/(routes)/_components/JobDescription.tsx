import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

function JobDescription({ handleInputChange }: any) {
  return (
    <div className="flex flex-col gap-5 mt-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">
          Job Title / Role
        </label>
        <Input
          placeholder="Ex. Senior React Developer"
          onChange={(e) => handleInputChange("jobTitle", e.target.value)}
          className="bg-slate-950 border-slate-700 text-white focus-visible:ring-violet-500 placeholder:text-slate-600"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">
          Job Description / Tech Stack
        </label>
        <Textarea
          placeholder="Paste the job description here (skills, requirements, etc.)..."
          className="min-h-[200px] bg-slate-950 border-slate-700 text-white focus-visible:ring-violet-500 placeholder:text-slate-600 resize-none"
          onChange={(e) => handleInputChange("jobDescription", e.target.value)}
        />
      </div>
    </div>
  );
}

export default JobDescription;
