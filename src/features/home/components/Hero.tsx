"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Container from "@/components/layout/Container";

export function Hero() {
  return (
    <section className="relative flex items-center justify-center min-h-[65vh] py-16 md:py-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto flex max-w-4xl flex-col items-center text-center space-y-8 z-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary/5 hover:bg-primary/80 hover:text-primary-foreground border border-primary/10 hover:border-primary/20 px-3.5 py-1.5 rounded-full text-primary font-medium text-xs backdrop-blur-xs transition-all duration-300 hover:-translate-y-px cursor-pointer group">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse group-hover:bg-primary-foreground" />
            New: AI-Powered Comparison Engine
          </div>

          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground leading-tight max-w-3xl">
            The Ultimate{" "}
            <span className="text-primary">Stack Intelligence</span> Platform
          </h1>

          <p className="text-base text-muted-foreground sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium/85">
            Discover, compare, and master the tools that power the world&apos;s
            best software — backed by real reviews from the developers who use
            them every day.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/products">
              <Button
                size="lg"
                className="h-12 px-8 font-bold shadow-premium-md hover:shadow-premium-lg bg-primary hover:bg-primary/95 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 flex items-center gap-2 rounded-xl text-primary-foreground border border-primary/10 cursor-pointer"
              >
                Explore Tools
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/products/submit">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 font-bold rounded-xl border border-border/80 hover:border-border hover:bg-muted/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-premium-sm hover:shadow-premium-md transition-all duration-200 bg-white/70 backdrop-blur-md cursor-pointer"
              >
                Showcase Your Project
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
