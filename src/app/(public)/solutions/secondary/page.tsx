import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Secondary Schools | ArcLMS",
  description: "ArcLMS features designed specifically for Nigerian secondary schools.",
};

const features = [
  {
    title: "Comprehensive Subject Management",
    description: "Support for all JSS and SS subjects with proper course structuring and prerequisite management.",
  },
  {
    title: "WAEC/NECO Preparation",
    description: "Built-in exam preparation modules with past question banks and timed practice sessions.",
  },
  {
    title: "Advanced Grading System",
    description: "Continuous Assessment (CA) and Examination weighting as per Nigerian educational standards.",
  },
  {
    title: "Subject Combinations",
    description: "Manage science, arts, and commercial subject combinations for SS students.",
  },
  {
    title: "Virtual Laboratories",
    description: "Interactive simulations for science subjects when physical labs are not available.",
  },
  {
    title: "Career Guidance",
    description: "Help students explore career paths based on their subjects and performance.",
  },
];

const Page = () => {
  return (
    <main className="bg-background">
      <section className="py-20 lg:py-32">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
              Secondary Schools
            </span>
            <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Prepare Students for Success
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              ArcLMS provides comprehensive tools for JSS1-SS3 students, supporting everything from daily learning to
              WAEC/NECO examination preparation.
            </p>
            <Button size="lg" asChild>
              <Link href="/signin">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="bg-muted/30 border-y py-20">
        <div className="container mx-auto">
          <h2 className="text-foreground mb-12 text-center text-2xl font-bold">Features for Secondary Schools</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="bg-card rounded-xl border p-6">
                <h3 className="text-foreground mb-2 font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-foreground mb-4 text-2xl font-bold">Elevate Your Secondary School</h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-xl">
            Join leading Nigerian secondary schools using ArcLMS to improve student outcomes.
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
