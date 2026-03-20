import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import {
  Mail01Icon,
  SmartPhone01Icon,
  Location01Icon,
  NewTwitterIcon,
  Facebook01Icon,
  Linkedin01Icon,
  InstagramIcon,
} from "@hugeicons/core-free-icons";

const footerLinks = {
  product: [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Security", href: "/#security" },
    { name: "Integrations", href: "/#integrations" },
  ],
  solutions: [
    { name: "Primary Schools", href: "/solutions/primary" },
    { name: "Secondary Schools", href: "/solutions/secondary" },
    { name: "School Administrators", href: "/solutions/administrators" },
    { name: "Tutors", href: "/solutions/tutors" },
  ],
  resources: [
    { name: "Help Center", href: "/help" },
    { name: "Documentation", href: "/docs" },
    { name: "API Reference", href: "/api-docs" },
    { name: "Blog", href: "/blog" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Careers", href: "/careers" },
    { name: "Partners", href: "/partners" },
  ],
};

const socialLinks = [
  { name: "Twitter", href: "https://twitter.com/arclms", icon: NewTwitterIcon },
  { name: "Facebook", href: "https://facebook.com/arclms", icon: Facebook01Icon },
  { name: "LinkedIn", href: "https://linkedin.com/company/arclms", icon: Linkedin01Icon },
  { name: "Instagram", href: "https://instagram.com/arclms", icon: InstagramIcon },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <h2 className="text-4xl font-bold">ArcLMS</h2>
            </Link>
            <p className="text-muted-foreground mt-4 max-w-xs text-sm">
              The complete learning management system built specifically for Nigerian primary and secondary schools.
            </p>
            <div className="mt-6 space-y-3">
              <a
                href="mailto:hello@arclms.com"
                className="text-muted-foreground hover:text-background flex items-center gap-2 text-sm transition-colors"
              >
                <HugeiconsIcon icon={Mail01Icon} className="size-4" />
                hello@arclms.com
              </a>
              <a
                href="tel:+2348001234567"
                className="text-muted-foreground hover:text-background flex items-center gap-2 text-sm transition-colors"
              >
                <HugeiconsIcon icon={SmartPhone01Icon} className="size-4" />
                +234 800 123 4567
              </a>
              <p className="text-muted-foreground flex items-start gap-2 text-sm">
                <HugeiconsIcon icon={Location01Icon} className="mt-0.5 size-4 shrink-0" />
                Lagos, Nigeria
              </p>
            </div>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-background text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Solutions</h3>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-background text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-background text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-background text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-muted-foreground/20 my-8 h-px" />
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-muted-foreground text-sm">&copy; {currentYear} ArcLMS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms-of-service"
              className="text-muted-foreground hover:text-background text-sm transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy-policy"
              className="text-muted-foreground hover:text-background text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-background text-sm transition-colors">
              Cookies
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-background transition-colors"
                aria-label={social.name}
              >
                <HugeiconsIcon icon={social.icon} className="size-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
