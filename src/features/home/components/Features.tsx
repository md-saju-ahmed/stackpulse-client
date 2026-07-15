"use client";

import { LayoutGrid, ShieldCheck, SlidersHorizontal, Star } from "lucide-react";
import Container from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";

const features = [
  {
    icon: SlidersHorizontal,
    title: "Search & filter that works",
    description:
      "Filter by category and pricing model, sort by rating or recency, and search by name — built to help you narrow hundreds of tools down to the handful worth trying.",
  },
  {
    icon: Star,
    title: "Ratings from real users",
    description:
      "Every review is tied to a real account and a star rating, so a tool's score reflects people who've actually shipped with it — not vendor copy.",
  },
  {
    icon: LayoutGrid,
    title: "Organized by category",
    description:
      "Tools are grouped into clear categories so you can browse the whole landscape for a job — databases, CI/CD, observability — in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Moderated submissions",
    description:
      "New tools go through a review queue before they're published, keeping the directory free of spam and duplicate listings.",
  },
];

export function Features() {
  return (
    <section className="py-20 md:py-24">
      <Container>
        <Reveal className="mb-12 md:mb-14 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-foreground">
            Everything you need to pick the right tool
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            StackPulse is built around the parts of tool research that actually
            matter — not marketing pages.
          </p>
        </Reveal>

        <Reveal
          delay={0.1}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex flex-col gap-3 rounded-xl border border-slate-150/60 bg-white/60 backdrop-blur-md p-6 shadow-premium-sm hover:-translate-y-1 hover:shadow-premium-md hover:border-primary/20 hover:bg-white transition-all duration-300 group"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-linear-to-br from-primary/5 to-primary/15 border border-primary/10 text-primary shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-heading text-sm font-bold text-foreground transition-colors group-hover:text-primary duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
