"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Calendar03Icon,
  ChartHistogramIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  CloudIcon,
  ComputerVideoCallIcon,
  DashboardSquare01Icon,
  GraduationCap,
  Mail01Icon,
  MoneyReceiveSquareIcon,
  PresentationBarChart01Icon,
  SecurityCheckIcon,
  ShieldUserIcon,
  Task01Icon,
  TeacherIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

import { Footer, Navbar } from "@/components/shared";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const FEATURES = [
  {
    icon: Calendar03Icon,
    title: "Academic Sessions & Terms",
    description:
      "Manage Nigerian school calendar with Sessions and 3 Terms per year. Configure holidays and non-instructional days.",
  },
  {
    icon: GraduationCap,
    title: "Class & Course Management",
    description:
      "Create classes (JSS1, Primary 5, etc.) and assign courses to tutors. Track enrollment and student progress.",
  },
  {
    icon: Clock01Icon,
    title: "Automatic Timetabling",
    description:
      "Auto-generate conflict-free timetables for each class. Support period swaps between tutors with approval workflow.",
  },
  {
    icon: Task01Icon,
    title: "Assessments & Examinations",
    description:
      "Create quizzes, assignments, and exams with auto-grading. Support multiple question types and manual review.",
  },
  {
    icon: ChartHistogramIcon,
    title: "Progress & Report Cards",
    description:
      "Track student progress per course per term. Auto-generate report cards with grades, positions, and remarks.",
  },
  {
    icon: ComputerVideoCallIcon,
    title: "Virtual Meetings",
    description:
      "Schedule and host virtual classes with integrated video conferencing. Track attendance and recordings.",
  },
  {
    icon: Mail01Icon,
    title: "Communications",
    description:
      "Send targeted emails and notifications to students, tutors, or entire classes. Schedule messages for later.",
  },
  {
    icon: MoneyReceiveSquareIcon,
    title: "Simple Billing",
    description:
      "Transparent postpaid billing at NGN 500 per student per term. Auto-generated invoices with payment tracking.",
  },
];

const ROLES = [
  {
    icon: ShieldUserIcon,
    title: "School Administrators",
    description: "Full control over academic structure, user management, billing, and school-wide communications.",
    features: [
      "Configure sessions, terms, and holidays",
      "Manage students and tutors",
      "View billing and usage reports",
      "Generate school-wide reports",
    ],
  },
  {
    icon: TeacherIcon,
    title: "Tutors",
    description: "Manage courses, create assessments, grade submissions, and communicate with students.",
    features: [
      "Create quizzes and assignments",
      "Grade and provide feedback",
      "Schedule virtual meetings",
      "Track student progress",
    ],
  },
  {
    icon: UserGroupIcon,
    title: "Students",
    description: "Access courses, submit assignments, take exams, and view grades all in one place.",
    features: [
      "Access course materials",
      "Submit assignments on time",
      "Take quizzes and exams",
      "View grades and progress",
    ],
  },
];

const STATS = [
  { value: "500+", label: "Concurrent Tenants" },
  { value: "5,000", label: "Students per School" },
  { value: "99.9%", label: "Uptime Guarantee" },
  { value: "< 300ms", label: "API Response Time" },
];

const COMPLIANCES = [
  {
    icon: SecurityCheckIcon,
    label: "Data Encryption",
    description: "AES-256 encryption at rest and TLS 1.2+ in transit for all data.",
  },
  {
    icon: DashboardSquare01Icon,
    label: "Multi-Tenant Isolation",
    description: "Each school&apos;s data is logically isolated. No cross-tenant access possible.",
  },
  {
    icon: PresentationBarChart01Icon,
    label: "Audit Logs",
    description: "Immutable audit logs retained for 7 years for compliance and transparency.",
  },
  {
    icon: CloudIcon,
    label: "Cloud Infrastructure",
    description: "Hosted on reliable cloud infrastructure with 99.9% uptime guarantee.",
  },
];

const Page = () => {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        <section className="relative py-20 lg:py-32">
          <div className="container mx-auto">
            <motion.div
              className="mx-auto max-w-4xl text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium">
                Built for Nigerian Schools
              </span>
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                The Complete Learning Management System for Primary & Secondary Schools
              </h1>
              <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
                Manage your entire academic lifecycle — from sessions and timetables to assessments and report cards —
                with a platform built specifically for the Nigerian education system.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/signin">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg">
                  Schedule a Demo
                </Button>
              </div>
            </motion.div>
          </div>
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="bg-foreground/30 absolute top-10 -right-20 h-125 w-125 rounded-full blur-3xl" />
            <div className="bg-foreground/30 absolute bottom-5 -left-20 h-125 w-125 rounded-full blur-3xl" />
          </div>
        </section>
        <section className="border-border bg-muted/30 border-y py-12">
          <div className="container mx-auto">
            <motion.div
              className="grid grid-cols-2 gap-8 lg:grid-cols-4"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
            >
              {STATS.map((stat, index) => (
                <motion.div key={index} className="text-center" variants={fadeInUp}>
                  <p className="text-primary text-3xl font-bold lg:text-4xl">{stat.value}</p>
                  <p className="text-muted-foreground mt-1 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        <section className="py-20 lg:py-32">
          <div className="container mx-auto">
            <motion.div
              className="mb-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Everything You Need to Run Your School</h2>
              <p className="text-muted-foreground mx-auto max-w-2xl">
                A comprehensive suite of tools designed specifically for Nigerian schools, from academic management to
                billing.
              </p>
            </motion.div>

            <motion.div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
            >
              {FEATURES.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group border-border bg-card hover:border-primary/50 rounded-xl border p-6 transition-all hover:shadow-lg"
                  variants={fadeInUp}
                >
                  <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-colors">
                    <HugeiconsIcon icon={feature.icon} size={24} />
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        <section className="bg-muted/30 py-20 lg:py-32">
          <div className="container mx-auto">
            <motion.div
              className="mb-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Built for Every Role</h2>
              <p className="text-muted-foreground mx-auto max-w-2xl">
                Whether you&apos;re an administrator, tutor, or student, ArcLMS provides the tools you need to succeed.
              </p>
            </motion.div>
            <motion.div
              className="grid gap-8 lg:grid-cols-3"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
            >
              {ROLES.map((role, index) => (
                <motion.div key={index} className="border-border bg-card rounded-xl border p-8" variants={fadeInUp}>
                  <div className="bg-primary text-primary-foreground mb-4 flex h-14 w-14 items-center justify-center rounded-xl">
                    <HugeiconsIcon icon={role.icon} size={28} />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{role.title}</h3>
                  <p className="text-muted-foreground mb-6">{role.description}</p>
                  <ul className="space-y-3">
                    {role.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm">
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          size={18}
                          className="mt-0.5 shrink-0 text-green-600"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        <section className="py-20 lg:py-32">
          <div className="container mx-auto">
            <motion.div
              className="mb-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground mx-auto max-w-2xl">
                Pay only for what you use. No hidden fees, no setup costs.
              </p>
            </motion.div>

            <motion.div
              className="mx-auto max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="border-primary bg-card relative overflow-hidden rounded-2xl border-2 p-8 shadow-xl">
                <div className="bg-primary text-primary-foreground absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-medium">
                  Postpaid
                </div>
                <div className="mb-6">
                  <p className="text-muted-foreground mb-2 text-sm font-medium">Per Student</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">&#8358;500</span>
                    <span className="text-muted-foreground">/ term</span>
                  </div>
                </div>
                <div className="mb-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} className="text-green-600" />
                    <span>Unlimited admins and tutors</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} className="text-green-600" />
                    <span>All features included</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} className="text-green-600" />
                    <span>Auto-generated invoices</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} className="text-green-600" />
                    <span>14-day grace period</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} className="text-green-600" />
                    <span>Dedicated support</span>
                  </div>
                </div>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/signin">Start Using ArcLMS</Link>
                </Button>
                <p className="text-muted-foreground mt-4 text-center text-xs">
                  Billed at the start of each term based on enrolled student count
                </p>
              </div>
            </motion.div>
          </div>
        </section>
        <section className="bg-muted/30 py-20 lg:py-32">
          <div className="container mx-auto">
            <div className="grid items-center gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Enterprise-Grade Security & Compliance</h2>
                <p className="text-muted-foreground mb-8">
                  Your data is protected with industry-leading security measures. We take privacy and compliance
                  seriously.
                </p>
                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
                  <div className="space-y-6">
                    {COMPLIANCES.map((comp, index) => (
                      <div className="flex gap-4" key={index}>
                        <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                          <HugeiconsIcon icon={comp.icon} size={20} />
                        </div>
                        <div>
                          <h3 className="mb-1 font-semibold">{comp.label}</h3>
                          <p className="text-muted-foreground text-sm">{comp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-primary aspect-video rounded-xl"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        <section className="py-20 lg:py-32">
          <div className="container mx-auto">
            <motion.div
              className="bg-primary text-primary-foreground relative overflow-hidden rounded-3xl p-12 text-center lg:p-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative z-10">
                <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to Transform Your School?</h2>
                <p className="mx-auto mb-8 max-w-2xl opacity-90">
                  Join hundreds of Nigerian schools already using ArcLMS to streamline their academic operations. Get
                  started in minutes.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-background text-foreground hover:bg-background/90"
                    asChild
                  >
                    <Link href="/signin">Get Started Free</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Contact Sales
                  </Button>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 h-[300px] w-[300px] rounded-full bg-white/10" />
                <div className="absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-white/10" />
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Page;
