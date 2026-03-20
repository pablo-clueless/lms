import type { Metadata } from "next";
import Link from "next/link";

import { Footer, Navbar } from "@/components/shared";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Partners | ArcLMS",
  description: "Partner with ArcLMS to bring quality education technology to Nigerian schools.",
};

const partnerTypes = [
  {
    title: "School Associations",
    description: "Partner with us to bring ArcLMS to member schools with special group pricing and dedicated support.",
  },
  {
    title: "Technology Partners",
    description: "Integrate your education tools with ArcLMS to reach thousands of Nigerian schools.",
  },
  {
    title: "Resellers",
    description: "Become an authorized ArcLMS reseller and earn commissions while helping schools modernize.",
  },
  {
    title: "Implementation Partners",
    description: "Help schools deploy and customize ArcLMS with training and ongoing support services.",
  },
];

const Page = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto text-center">
            <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
              Partners
            </span>
            <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Partner With Us</h1>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
              Join our partner ecosystem and help bring quality education technology to Nigerian schools. We offer
              various partnership models to suit your business.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">Become a Partner</Link>
            </Button>
          </div>
        </section>

        {/* Partner Types */}
        <section className="bg-muted/30 border-y py-20">
          <div className="container mx-auto">
            <h2 className="mb-12 text-center text-2xl font-bold">Partnership Opportunities</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {partnerTypes.map((type, index) => (
                <div key={index} className="bg-card rounded-xl border p-6">
                  <h3 className="mb-2 text-lg font-semibold">{type.title}</h3>
                  <p className="text-muted-foreground text-sm">{type.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20">
          <div className="container mx-auto">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-2xl font-bold">Partner Benefits</h2>
              <p className="text-muted-foreground mb-12">
                Our partners enjoy exclusive benefits designed to help you succeed.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Competitive commission structure",
                "Dedicated partner support",
                "Marketing materials and resources",
                "Partner portal access",
                "Training and certification",
                "Co-marketing opportunities",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg border p-4">
                  <div className="bg-primary h-2 w-2 rounded-full" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto text-center">
            <h2 className="mb-4 text-2xl font-bold">Ready to Partner?</h2>
            <p className="mx-auto mb-8 max-w-xl opacity-90">
              Contact our partnerships team to discuss how we can work together.
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/contact">Contact Partnerships</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Page;
