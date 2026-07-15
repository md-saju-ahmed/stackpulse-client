import type { Metadata } from "next";
import Link from "next/link";
import { Search, ShieldCheck, Users } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/layout/SectionTitle";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About — StackPulse",
  description:
    "Why StackPulse exists and how it helps developers choose the right tools.",
};

const values = [
  {
    icon: Search,
    title: "Comparison over hype",
    description:
      "Marketing pages tell you a tool is great. We'd rather show you real ratings, review counts, and how a tool stacks up against its closest alternatives before you commit engineering time to it.",
  },
  {
    icon: Users,
    title: "Built from real usage",
    description:
      "Every listing on StackPulse is submitted and reviewed by developers who actually shipped with the tool — not vendor copy. Ratings come from people who used the product, not from us.",
  },
  {
    icon: ShieldCheck,
    title: "Moderated, not gamed",
    description:
      "New submissions go through a review queue before they go live, and every review is tied to an account, so the leaderboard reflects genuine community sentiment rather than the loudest marketing budget.",
  },
];

export default function AboutPage() {
  return (
    <Container className="py-10 md:py-16 space-y-16">
      <SectionTitle
        title="About StackPulse"
        description="A directory of developer tools, ranked by the people who use them."
        align="center"
      />

      <div className="mx-auto max-w-3xl space-y-4 text-muted-foreground leading-relaxed">
        <p>
          Choosing between two frameworks, two hosting providers, or two
          observability platforms usually means reading a dozen scattered blog
          posts, half of which are sponsored. StackPulse started as an internal
          spreadsheet a small team kept to track which tools were actually worth
          adopting — this site is that spreadsheet, opened up to the wider
          developer community.
        </p>
        <p>
          Anyone can submit a tool, and anyone with an account can leave a
          rating and a written review. Submissions are checked before they go
          live, and every review is attributed to a real account, so the numbers
          you see reflect people who&apos;ve actually used the product, not
          anonymous noise.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {values.map((value) => {
          const Icon = value.icon;
          return (
            <div
              key={value.title}
              className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card/40 p-6"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-foreground">
                {value.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-4 rounded-xl border border-border/50 bg-card/40 p-10 text-center">
        <h3 className="font-heading text-xl font-bold text-foreground">
          Have a tool worth listing?
        </h3>
        <p className="max-w-md text-sm text-muted-foreground">
          Submit it in a couple of minutes — it&apos;ll go live once it&apos;s
          reviewed.
        </p>
        <Link href="/products/submit">
          <Button className="h-11 px-6">Submit a tool</Button>
        </Link>
      </div>
    </Container>
  );
}
