import { Location01Icon, Clock01Icon, Briefcase01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Careers | ArcLMS",
  description: "Join our team and help transform education in Nigerian schools.",
};

const openings = [
  {
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Lagos, Nigeria (Hybrid)",
    type: "Full-time",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote (Nigeria)",
    type: "Full-time",
  },
  {
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Lagos, Nigeria",
    type: "Full-time",
  },
  {
    title: "Technical Support Specialist",
    department: "Support",
    location: "Remote (Nigeria)",
    type: "Full-time",
  },
];

const benefits = [
  "Competitive salary and equity",
  "Health insurance coverage",
  "Flexible work arrangements",
  "Learning and development budget",
  "Annual leave and public holidays",
  "Team retreats and events",
];

const Page = () => {
  return (
    <main>
      <section className="py-20 lg:py-32">
        <div className="container mx-auto text-center">
          <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
            Careers
          </span>
          <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Help Us Transform Education
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
            Join a passionate team building the future of education technology for Nigerian schools. We&apos;re always
            looking for talented individuals who share our mission.
          </p>
        </div>
      </section>
      <section className="bg-muted/30 border-y py-20">
        <div className="container mx-auto">
          <h2 className="mb-8 text-2xl font-bold">Open Positions</h2>
          <div className="space-y-4">
            {openings.map((job, index) => (
              <div
                key={index}
                className="bg-card flex flex-col gap-4 rounded-xl border p-6 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="text-muted-foreground text-sm">{job.department}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-muted-foreground flex items-center gap-1 text-sm">
                    <HugeiconsIcon icon={Location01Icon} className="size-4" />
                    {job.location}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1 text-sm">
                    <HugeiconsIcon icon={Clock01Icon} className="size-4" />
                    {job.type}
                  </span>
                  <Button size="sm">Apply Now</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold">Why Join ArcLMS?</h2>
              <p className="text-muted-foreground mb-6">
                We&apos;re building something meaningful — a platform that directly impacts the education of thousands
                of Nigerian students. When you join us, you&apos;re not just taking a job; you&apos;re joining a
                mission.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-muted/50 flex items-center justify-center rounded-2xl p-12">
              <div className="text-center">
                <HugeiconsIcon icon={Briefcase01Icon} className="text-primary mx-auto mb-4 size-16" />
                <h3 className="mb-2 text-xl font-semibold">Don&apos;t see your role?</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Send us your CV and we&apos;ll reach out when a suitable position opens up.
                </p>
                <Button variant="outline" asChild>
                  <Link href="mailto:careers@arclms.com">Send Your CV</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
