import type { Metadata } from "next";
import Link from "next/link";

import { Footer, Navbar } from "@/components/shared";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "API Reference | ArcLMS",
  description: "ArcLMS REST API documentation for developers and integrators.",
};

const endpoints = [
  {
    category: "Authentication",
    items: [
      { method: "POST", path: "/auth/login", description: "Authenticate user" },
      { method: "POST", path: "/auth/refresh", description: "Refresh access token" },
      { method: "POST", path: "/auth/logout", description: "Invalidate session" },
    ],
  },
  {
    category: "Users",
    items: [
      { method: "GET", path: "/users", description: "List all users" },
      { method: "POST", path: "/users", description: "Create a new user" },
      { method: "GET", path: "/users/:id", description: "Get user details" },
      { method: "PATCH", path: "/users/:id", description: "Update user" },
    ],
  },
  {
    category: "Sessions",
    items: [
      { method: "GET", path: "/sessions", description: "List academic sessions" },
      { method: "POST", path: "/sessions", description: "Create a session" },
      { method: "GET", path: "/sessions/:id/terms", description: "Get session terms" },
    ],
  },
  {
    category: "Classes",
    items: [
      { method: "GET", path: "/classes", description: "List all classes" },
      { method: "POST", path: "/classes", description: "Create a class" },
      { method: "GET", path: "/classes/:id/students", description: "Get class students" },
    ],
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-green-500/10 text-green-600",
  POST: "bg-blue-500/10 text-blue-600",
  PATCH: "bg-amber-500/10 text-amber-600",
  DELETE: "bg-red-500/10 text-red-600",
};

const Page = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="border-b py-20">
          <div className="container mx-auto">
            <div className="mx-auto max-w-2xl text-center">
              <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
                API Reference
              </span>
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">ArcLMS REST API</h1>
              <p className="text-muted-foreground mb-8 text-lg">
                Integrate ArcLMS with your existing systems. Our RESTful API provides programmatic access to all
                platform features.
              </p>
              <div className="flex justify-center gap-4">
                <Button>Get API Key</Button>
                <Button variant="outline">View on Postman</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Base URL */}
        <section className="border-b py-8">
          <div className="container mx-auto">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <span className="text-sm font-medium">Base URL:</span>
              <code className="bg-muted rounded-lg px-4 py-2 text-sm">https://api.arclms.com/v1</code>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section className="py-20">
          <div className="container mx-auto">
            <div className="space-y-12">
              {endpoints.map((section, index) => (
                <div key={index}>
                  <h2 className="mb-4 text-xl font-bold">{section.category}</h2>
                  <div className="overflow-hidden rounded-xl border">
                    {section.items.map((endpoint, endpointIndex) => (
                      <div
                        key={endpointIndex}
                        className="hover:bg-muted/50 flex items-center gap-4 border-b p-4 last:border-b-0"
                      >
                        <span className={`rounded px-2 py-1 text-xs font-bold ${methodColors[endpoint.method]}`}>
                          {endpoint.method}
                        </span>
                        <code className="flex-1 text-sm">{endpoint.path}</code>
                        <span className="text-muted-foreground text-sm">{endpoint.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Help CTA */}
        <section className="bg-muted/30 border-t py-16">
          <div className="container mx-auto text-center">
            <h2 className="mb-4 text-2xl font-bold">Need Help Integrating?</h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-xl">
              Our developer support team can help you build your integration.
            </p>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Developer Support</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Page;
