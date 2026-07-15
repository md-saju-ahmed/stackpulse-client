"use client";
import { useState } from "react";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/layout/SectionTitle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SUPPORT_EMAIL = "hello@stackpulse.dev";

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
  },
  {
    icon: MessageCircle,
    label: "Response time",
    value: "Usually within 1–2 business days",
    href: undefined,
  },
  {
    icon: MapPin,
    label: "Based in",
    value: "Remote-first team",
    href: undefined,
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Message from ${name || "the StackPulse site"}`,
    );
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <Container className="py-10 md:py-16">
      <SectionTitle
        title="Contact us"
        description="Questions, feedback, or a tool you think we should list? Reach out."
        align="center"
      />

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-5">
        <div className="md:col-span-2 flex flex-col gap-4">
          {channels.map((channel) => {
            const Icon = channel.icon;
            const content = (
              <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-card/40 p-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    {channel.label}
                  </p>
                  <p className="text-sm font-medium text-foreground truncate">
                    {channel.value}
                  </p>
                </div>
              </div>
            );

            return channel.href ? (
              <a key={channel.label} href={channel.href}>
                {content}
              </a>
            ) : (
              <div key={channel.label}>{content}</div>
            );
          })}
        </div>

        <form
          onSubmit={handleSubmit}
          className="md:col-span-3 flex flex-col gap-4 rounded-xl border border-border/50 bg-card/40 p-6"
        >
          <div>
            <label
              htmlFor="contact-name"
              className="block text-sm font-medium mb-1.5"
            >
              Name
            </label>
            <Input
              id="contact-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="h-11"
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="block text-sm font-medium mb-1.5"
            >
              Email
            </label>
            <Input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="h-11"
            />
          </div>
          <div>
            <label
              htmlFor="contact-message"
              className="block text-sm font-medium mb-1.5"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help?"
              required
              rows={5}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <Button type="submit" className="h-11 self-start px-6">
            Send message
          </Button>
        </form>
      </div>
    </Container>
  );
}
