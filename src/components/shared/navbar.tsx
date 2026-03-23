"use client";

import { Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, useEffect } from "react";
import Link from "next/link";

import { Button } from "../ui/button";
import { cn } from "@/lib";

const navLinks = [
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Solutions", href: "/solutions" },
  { name: "Resources", href: "/#resources" },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={cn("sticky top-0 z-50 transition-all duration-300", scrolled ? "px-4 pt-3 sm:px-6" : "")}
      initial={false}
    >
      <motion.div
        className={cn(
          "border-border/40 bg-background/80 backdrop-blur-lg transition-all duration-300",
          scrolled ? "container mx-auto rounded-full border px-4 shadow-lg" : "border-b",
        )}
      >
        <div className={cn("container mx-auto", scrolled && "px-2")}>
          <div className={cn("flex items-center justify-between", scrolled ? "h-12" : "h-16")}>
            <Link href="/" className="">
              <h4 className="text-foreground text-xl font-bold">ArcLMS</h4>
            </Link>
            <div className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg border md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <HugeiconsIcon icon={isMobileMenuOpen ? Cancel01Icon : Menu01Icon} className="size-5" />
            </button>
          </div>
        </div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden md:hidden"
            >
              <div className={cn("space-y-1 py-4", scrolled ? "px-4" : "border-t")}>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "block rounded-lg px-4 py-2.5 text-sm font-medium",
                      "text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-2 px-4 pt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.nav>
  );
};
