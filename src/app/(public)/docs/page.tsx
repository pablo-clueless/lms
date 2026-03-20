import type { Metadata } from "next";
import Link from "next/link";

import { Footer, Navbar } from "@/components/shared";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Documentation | ArcLMS",
  description: "Comprehensive documentation for ArcLMS administrators and developers.",
};

const sections = [
  {
    title: "Quick Start",
    items: [
      { name: "Introduction", href: "#" },
      { name: "Creating Your School Account", href: "#" },
      { name: "Initial Configuration", href: "#" },
      { name: "Adding Your First Users", href: "#" },
    ],
  },
  {
    title: "Academic Structure",
    items: [
      { name: "Sessions & Terms", href: "#" },
      { name: "Classes & Courses", href: "#" },
      { name: "Timetable Management", href: "#" },
      { name: "Enrollment Management", href: "#" },
    ],
  },
  {
    title: "Assessments",
    items: [
      { name: "Creating Quizzes", href: "#" },
      { name: "Assignment Management", href: "#" },
      { name: "Examinations", href: "#" },
      { name: "Grading & Feedback", href: "#" },
    ],
  },
  {
    title: "Administration",
    items: [
      { name: "User Roles & Permissions", href: "#" },
      { name: "School Settings", href: "#" },
      { name: "Billing & Subscriptions", href: "#" },
      { name: "Reports & Analytics", href: "#" },
    ],
  },
];

const Page = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="border-b py-20">
          <div className="container mx-auto">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">Documentation</h1>
              <p className="text-muted-foreground text-lg">
                Everything you need to know about configuring and using ArcLMS for your school.
              </p>
            </div>
          </div>
        </section>

        {/* Documentation Sections */}
        <section className="py-20">
          <div className="container mx-auto">
            <div className="grid gap-12 lg:grid-cols-2">
              {sections.map((section, index) => (
                <div key={index}>
                  <h2 className="mb-4 text-xl font-bold">{section.title}</h2>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <Link
                          href={item.href}
                          className="hover:border-primary/50 hover:bg-muted/50 block rounded-lg border p-4 transition-colors"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* API Reference CTA */}
        <section className="bg-muted/30 border-t py-16">
          <div className="container mx-auto text-center">
            <h2 className="mb-4 text-2xl font-bold">Looking for API Documentation?</h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-xl">
              Integrate ArcLMS with your existing systems using our comprehensive API.
            </p>
            <Button asChild>
              <Link href="/api-docs">View API Reference</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Page;
