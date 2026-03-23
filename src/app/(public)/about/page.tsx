import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us | ArcLMS",
  description: "Learn about ArcLMS and our mission to transform education in Nigerian schools.",
};

const stats = [
  { value: "500+", label: "Schools" },
  { value: "100K+", label: "Students" },
  { value: "5K+", label: "Tutors" },
  { value: "99.9%", label: "Uptime" },
];

const values = [
  {
    title: "Education First",
    description:
      "We believe every Nigerian child deserves access to quality education. Our platform is designed to make learning accessible and engaging.",
  },
  {
    title: "Simplicity",
    description:
      "Complex technology should feel simple. We build intuitive tools that schools can adopt without extensive training.",
  },
  {
    title: "Reliability",
    description:
      "Schools depend on us daily. We maintain 99.9% uptime and respond to issues within minutes, not hours.",
  },
  {
    title: "Local Focus",
    description:
      "Built specifically for Nigerian schools, understanding the unique challenges and requirements of our education system.",
  },
];

const Page = () => {
  return (
    <main className="bg-background">
      <section className="py-20 lg:py-32">
        <div className="container mx-auto text-center">
          <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
            About Us
          </span>
          <h1 className="text-foreground mx-auto mb-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Transforming Education in Nigerian Schools
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
            ArcLMS was founded with a simple mission: to provide Nigerian primary and secondary schools with world-class
            learning management tools that are affordable, reliable, and easy to use.
          </p>
        </div>
      </section>
      <section className="border-border bg-muted/30 border-y py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <h3 className="text-primary text-3xl font-bold lg:text-4xl">{stat.value}</h3>
                <p className="text-muted-foreground mt-1 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-foreground mb-6 text-3xl font-bold">Our Story</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                ArcLMS started in 2023 when our founders, experienced educators and technologists, noticed a gap in the
                Nigerian education technology landscape. While global LMS platforms existed, none were tailored to the
                specific needs of Nigerian schools — from the academic calendar structure to local payment methods.
              </p>
              <p>
                We built ArcLMS from the ground up to serve Nigerian primary and secondary schools. Our platform
                understands Sessions and Terms, supports Nigerian class structures from Primary 1 to SS3, and integrates
                with local payment providers like Paystack.
              </p>
              <p>
                Today, we serve hundreds of schools across Nigeria, helping them manage their academic operations
                efficiently while providing students with a modern learning experience.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto">
          <h2 className="text-foreground mb-12 text-center text-3xl font-bold">Our Values</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div key={index} className="bg-card rounded-xl border p-6">
                <h3 className="text-foreground mb-2 text-lg font-semibold">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold">Ready to Transform Your School?</h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-xl">
            Join hundreds of Nigerian schools already using ArcLMS.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signin">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
