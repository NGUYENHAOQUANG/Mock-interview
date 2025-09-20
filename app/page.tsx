import { Button } from "@/components/ui/button";
import Head from "next/head";
import Header from "./_components/Header";
import Hero from "./_components/Hero";

export default function Home() {
  return (
    <div>
      {/* Header */}
      <Header />
      {/* HeroSection */}
      <Hero />
    </div>
  );
}
