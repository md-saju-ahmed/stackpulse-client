"use client";

import { motion, MotionConfig } from "framer-motion";
import { Hero } from "./Hero";
import { PlatformStats } from "./PlatformStats";
import { Features } from "./Features";
import { Trending } from "./Trending";
import { BrowseCategories } from "./BrowseCategories";
import { Testimonials } from "./Testimonials";
import { Newsletter } from "./Newsletter";

export function HomeClient() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative overflow-hidden pb-12 min-h-screen text-foreground">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50" />

          <motion.div
            animate={{
              scale: [1, 1.1, 0.95, 1],
              x: [0, 30, -20, 0],
              y: [0, -25, 20, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-[-10%] left-[-10%] h-137.5 w-137.5 rounded-full bg-primary/3 blur-[160px]"
          />
          <motion.div
            animate={{
              scale: [1, 0.9, 1.05, 1],
              x: [0, -20, 20, 0],
              y: [0, 30, -20, 0],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-[20%] right-[-10%] h-162.5 w-162.5 rounded-full bg-brand-accent/5 blur-[160px]"
          />
        </div>

        <Hero />
        <PlatformStats />
        <Features />
        <Trending />
        <BrowseCategories />
        <Testimonials />
        <Newsletter />
      </div>
    </MotionConfig>
  );
}
