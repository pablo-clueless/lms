import type { Metadata } from "next";
import Link from "next/link";

import { Footer, Navbar } from "@/components/shared";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "For Tutors | ArcLMS",
  description: "Everything tutors need to create content, assess students, and track progress.",
};

const features = [
  {
    title: "Course Content Management",
    description: "Upload materials, organize modules, and create structured learning paths for your students.",
  },
  {
    title: "Quiz & Exam Builder",
    description: "Create assessments with multiple question types, auto-grading, and detailed analytics.",
  },
  {
    title: "Assignment Management",
    description: "Assign work, collect submissions, and provide feedback all within the platform.",
  },
  {
    title: "Virtual Meetings",
    description: "Schedule and conduct online classes with integrated video conferencing.",
  },
  {
    title: "Student Progress Tracking",
    description: "Monitor individual and class performance with detailed analytics and insights.",
  },
  {
    title: "Attendance Management",
    description: "Mark attendance for each period and track student presence over time.",
  },
];

const Page = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto">
            <div className="mx-auto max-w-3xl text-center">
              <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
                For Tutors
              </span>
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">Focus on Teaching, Not Admin</h1>
              <p className="text-muted-foreground mb-8 text-lg">
                ArcLMS provides tutors with intuitive tools to create content, assess students, and track progress — so
                you can focus on what matters most: teaching.
              </p>
              <Button size="lg" asChild>
                <Link href="/signin">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-muted/30 border-y py-20">
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-2xl font-bold">Tutor Features</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="bg-card rounded-xl border p-6">
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto text-center">
            <h2 className="mb-4 text-2xl font-bold">Ready to Enhance Your Teaching?</h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-xl">
              Join thousands of tutors using ArcLMS to deliver better learning experiences.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signin">Start Free Trial</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Page;
