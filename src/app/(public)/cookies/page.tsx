import type { Metadata } from "next";

import { Footer, Navbar } from "@/components/shared";

export const metadata: Metadata = {
  title: "Cookie Policy | ArcLMS",
  description: "Learn about how ArcLMS uses cookies and similar technologies.",
};

const Page = () => {
  return (
    <>
      <Navbar />
      <main className="py-20">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-8 text-4xl font-bold">Cookie Policy</h1>
            <p className="text-muted-foreground mb-6">Last updated: March 2026</p>

            <div className="prose prose-neutral max-w-none space-y-8">
              <section>
                <h2 className="mb-4 text-2xl font-semibold">What Are Cookies</h2>
                <p className="text-muted-foreground">
                  Cookies are small text files that are placed on your computer or mobile device when you visit a
                  website. They are widely used to make websites work more efficiently and provide information to the
                  website owners.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold">How We Use Cookies</h2>
                <p className="text-muted-foreground mb-4">ArcLMS uses cookies for the following purposes:</p>
                <ul className="text-muted-foreground list-disc space-y-2 pl-6">
                  <li>
                    <strong>Essential Cookies:</strong> Required for the platform to function properly, including
                    authentication and session management.
                  </li>
                  <li>
                    <strong>Performance Cookies:</strong> Help us understand how visitors interact with our platform by
                    collecting anonymous information.
                  </li>
                  <li>
                    <strong>Functionality Cookies:</strong> Remember your preferences and settings to provide a
                    personalized experience.
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> Allow us to measure and improve the performance of our platform.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold">Types of Cookies We Use</h2>
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Cookie Type</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Purpose</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="px-4 py-3 text-sm">Session Cookie</td>
                        <td className="text-muted-foreground px-4 py-3 text-sm">Maintains your login session</td>
                        <td className="text-muted-foreground px-4 py-3 text-sm">Session</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">Preference Cookie</td>
                        <td className="text-muted-foreground px-4 py-3 text-sm">
                          Stores your theme and language preferences
                        </td>
                        <td className="text-muted-foreground px-4 py-3 text-sm">1 year</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">Analytics Cookie</td>
                        <td className="text-muted-foreground px-4 py-3 text-sm">Helps us understand platform usage</td>
                        <td className="text-muted-foreground px-4 py-3 text-sm">2 years</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold">Managing Cookies</h2>
                <p className="text-muted-foreground">
                  You can control and manage cookies in your browser settings. Please note that removing or blocking
                  cookies may impact your user experience and some features may no longer be available.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold">Third-Party Cookies</h2>
                <p className="text-muted-foreground">
                  Some of our pages may contain content from third-party services (such as video players or social media
                  widgets) that may set their own cookies. We do not control these cookies and recommend reviewing the
                  privacy policies of these third-party services.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have questions about our use of cookies, please contact us at{" "}
                  <a href="mailto:privacy@arclms.com" className="text-primary hover:underline">
                    privacy@arclms.com
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Page;
