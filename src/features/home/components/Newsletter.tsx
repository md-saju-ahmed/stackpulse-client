"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import Container from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";

export function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="py-12 md:py-16">
      <Container>
        <Reveal className="bg-linear-to-br from-primary to-[color-mix(in_oklch,var(--primary)_85%,var(--brand-accent)_15%)] rounded-2xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden shadow-premium-xl border border-white/15">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15)_0%,transparent_60%)] pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-primary-foreground">
              Stay Ahead of the Curve
            </h2>
            <p className="text-sm text-primary-foreground/90 font-medium/90">
              Get a weekly pulse on the latest tools, trends, and tutorials
              delivered straight to your inbox.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Thanks! We'll be in touch.");
                setEmail("");
              }}
              className="flex flex-col md:flex-row gap-3 max-w-md mx-auto pt-2"
            >
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="grow px-5 py-3 rounded-xl border border-white/10 text-slate-900 bg-white/95 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent shadow-inner text-sm transition-all duration-200"
                placeholder="Enter your email"
                type="email"
              />
              <button
                className="bg-brand-accent text-brand-accent-foreground hover:brightness-102 hover:shadow-premium-md active:scale-[0.98] active:translate-y-px px-6 py-3 rounded-xl font-bold transition-all shadow-premium-sm text-sm cursor-pointer outline-none focus-visible:ring-3 focus-visible:ring-brand-accent/50"
                type="submit"
              >
                Subscribe
              </button>
            </form>
            <p className="text-[10px] text-primary-foreground/70 uppercase tracking-widest font-semibold">
              No spam. Only high-value insights.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
