import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/layout/SectionTitle";

export const metadata: Metadata = {
  title: "Privacy Policy — StackPulse",
  description: "How StackPulse collects, uses, and protects your data.",
};

const sections = [
  {
    title: "What we collect",
    body: "When you create an account we store your name, email address, and — if you sign in with Google — the basic profile info Google shares with us (name, email, avatar). When you submit a tool or write a review, we store that content along with your account ID so ratings can be attributed to a real user rather than an anonymous one.",
  },
  {
    title: "How we use it",
    body: "Your account data lets you sign in, submit tools, bookmark listings, and leave reviews. Review and submission data is shown publicly on the site, since that's the point of the platform — a rating without an attributed reviewer isn't useful to anyone browsing the directory.",
  },
  {
    title: "Cookies & sessions",
    body: "We use a session cookie to keep you signed in and a short-lived JWT to authenticate API requests on your behalf. We don't use third-party advertising or tracking cookies.",
  },
  {
    title: "Third-party sign-in",
    body: "If you sign in with Google, authentication is handled by Google's OAuth flow. We only receive the profile fields needed to create your StackPulse account (name, email, avatar) — we never see your Google password.",
  },
  {
    title: "Data retention & deletion",
    body: "Your submissions and reviews remain visible while your account is active. If you'd like your account and associated data removed, contact us and we'll process the request.",
  },
  {
    title: "Contact",
    body: "Questions about this policy can be sent to hello@stackpulse.dev.",
  },
];

export default function PrivacyPage() {
  return (
    <Container className="py-10 md:py-16 max-w-3xl">
      <SectionTitle
        title="Privacy Policy"
        description="Last updated July 2026"
        align="left"
        className="mb-8"
      />
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="font-heading text-lg font-bold text-foreground mb-2">
              {section.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {section.body}
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
}
