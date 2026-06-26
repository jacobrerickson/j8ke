"use client";

import { motion, MotionConfig } from "framer-motion";

import { CursorBlob } from "@/components/cursor-blob";

type Accent = {
  text: string;
  dot: string;
  ring: string;
};

const ACCENTS: Record<string, Accent> = {
  teal: {
    text: "tw-text-teal-600 dark:tw-text-teal-400",
    dot: "tw-bg-teal-500",
    ring: "tw-ring-teal-500/30",
  },
  indigo: {
    text: "tw-text-indigo-600 dark:tw-text-indigo-400",
    dot: "tw-bg-indigo-500",
    ring: "tw-ring-indigo-500/30",
  },
  blue: {
    text: "tw-text-blue-600 dark:tw-text-blue-400",
    dot: "tw-bg-blue-500",
    ring: "tw-ring-blue-500/30",
  },
  green: {
    text: "tw-text-green-600 dark:tw-text-green-400",
    dot: "tw-bg-green-500",
    ring: "tw-ring-green-500/30",
  },
  purple: {
    text: "tw-text-purple-600 dark:tw-text-purple-400",
    dot: "tw-bg-purple-500",
    ring: "tw-ring-purple-500/30",
  },
  yellow: {
    text: "tw-text-yellow-600 dark:tw-text-yellow-400",
    dot: "tw-bg-yellow-500",
    ring: "tw-ring-yellow-500/30",
  },
  orange: {
    text: "tw-text-orange-600 dark:tw-text-orange-400",
    dot: "tw-bg-orange-500",
    ring: "tw-ring-orange-500/30",
  },
};

type Experience = {
  color: keyof typeof ACCENTS;
  title: string;
  company: string;
  href?: string;
  date: string;
  description?: string;
  bullets: string[];
};

const EXPERIENCES: Experience[] = [
  {
    color: "teal",
    title: "Software Engineer",
    company: "Gaapio",
    href: "https://gaapio.com",
    date: "May, 2026 - Present",
    description:
      "Gaapio is an AI-powered accounting SaaS platform that automates technical accounting workflows.",
    bullets: [
      "Designed and built an end-to-end system for ingesting, auditing, editing, and version-controlling Excel workbooks through an AI chat interface — including a Univer-based viewer with clickable cell citations, a deterministic check suite with an eval harness and CI lane, and chat-driven surgical value, formula, and structural edits",
      "Built a byte-reproducible op-log document-versioning engine with version replay, restore-in-place, AI-edit attribution, and multi-level undo, and automated ASC 842 lease accounting from chat-native intake through deterministic schedule generation and disclosure output",
      "Architected a bidirectional sync engine between Gaapio's file cabinet and external cloud drives (Google Drive, then OneDrive / SharePoint) with webhook and delta-polling change detection, conflict preservation, and production hardening via Cloud Scheduler and OIDC",
      "Rebuilt file management on a unified, Realtime-backed documents view, and led migration of multi-tenant document storage to per-company GCS buckets with semantic search moved from Vertex AI RAG corpora to Discovery Engine data stores",
      "Drove an app-wide dark-mode and semantic color-token migration alongside ongoing reliability fixes across memo, contracts, chat, disclosures, retention, and exports",
    ],
  },
  {
    color: "indigo",
    title: "Software Engineer",
    company: "Utah State University — ACMES Mission",
    href: "https://esto.nasa.gov/invest/acmes/",
    date: "January, 2026 - April, 2026",
    description:
      "ACMES (Active Cooling for Multispectral Earth Sensors) is a NASA-funded 6U CubeSat mission validating cryogenic cooling and methane-sensing technologies for small satellite Earth observation.",
    bullets: [
      "Re-architected the satellite ground station telemetry system from a monolithic, globally-coupled Python application into a modular, queue-driven pipeline — reducing the codebase from ~20K to ~10K lines while adding 99 automated tests where the original had none",
      "Achieved 100x+ reduction in per-packet processing latency by replacing Python-level byte iteration with C-level buffer search, eliminating deepcopy on the hot path, and removing a 1-second polling latency floor caused by polled message routing",
      "Replaced a centralized message router and deep inheritance hierarchy with bounded queue pipelines and composable pipeline stages, eliminating deadlock-prone cross-thread patterns and cutting per-component complexity by an order of magnitude",
      "Introduced build/start lifecycle separation and dependency injection, enabling a 99-test suite that runs without Docker or hardware dependencies",
      "Architected a communication bridge between proprietary packet processing software and OpenC3 COSMOS for telecommanding",
    ],
  },
  {
    color: "blue",
    title: "Full-stack Developer and Project Manager",
    company: "Athlete & Influencer Marketing Solutions",
    href: "https://www.aimsmarketing.ai",
    date: "April, 2025 - November, 2025",
    bullets: [
      "Engineered a scalable backend architecture in Express.js with tRPC and input validation using Yup schemas for end-to-end type safety, applying a layered service pattern for clear separation of functionality",
      "Established a modular component-based design system with Tailwind CSS to standardize UI patterns, improve development speed, and maintain consistent styling",
      "Built a contract generation pipeline converting campaign data into preformatted PDFs via pdfMake, integrating AWS S3 presigned URLs for secure, temporary uploads/downloads",
      "Developed a payment system leveraging Stripe APIs (Payment Intents, Webhooks, Subscriptions, and Connect) to automate athlete payouts and manage recurring billing",
    ],
  },
  {
    color: "green",
    title: "Full-Stack Engineer",
    company: "Tarifflo",
    href: "https://www.tarifflo.com",
    date: "January, 2025 - April, 2025",
    bullets: [
      "Developed comprehensive anti-dumping and CVD analysis system with automated job queuing, real-time status tracking, and email notifications for failed processing jobs",
      "Architected and developed a comprehensive CRM system with Google Calendar API integration, contact management, and communication tracking, featuring real-time updates, automated email history fetching, and multi-user collaboration capabilities supporting both email and SMS through Twilio",
    ],
  },
  {
    color: "purple",
    title: "Founder/Full-Stack Engineer",
    company: "Sandbox Program",
    href: "https://web.sandbox.ing/",
    date: "May, 2024 - April, 2025",
    bullets: [
      "As a part of this program, I worked with students across different colleges to build and launch a tech startup. Although I've chosen not to further pursue the product we created, I gained invaluable experience working on a real product and moving quickly",
    ],
  },
  {
    color: "yellow",
    title: "Website Technician",
    company: "Utah State University",
    date: "April, 2024 - April, 2025",
    bullets: [
      "Communicated daily with clients about designing and implementing changes to USU websites",
      "Trained new users to effectively use our CMS",
    ],
  },
  {
    color: "orange",
    title: "IT Support Technician",
    company: "Utah State University",
    date: "January, 2022 - April, 2024",
    bullets: [
      "Responded to calls and chats from incoming customers and fixed issues in a timely and respectful manner",
      "Communicated with members of a team to tackle a multitude of unique problems day-to-day",
      "Relayed problems efficiently between administrators with a focus on user-facing decisions",
    ],
  },
];

const TECH_STACK: { group: string; items: string[] }[] = [
  {
    group: "Frontend",
    items: ["Next.js 14 with App Router", "TypeScript", "Tailwind CSS", "Redux"],
  },
  {
    group: "Backend",
    items: ["tRPC for type-safe APIs", "MongoDB", "Mongoose ODM", "JWT"],
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function ExperienceCard({ exp, index }: { exp: Experience; index: number }) {
  const accent = ACCENTS[exp.color];

  return (
    <motion.div
      className="tw-relative tw-pl-8"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: EASE, delay: Math.min(index, 4) * 0.06 }}
    >
      {/* Timeline node */}
      <span
        aria-hidden
        className={`tw-absolute tw-left-0 tw-top-2 tw-h-3.5 tw-w-3.5 tw-rounded-full tw-ring-4 ${accent.dot} ${accent.ring} tw-ring-offset-0`}
      />

      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="tw-rounded-xl tw-border tw-border-gray-200 tw-bg-white tw-p-5 tw-shadow-sm hover:tw-shadow-lg hover:tw-border-gray-300 dark:tw-border-gray-800 dark:tw-bg-gray-800/60 dark:hover:tw-border-gray-700"
      >
        <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-justify-between sm:tw-items-start">
          <div>
            <h4 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100">
              {exp.title}
            </h4>
            <p className={`tw-text-md tw-font-medium ${accent.text}`}>
              {exp.href ? (
                <a
                  href={exp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:tw-underline"
                >
                  {exp.company}
                </a>
              ) : (
                exp.company
              )}
            </p>
          </div>
          <span className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400 tw-mt-1 sm:tw-mt-0 tw-whitespace-nowrap">
            {exp.date}
          </span>
        </div>

        {exp.description && (
          <p className="tw-mt-2 tw-text-sm tw-text-gray-500 dark:tw-text-gray-400 tw-italic">
            {exp.description}
          </p>
        )}

        <ul className="tw-mt-3 tw-space-y-2 tw-text-gray-600 dark:tw-text-gray-300">
          {exp.bullets.map((bullet, i) => (
            <li key={i} className="tw-flex tw-gap-2.5">
              <span
                aria-hidden
                className={`tw-mt-2 tw-h-1.5 tw-w-1.5 tw-flex-none tw-rounded-full ${accent.dot}`}
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="tw-relative tw-bg-white dark:tw-bg-gray-900 tw-overflow-hidden tw-transition-colors tw-duration-300 tw-ease-in-out">
        {/* Faint blob that loosely trails the cursor */}
        <CursorBlob />

        <div className="tw-relative tw-py-24 sm:tw-py-16">
          <div className="tw-mx-auto tw-max-w-7xl tw-px-6 lg:tw-px-8">
            <div className="tw-mx-auto tw-max-w-2xl lg:tw-max-w-4xl xl:tw-max-w-5xl">
              {/* Hero */}
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="tw-mb-20"
              >
                <span className="tw-inline-flex tw-items-center tw-gap-2 tw-rounded-full tw-border tw-border-gray-200 tw-bg-white/70 tw-px-3 tw-py-1 tw-text-sm tw-font-medium tw-text-gray-600 tw-backdrop-blur dark:tw-border-gray-700 dark:tw-bg-gray-800/70 dark:tw-text-gray-300">
                  <span className="tw-relative tw-flex tw-h-2 tw-w-2">
                    <span className="tw-absolute tw-inline-flex tw-h-full tw-w-full tw-animate-ping tw-rounded-full tw-bg-teal-400 tw-opacity-75" />
                    <span className="tw-relative tw-inline-flex tw-h-2 tw-w-2 tw-rounded-full tw-bg-teal-500" />
                  </span>
                  Software Engineer at Gaapio
                </span>

                <h1 className="tw-mt-5 tw-text-4xl tw-font-bold tw-tracking-tight tw-text-gray-900 sm:tw-text-5xl lg:tw-text-6xl dark:tw-text-gray-100">
                  Jacob Erickson
                </h1>

                <p className="tw-mt-5 tw-max-w-2xl tw-text-lg tw-leading-relaxed tw-text-gray-600 dark:tw-text-gray-300">
                  I build full-stack products end to end. Currently crafting
                  AI-driven accounting tooling at Gaapio, and previously
                  satellite ground-station systems for a NASA-funded CubeSat
                  mission.
                </p>
              </motion.section>

              {/* Experience Section */}
              <div>
                <motion.h3
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900 dark:tw-text-gray-100"
                >
                  Professional Experience
                </motion.h3>

                <div className="tw-relative tw-mt-8">
                  {/* Timeline spine */}
                  <div
                    aria-hidden
                    className="tw-absolute tw-left-[7px] tw-top-2 tw-bottom-2 tw-w-px tw-bg-gradient-to-b tw-from-gray-200 tw-via-gray-200 tw-to-transparent dark:tw-from-gray-700 dark:tw-via-gray-700"
                  />
                  <div className="tw-space-y-6">
                    {EXPERIENCES.map((exp, i) => (
                      <ExperienceCard key={exp.company + exp.date} exp={exp} index={i} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: EASE }}
                className="tw-mt-20"
              >
                <h3 className="tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900 dark:tw-text-gray-100">
                  Website built with
                </h3>
                <div className="tw-mt-6 tw-space-y-5">
                  {TECH_STACK.map((stack) => (
                    <div key={stack.group}>
                      <h4 className="tw-text-sm tw-font-semibold tw-uppercase tw-tracking-wide tw-text-gray-500 dark:tw-text-gray-400">
                        {stack.group}
                      </h4>
                      <div className="tw-mt-3 tw-flex tw-flex-wrap tw-gap-2">
                        {stack.items.map((item) => (
                          <span
                            key={item}
                            className="tw-inline-flex tw-items-center tw-rounded-full tw-bg-gray-100 tw-px-3 tw-py-1 tw-text-sm tw-font-medium tw-text-gray-700 tw-ring-1 tw-ring-inset tw-ring-gray-200 tw-transition-colors hover:tw-bg-gray-200 dark:tw-bg-gray-800 dark:tw-text-gray-300 dark:tw-ring-gray-700 dark:hover:tw-bg-gray-700"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
