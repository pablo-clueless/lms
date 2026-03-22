import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "For Administrators | ArcLMS",
  description: "Powerful administrative tools to manage your entire school efficiently.",
};

const features = [
  {
    title: "Academic Structure Management",
    description: "Configure Sessions, Terms, Classes, and Courses to match your school's academic calendar.",
  },
  {
    title: "User Management",
    description: "Invite and manage administrators, tutors, and students with role-based permissions.",
  },
  {
    title: "Timetable Generation",
    description: "Auto-generate conflict-free timetables for all classes with manual override options.",
  },
  {
    title: "Billing & Invoicing",
    description: "Track student enrollment, view invoices, and manage payments through the admin dashboard.",
  },
  {
    title: "School-Wide Reports",
    description: "Generate comprehensive reports on attendance, performance, and academic progress.",
  },
  {
    title: "Communication Tools",
    description: "Send targeted communications to specific classes, tutors, or the entire school.",
  },
];

const Page = () => {
  return (
    <main>
      <section className="py-20 lg:py-32">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
              For Administrators
            </span>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">Manage Your School Efficiently</h1>
            <p className="text-muted-foreground mb-8 text-lg">
              ArcLMS gives school administrators powerful tools to manage academic operations, staff, students, and
              finances — all in one place.
            </p>
            <Button size="lg" asChild>
              <Link href="/signin">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="bg-muted/30 border-y py-20">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center text-2xl font-bold">Administrative Features</h2>
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
          <h2 className="mb-4 text-2xl font-bold">Ready to Streamline Your Operations?</h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-xl">
            See how ArcLMS can save your administrative team hours every week.
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
