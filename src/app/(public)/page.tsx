"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRef, useState } from "react";
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
  School01Icon,
  SecurityCheckIcon,
  ShieldUserIcon,
  Task01Icon,
  TeacherIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib";

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
      "Effortlessly manage the complete Nigerian school calendar with customizable academic sessions and the traditional 3-term structure. Define term start and end dates, set up holiday calendars, mark non-instructional days, and ensure every stakeholder stays aligned with real-time updates across the entire school ecosystem.",
  },
  {
    icon: GraduationCap,
    title: "Class & Course Management",
    description:
      "Build a structured academic hierarchy by creating classes (JSS1, Primary 5, SS3, etc.) and mapping courses to qualified tutors. Monitor live enrollment numbers, track individual learner progress, and maintain historical records that give administrators, teachers, and parents a clear view of each student's academic journey throughout the year.",
  },
  {
    icon: Clock01Icon,
    title: "Automatic Timetabling",
    description:
      "Eliminate scheduling conflicts with an intelligent algorithm that auto-generates balanced, clash-free timetables for every class and teacher. Enable seamless period swaps through an approval workflow, accommodate special events, and instantly notify all affected parties when changes occur—saving hours of manual planning each week.",
  },
  {
    icon: Task01Icon,
    title: "Assessments & Examinations",
    description:
      "Design rich, interactive quizzes, assignments, and terminal exams using multiple question types—multiple choice, theory, fill-in-the-blank, and multimedia. Leverage instant auto-grading for objective sections, switch to manual review for essay answers, and release curated feedback that helps students understand strengths and areas for improvement.",
  },
  {
    icon: ChartHistogramIcon,
    title: "Progress & Report Cards",
    description:
      "Gain deep insights into learner performance with per-course, per-term analytics that highlight trends, attendance, and behavioral metrics. Generate beautifully formatted report cards complete with subject grades, class positions, teacher remarks, and psychomotor skills—ready for secure digital delivery or bulk printing at the click of a button.",
  },
  {
    icon: ComputerVideoCallIcon,
    title: "Virtual Meetings",
    description:
      "Host engaging virtual classes through seamlessly integrated HD video conferencing that supports screen sharing, breakout rooms, and interactive whiteboards. Automatically record sessions for later review, track real-time attendance, and share archived lessons so no student falls behind, whether learning from home or revising for exams.",
  },
  {
    icon: Mail01Icon,
    title: "Communications",
    description:
      "Keep the entire school community informed with targeted email, SMS, and in-app notifications. Craft personalized messages for individual students, specific classes, or the whole school, schedule announcements for future dates, and track delivery receipts to ensure critical information about fees, events, or emergencies reaches every recipient.",
  },
  {
    icon: MoneyReceiveSquareIcon,
    title: "Simple Billing",
    description:
      "Enjoy transparent, postpaid billing at a flat rate of NGN 500 per student per academic term—no hidden charges, setup costs, or long-term contracts. Receive auto-generated invoices at the start of each term, monitor payment statuses in real time, and access detailed financial reports that simplify reconciliation for bursars and school owners.",
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
    description: "Each school's data is logically isolated. No cross-tenant access possible.",
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

const TRANSITION_FRACTION = 0.06; // fraction of total scroll for each in/out transition

const FeatureCard = ({
  feature,
  index,
  scrollYProgress,
  total,
}: {
  feature: (typeof FEATURES)[0];
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  total: number;
}) => {
  const slotSize = 1 / total;
  const isLast = index === total - 1;

  const fadeIn = index * slotSize;
  const fadeInEnd = fadeIn + TRANSITION_FRACTION;
  const fadeOut = isLast ? 1 : fadeIn + slotSize - TRANSITION_FRACTION;
  const fadeOutEnd = isLast ? 1 : fadeIn + slotSize;

  const opacity = useTransform(scrollYProgress, [fadeIn, fadeInEnd, fadeOut, fadeOutEnd], [0, 1, 1, isLast ? 1 : 0]);
  const y = useTransform(scrollYProgress, [fadeIn, fadeInEnd, fadeOut, fadeOutEnd], [32, 0, 0, isLast ? 0 : -24]);
  const scale = useTransform(
    scrollYProgress,
    [fadeIn, fadeInEnd, fadeOut, fadeOutEnd],
    [0.96, 1, 1, isLast ? 1 : 0.98],
  );

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center space-y-6 p-8 sm:p-12"
      style={{ opacity, y, scale }}
    >
      <div className="bg-foreground grid size-14 place-items-center rounded-xl">
        <HugeiconsIcon className="text-background size-8" icon={feature.icon} />
      </div>
      <div className="space-y-3">
        <div className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
        <h4 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">{feature.title}</h4>
        <p className="text-muted-foreground text-base leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={containerRef}
      style={{ height: `calc(100vh + ${(FEATURES.length - 1) * 40}vh)` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-4 py-20">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-foreground mb-3 text-3xl font-bold sm:text-4xl">
            Everything You Need to Run Your School
          </h2>
          <p className="text-muted-foreground mx-auto max-w-xl">
            A comprehensive suite of tools designed specifically for Nigerian schools.
          </p>
        </motion.div>
        <div className="relative mx-auto w-full max-w-5xl" style={{ height: "clamp(320px, 45vh, 480px)" }}>
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              scrollYProgress={scrollYProgress}
              total={FEATURES.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const Page = () => {
  const [activeComplianceIndex, setActiveComplianceIndex] = useState(0);

  const handleCardClick = () => {
    setActiveComplianceIndex((prev) => (prev + 1) % COMPLIANCES.length);
  };

  return (
    <main className="bg-background">
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-primary/10 text-primary mb-4 inline-flex items-center gap-x-2 rounded-full px-4 py-1.5 text-sm font-medium">
              <HugeiconsIcon className="size-5" icon={School01Icon} />
              Built for Nigerian Schools
            </div>
            <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
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
          <div className="bg-foreground/30 absolute top-10 -right-20 size-125 rounded-full blur-3xl" />
          <div className="bg-foreground/30 absolute bottom-5 -left-20 size-125 rounded-full blur-3xl" />
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
                <h3 className="text-primary text-3xl font-bold lg:text-4xl">{stat.value}</h3>
                <p className="text-muted-foreground mt-1 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <FeaturesSection />
      <section className="bg-muted/30 py-20 lg:py-32">
        <div className="container mx-auto">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">Built for Every Role</h2>
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
                <h3 className="text-foreground mb-2 text-xl font-semibold">{role.title}</h3>
                <p className="text-muted-foreground mb-6">{role.description}</p>
                <ul className="space-y-3">
                  {role.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-sm">
                      <HugeiconsIcon
                        icon={CheckmarkCircle02Icon}
                        size={18}
                        className="mt-0.5 shrink-0 text-green-600"
                      />
                      <span className="text-foreground">{feature}</span>
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
            <p className="text-muted-foreground mx-auto max-w-3xl">
              Pay only for what you use. No hidden fees, no setup costs.
            </p>
          </motion.div>
          <motion.div
            className="mx-auto max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative overflow-hidden">
              <div className="bg-primary text-primary-foreground absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-medium">
                Postpaid
              </div>
              <div className="mb-6">
                <p className="text-muted-foreground mb-2 text-sm font-medium">Per Student</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-foreground text-5xl font-bold">&#8358;500</h4>
                  <span className="text-muted-foreground">/ term</span>
                </div>
              </div>
              <div className="mb-8 space-y-4">
                {[
                  "Unlimited admins and tutors",
                  "All features included",
                  "Auto-generated invoices",
                  "14-day grace period",
                  "Dedicated support",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} className="text-green-600" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full" size="lg" asChild>
                <Link href="/signup">Start Using ArcLMS</Link>
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
              className="flex flex-col items-center gap-y-10"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">
                  Enterprise-Grade Security & Compliance
                </h2>
                <p className="text-muted-foreground mb-8">
                  Your data is protected with industry-leading security measures. We take privacy and compliance
                  seriously.
                </p>
              </div>
              <div className="relative mx-auto aspect-2/1 w-full max-w-3xl cursor-pointer" onClick={handleCardClick}>
                <AnimatePresence mode="popLayout">
                  {COMPLIANCES.map((comp, index) => {
                    const position = (index - activeComplianceIndex + COMPLIANCES.length) % COMPLIANCES.length;
                    const isActive = position === 0;
                    return (
                      <motion.div
                        key={comp.label}
                        className="bg-background absolute inset-0 flex items-center gap-6 rounded-xl border p-8 shadow-lg"
                        initial={{ scale: 0.9, y: 40, opacity: 0 }}
                        animate={{
                          scale: 1 - position * 0.05,
                          y: position * 16,
                          zIndex: COMPLIANCES.length - position,
                          opacity: position < 3 ? 1 - position * 0.2 : 0,
                        }}
                        exit={{ scale: 1.05, y: -20, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        style={{ pointerEvents: isActive ? "auto" : "none" }}
                      >
                        <div className="bg-primary/10 text-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-xl">
                          <HugeiconsIcon icon={comp.icon} size={28} />
                        </div>
                        <div>
                          <h3 className="text-foreground mb-1 text-lg font-semibold">{comp.label}</h3>
                          <p className="text-muted-foreground">{comp.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <div className="absolute -bottom-10 left-1/2 flex -translate-x-1/2 gap-2">
                  {COMPLIANCES.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveComplianceIndex(index);
                      }}
                      className={cn(
                        "h-2 rounded-full transition-all",
                        index === activeComplianceIndex ? "bg-primary w-6" : "bg-muted-foreground/30 w-2",
                      )}
                    />
                  ))}
                </div>
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
              <h2 className="text-background mb-4 text-3xl font-bold sm:text-4xl">Ready to Transform Your School?</h2>
              <p className="mx-auto mb-8 max-w-2xl opacity-90">
                Join hundreds of Nigerian schools already using ArcLMS to streamline their academic operations. Get
                started in minutes.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/signup">Get Started Free</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/signup">Contact Sales</Link>
                </Button>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="bg-background/10 absolute -top-20 -right-20 h-[300px] w-[300px] rounded-full" />
              <div className="bg-background/10 absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Page;
