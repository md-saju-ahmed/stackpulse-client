import Link from "next/link";
import Container from "@/components/layout/Container";
import { Mail, Zap } from "lucide-react";
import { FaGithub, FaXTwitter } from "react-icons/fa6";

const footerLinks = {
  product: [
    { href: "/products", label: "Explore tools" },
    { href: "/categories", label: "Categories" },
    { href: "/products/submit", label: "Submit a tool" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
  social: [
    {
      href: "https://github.com/stackpulse",
      icon: FaGithub,
      label: "GitHub",
      external: true,
    },
    {
      href: "https://twitter.com/stackpulse",
      icon: FaXTwitter,
      label: "Twitter",
      external: true,
    },
    {
      href: "mailto:hello@stackpulse.dev",
      icon: Mail,
      label: "Email",
      external: false,
    },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-100 bg-slate-50/50">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand block */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-lg hover:text-primary transition-colors duration-300"
            >
              <Zap className="size-5 text-primary" />
              <span>StackPulse</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              A directory of developer tools, ranked by the people who actually
              use them.
            </p>
            <a
              href="mailto:hello@stackpulse.dev"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <Mail className="size-4" />
              hello@stackpulse.dev
            </a>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground">Connect</h4>
            <div className="flex gap-2">
              {footerLinks.social.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target={social.external ? "_blank" : undefined}
                    rel={social.external ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center justify-center size-9 rounded-lg border border-slate-200 bg-white text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-premium-sm active:scale-[0.96] transition-all duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="size-4" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t border-slate-100 pt-8 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} StackPulse. Built for developers by developers.
          </p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
