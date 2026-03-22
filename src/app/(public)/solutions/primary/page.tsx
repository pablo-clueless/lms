import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Primary Schools | ArcLMS",
  description: "ArcLMS features designed specifically for Nigerian primary schools.",
};

const features = [
  {
    title: "Simple Student Interface",
    description: "Colorful, intuitive design that makes learning fun for young students from Primary 1 to Primary 6.",
  },
  {
    title: "Parent Portal",
    description: "Keep parents informed with easy-to-understand progress reports and direct communication channels.",
  },
  {
    title: "Visual Timetables",
    description: "Picture-based timetables help younger students understand their daily schedule.",
  },
  {
    title: "Age-Appropriate Assessments",
    description: "Quiz formats designed for primary school students with images, matching, and simple multiple choice.",
  },
  {
    title: "Attendance Tracking",
    description: "Simple daily attendance marking with automatic parent notifications for absences.",
  },
  {
    title: "Report Cards",
    description: "Auto-generated termly report cards with grades, comments, and improvement suggestions.",
  },
];

const Page = () => {
  return (
    <main>
      <section className="py-20 lg:py-32">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
              Primary Schools
            </span>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">Built for Young Learners</h1>
            <p className="text-muted-foreground mb-8 text-lg">
              ArcLMS provides age-appropriate tools that make learning engaging for Primary 1-6 students while giving
              teachers and parents full visibility into progress.
            </p>
            <Button size="lg" asChild>
              <Link href="/signin">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="bg-muted/30 border-y py-20">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center text-2xl font-bold">Features for Primary Schools</h2>
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
      <section className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="mb-4 text-2xl font-bold">Transform Your Primary School</h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-xl">
            Join hundreds of Nigerian primary schools already using ArcLMS.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Schedule Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
