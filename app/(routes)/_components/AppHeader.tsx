import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { hr } from "motion/react-client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function AppHeader() {
  const dataLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
    },
    {
      name: "Upgrade",
      href: "/upgrade",
    },
    {
      name: "How it work",
      href: "/how-it-work ?",
    },
  ];
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center justify-between w-280">
        <div className="flex justify-center items-center ">
          <Image src={"/logo.svg"} alt="logo" width={32} height={32} />
          <h1 className="text-base font-bold md:text-2xl">AI Mock Interview</h1>
        </div>
        <div className="flex gap-8">
          {dataLinks.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="text-lg hover:scale-105 transition-all cursor-pointer hover:text-violet-600 "
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      <UserButton />
    </nav>
  );
}

export default AppHeader;
