import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Book02Icon,
  Settings02Icon,
  UserMultiple02Icon,
  QuestionIcon,
  ComputerVideoIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Help Center | ArcLMS",
  description: "Find answers to your questions and learn how to use ArcLMS effectively.",
};

const categories = [
  {
    icon: Book02Icon,
    title: "Getting Started",
    description: "Learn the basics of setting up and using ArcLMS",
    articles: 12,
  },
  {
    icon: UserMultiple02Icon,
    title: "User Management",
    description: "Managing students, tutors, and administrators",
    articles: 8,
  },
  {
    icon: Settings02Icon,
    title: "Configuration",
    description: "Sessions, terms, classes, and school settings",
    articles: 15,
  },
  {
    icon: QuestionIcon,
    title: "Assessments",
    description: "Creating quizzes, assignments, and examinations",
    articles: 10,
  },
  {
    icon: ComputerVideoIcon,
    title: "Virtual Meetings",
    description: "Scheduling and conducting online classes",
    articles: 6,
  },
  {
    icon: Mail01Icon,
    title: "Communications",
    description: "Sending notifications and messages",
    articles: 5,
  },
];

const popularArticles = [
  "How to create a new academic session",
  "Adding students to a class",
  "Setting up the timetable",
  "Creating your first quiz",
  "Understanding the billing system",
];

const Page = () => {
  return (
    <main className="bg-background">
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl">Help Center</h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
            Find answers, guides, and resources to help you get the most out of ArcLMS.
          </p>
          <div className="mx-auto max-w-xl">
            <Input type="search" placeholder="Search for help articles..." className="h-12 text-base" />
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto">
          <h2 className="text-foreground mb-8 text-2xl font-bold">Browse by Category</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <Link
                key={index}
                href="#"
                className="group bg-card hover:border-primary/50 rounded-xl border p-6 transition-all hover:shadow-md"
              >
                <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-colors">
                  <HugeiconsIcon icon={category.icon} className="size-6" />
                </div>
                <h3 className="text-foreground mb-1 font-semibold">{category.title}</h3>
                <p className="text-muted-foreground mb-2 text-sm">{category.description}</p>
                <span className="text-primary text-xs">{category.articles} articles</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-muted/30 border-y py-20">
        <div className="container mx-auto">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-foreground mb-6 text-2xl font-bold">Popular Articles</h2>
              <ul className="space-y-3">
                {popularArticles.map((article, index) => (
                  <li key={index}>
                    <Link
                      href="#"
                      className="bg-card hover:border-primary/50 block rounded-lg border p-4 transition-colors"
                    >
                      {article}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card flex flex-col justify-center rounded-2xl p-8 text-center">
              <h3 className="text-foreground mb-2 text-xl font-semibold">Can&apos;t find what you need?</h3>
              <p className="text-muted-foreground mb-6">Our support team is here to help you with any questions.</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline">Schedule a Call</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
