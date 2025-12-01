import Image from "next/image";
import React from "react";
import CreateInterviewDialog from "../../_components/CreateInterviewDialog";

function EmptyState() {
  return (
    <div className="border border-dashed border-white/10 p-10 w-full rounded-2xl bg-slate-900/30 flex flex-col justify-center items-center text-center">
      <div className="bg-slate-800/50 p-6 rounded-full mb-6">
        <Image
          src="/emptyState.svg" // Nếu ảnh này màu đen, bạn cần đổi sang ảnh màu sáng hoặc dùng filter invert
          alt="emptyStateImage"
          width={400}
          height={400}
          className="opacity-70"
        />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">
        No Interviews Created Yet
      </h2>
      <p className="text-slate-400 mb-8 max-w-md">
        Create your first AI mock interview to start practicing and getting
        feedback on your skills.
      </p>
      <CreateInterviewDialog />
    </div>
  );
}

export default EmptyState;
