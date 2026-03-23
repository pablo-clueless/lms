import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | ArcLMS",
  description: "Insights, updates, and best practices for Nigerian schools.",
};

const posts = [
  {
    title: "5 Ways to Improve Student Engagement in Online Classes",
    excerpt: "Discover proven strategies to keep your students engaged and motivated during virtual learning sessions.",
    date: "March 15, 2026",
    category: "Teaching Tips",
    readTime: "5 min read",
  },
  {
    title: "Understanding the New Academic Session Feature",
    excerpt: "A deep dive into our improved academic session management tools and how to make the most of them.",
    date: "March 10, 2026",
    category: "Product Updates",
    readTime: "3 min read",
  },
  {
    title: "Best Practices for Creating Effective Quizzes",
    excerpt: "Learn how to create quizzes that accurately assess student understanding and provide valuable feedback.",
    date: "March 5, 2026",
    category: "Assessment",
    readTime: "7 min read",
  },
  {
    title: "How Schools Are Using ArcLMS to Save Time",
    excerpt: "Case studies from Nigerian schools that have transformed their administrative workflows with ArcLMS.",
    date: "February 28, 2026",
    category: "Case Studies",
    readTime: "6 min read",
  },
  {
    title: "Preparing for the New Term: A Checklist for Administrators",
    excerpt: "Everything you need to do in ArcLMS before the new academic term begins.",
    date: "February 20, 2026",
    category: "Guides",
    readTime: "4 min read",
  },
  {
    title: "Introducing Report Card Generation",
    excerpt: "Announcing our new automated report card feature that saves hours of administrative work.",
    date: "February 15, 2026",
    category: "Product Updates",
    readTime: "3 min read",
  },
];

const Page = () => {
  return (
    <>
      <main className="bg-background">
        {/* Hero Section */}
        <section className="border-b py-20">
          <div className="container mx-auto text-center">
            <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Insights, updates, and best practices for Nigerian schools using ArcLMS.
            </p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-20">
          <div className="container mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <article
                  key={index}
                  className="group bg-card hover:border-primary/50 rounded-xl border transition-all hover:shadow-md"
                >
                  <div className="bg-muted aspect-video rounded-t-xl" />
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="text-muted-foreground text-xs">{post.readTime}</span>
                    </div>
                    <h2 className="text-foreground group-hover:text-primary mb-2 text-lg font-semibold transition-colors">
                      <Link href="#">{post.title}</Link>
                    </h2>
                    <p className="text-muted-foreground mb-4 text-sm">{post.excerpt}</p>
                    <time className="text-muted-foreground text-xs">{post.date}</time>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="bg-muted/30 border-t py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-foreground mb-4 text-2xl font-bold">Stay Updated</h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-xl">
              Subscribe to our newsletter for the latest updates and educational insights.
            </p>
            <form className="mx-auto flex max-w-md gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-background flex-1 rounded-lg border px-4 py-2"
              />
              <button className="bg-primary text-primary-foreground rounded-lg px-6 py-2 font-medium">Subscribe</button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default Page;
