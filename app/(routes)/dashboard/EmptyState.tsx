import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";

function EmptyState() {
  return (
    <div className="mt-14 border-4 border-dashed border-gray-200 p-4 w-[90%] rounded-2xl bg-gray-50 flex flex-col justify-center items-center">
      <Image
        src="/emptyState.svg"
        alt="emptyStateImage"
        width={400}
        height={400}
        className="mx-auto mt-30"
      />
      <h2 className="text-center text-2xl mt-8 text-gray-300">
        You do not have any interview created
      </h2>
      <Button className="mt-8">+ Create Interview</Button>
    </div>
  );
}

export default EmptyState;
