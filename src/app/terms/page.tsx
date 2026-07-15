import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/layout/SectionTitle";

export const metadata: Metadata = {
  title: "Terms of Service — StackPulse",
  description: "The rules for submitting tools and reviews on StackPulse.",
};

const sections = [
  {
    title: "Your account",
    body: "You need an account to submit a tool or leave a review. You're responsible for keeping your login credentials secure and for the content posted from your account.",
  },
  {
    title: "Submitting a tool",
    body: "Submissions should be tools you have direct knowledge of. Submissions go into a review queue before appearing publicly; we may reject a submission that's a duplicate, is misleading, or doesn't meet our content guidelines. We reserve the right to remove a listing at any time.",
  },
  {
    title: "Writing a review",
    body: "Reviews should reflect genuine, first-hand experience with the tool. One review per product per account. Reviews that are spam, off-topic, or written to manipulate a product's ranking (including reviews traded for compensation) may be removed.",
  },
  {
    title: "Content ownership",
    body: "You retain ownership of the reviews and submissions you write. By posting them, you grant StackPulse a license to display that content on the site as part of the product listing.",
  },
  {
    title: "Acceptable use",
    body: "Don't use StackPulse to scrape data at scale, attempt to compromise account security, or post content that's unlawful, harassing, or infringes someone else's rights.",
  },
  {
    title: "Changes to these terms",
    body: "We may update these terms as the product evolves. Continued use of StackPulse after a change means you accept the updated terms.",
  },
  {
    title: "Contact",
    body: "Questions about these terms can be sent to hello@stackpulse.dev.",
  },
];

export default function TermsPage() {
  return (
    <Container className="py-10 md:py-16 max-w-3xl">
      <SectionTitle
        title="Terms of Service"
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
