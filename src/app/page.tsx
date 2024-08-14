import CallToAction from "@/components/CallToAction";
import ScrollUp from "@/components/Common/ScrollUp";
import Faq from "@/components/Faq";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nucleus",
  description:
    "Nucleus: An AI-powered platform for students to connect, collaborate, and automate college assignments while showcasing their tech achievements.",
};

export default function Home() {
  return (
    <main>
      <ScrollUp />
      <Hero />
      <Features />
      <CallToAction />
      <Faq />
     
    </main>
  );
}
