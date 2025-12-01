"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Hiệu ứng đổi màu nền khi cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-slate-950/80 backdrop-blur-md shadow-lg"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center">
            {/* Glow effect sau logo */}
            <div className="absolute inset-0 bg-violet-600 blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
            <Image
              src="/logo.svg"
              alt="logo"
              width={40}
              height={40}
              className="relative z-10 transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">
            AI Mock <span className="text-violet-400">Interview</span>
          </h1>
        </Link>

        {/* Action Button */}
        {/* Ẩn nút nếu đang ở trang dashboard để tránh lặp lại */}
        {pathname !== "/dashboard" && (
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="relative overflow-hidden rounded-full border border-violet-500/50 bg-violet-950/30 px-6 py-5 text-base font-semibold text-white transition-all duration-300 hover:border-violet-400 hover:bg-violet-900/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
            >
              Get Started
              {/* Mũi tên nhỏ hiện ra khi hover */}
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
