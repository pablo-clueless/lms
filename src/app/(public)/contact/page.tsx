"use client";

import { Mail01Icon, SmartPhone01Icon, Location01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Footer, Navbar } from "@/components/shared";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const contactInfo = [
  {
    icon: Mail01Icon,
    title: "Email",
    value: "hello@arclms.com",
    href: "mailto:hello@arclms.com",
  },
  {
    icon: SmartPhone01Icon,
    title: "Phone",
    value: "+234 800 123 4567",
    href: "tel:+2348001234567",
  },
  {
    icon: Location01Icon,
    title: "Office",
    value: "Lagos, Nigeria",
    href: null,
  },
];

const Page = () => {
  return (
    <>
      <Navbar />
      <main>
        <section className="py-20 lg:py-32">
          <div className="container mx-auto">
            <div className="mx-auto max-w-2xl text-center">
              <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
                Contact Us
              </span>
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">Get in Touch</h1>
              <p className="text-muted-foreground text-lg">
                Have questions about ArcLMS? We&apos;d love to hear from you. Send us a message and we&apos;ll respond
                as soon as possible.
              </p>
            </div>

            <div className="mt-16 grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <div className="bg-card rounded-2xl border p-8">
                <h2 className="mb-6 text-xl font-semibold">Send us a message</h2>
                <form className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">First Name</label>
                      <Input placeholder="John" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Last Name</label>
                      <Input placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Email</label>
                    <Input type="email" placeholder="john@school.edu.ng" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">School Name</label>
                    <Input placeholder="Your school name" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Message</label>
                    <Textarea placeholder="How can we help you?" rows={5} />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="mb-6 text-xl font-semibold">Contact Information</h2>
                  <div className="space-y-4">
                    {contactInfo.map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                          <HugeiconsIcon icon={item.icon} className="text-primary size-5" />
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">{item.title}</p>
                          {item.href ? (
                            <a href={item.href} className="hover:text-primary font-medium transition-colors">
                              {item.value}
                            </a>
                          ) : (
                            <p className="font-medium">{item.value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/30 rounded-xl border p-6">
                  <h3 className="mb-2 font-semibold">Need immediate help?</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Our support team is available Monday to Friday, 8am to 6pm WAT.
                  </p>
                  <Button variant="outline" className="w-full">
                    Schedule a Demo
                  </Button>
                </div>

                <div className="bg-muted/30 rounded-xl border p-6">
                  <h3 className="mb-2 font-semibold">For existing customers</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Access our help center for guides, FAQs, and support resources.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/help">Visit Help Center</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Page;
