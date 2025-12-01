"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils"; // Giả sử bạn có utils, nếu chưa có thì xóa cn đi và dùng string thường

function AppHeader() {
  const pathname = usePathname();

  const dataLinks = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Dashboard",
      href: "/dashboard",
    },

    {
      name: "How it works",
      href: "/how-it-work", // Sửa lại href cho chuẩn (bỏ dấu cách và ?)
    },
  ];

  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-slate-950/80 backdrop-blur-md px-6 py-4 transition-all">
      {/* --- LEFT SECTION: LOGO & NAV --- */}
      <div className="flex items-center gap-10">
        {/* 1. LOGO (Có hiệu ứng Glow) */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative flex items-center justify-center">
            {/* Glow effect phía sau logo */}
            <div className="absolute inset-0 bg-violet-600 blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
            <Image
              src={"/logo.svg"}
              alt="logo"
              width={35}
              height={35}
              className="relative z-10 transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white md:text-xl">
            AI Mock <span className="text-violet-400">Interview</span>
          </h1>
        </Link>

        {/* 2. NAVIGATION LINKS (Chỉ hiện trên màn hình lớn) */}
        <div className="hidden md:flex items-center gap-6">
          {dataLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                href={link.href}
                key={link.href}
                className={cn(
                  "text-sm font-medium transition-all duration-300 hover:scale-105",
                  isActive
                    ? "text-violet-400 font-semibold" // Style khi đang ở trang đó
                    : "text-slate-400 hover:text-violet-300" // Style mặc định
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* --- RIGHT SECTION: USER BUTTON --- */}
      <div className="flex items-center gap-4">
        {/* Wrapper để tạo viền glow nhẹ cho Avatar */}
        <div className="rounded-full border border-white/10 p-1 bg-slate-900/50 hover:border-violet-500/50 transition-colors">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
              },
            }}
          />
        </div>
      </div>
    </nav>
  );
}

export default AppHeader;
