import { School01Icon, Building02Icon, ManagerIcon, TeacherIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Solutions | ArcLMS",
  description: "ArcLMS solutions for primary schools, secondary schools, administrators, and tutors.",
};

const solutions = [
  {
    icon: School01Icon,
    title: "Primary Schools",
    description:
      "Age-appropriate tools designed for Primary 1-6 students with simplified interfaces and engaging content delivery.",
    href: "/solutions/primary",
    features: [
      "Simple, colorful student interface",
      "Parent progress reports",
      "Age-appropriate assessments",
      "Visual timetables",
    ],
  },
  {
    icon: Building02Icon,
    title: "Secondary Schools",
    description:
      "Comprehensive features for JSS1-SS3 students with advanced assessments and WAEC/NECO preparation tools.",
    href: "/solutions/secondary",
    features: ["Exam preparation modules", "Advanced grading system", "Subject combinations", "Career guidance tools"],
  },
  {
    icon: ManagerIcon,
    title: "Administrators",
    description: "Powerful administrative tools to manage your entire school from academic structure to billing.",
    href: "/solutions/administrators",
    features: ["Session & term management", "Staff management", "Billing & invoicing", "School-wide reports"],
  },
  {
    icon: TeacherIcon,
    title: "Tutors",
    description: "Everything tutors need to create engaging content, assess students, and track progress.",
    href: "/solutions/tutors",
    features: ["Course content creation", "Quiz & exam builder", "Grading tools", "Student analytics"],
  },
];

const Page = () => {
  return (
    <main>
      <section className="py-20 lg:py-32">
        <div className="container mx-auto text-center">
          <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
            Solutions
          </span>
          <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Solutions for Every Role
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
            ArcLMS is designed to serve the unique needs of primary schools, secondary schools, administrators, and
            tutors.
          </p>
        </div>
      </section>
      <section className="bg-muted/30 border-y py-20">
        <div className="container mx-auto">
          <div className="grid gap-8 lg:grid-cols-2">
            {solutions.map((solution, index) => (
              <div key={index} className="bg-card rounded-2xl border p-8">
                <div className="bg-primary text-primary-foreground mb-4 flex h-14 w-14 items-center justify-center rounded-xl">
                  <HugeiconsIcon icon={solution.icon} className="size-7" />
                </div>
                <h2 className="mb-2 text-2xl font-bold">{solution.title}</h2>
                <p className="text-muted-foreground mb-6">{solution.description}</p>
                <ul className="mb-6 space-y-2">
                  {solution.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm">
                      <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" asChild>
                  <Link href={solution.href}>Learn More</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="mb-4 text-2xl font-bold">Ready to Get Started?</h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-xl">
            Start your free trial today and see how ArcLMS can transform your school.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">Start Free Trial</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Page;
