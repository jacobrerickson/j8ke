"use client";

export default function Home() {
  return (
    <div className="tw-relative tw-bg-white dark:tw-bg-gray-900 tw-overflow-hidden tw-transition-colors tw-duration-300 tw-ease-in-out">
      {/* About Section */}
      <div className="tw-py-24 sm:tw-py-16">
        <div className="tw-mx-auto tw-max-w-7xl tw-px-6 lg:tw-px-8">
          <div className="tw-mx-auto tw-max-w-2xl">
            {/* Experience Section */}
            <div>
              <h3 className="tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900 dark:tw-text-gray-100">
                Professional Experience
              </h3>
              <div className="tw-mt-6 tw-space-y-6">
                <div className="tw-border-l-4 tw-border-indigo-500 tw-pl-4">
                  <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-justify-between sm:tw-items-start">
                    <div>
                      <h4 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100">
                        Software Engineer
                      </h4>
                      <p className="tw-text-md tw-font-medium tw-text-indigo-600 dark:tw-text-indigo-400">
                        <a href="https://esto.nasa.gov/invest/acmes/">
                          Utah State University — ACMES Mission
                        </a>
                      </p>
                    </div>
                    <span className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400 tw-mt-1 sm:tw-mt-0">
                      January, 2026 - Present
                    </span>
                  </div>
                  <p className="tw-mt-2 tw-text-sm tw-text-gray-500 dark:tw-text-gray-400 tw-italic">
                    ACMES (Active Cooling for Multispectral Earth Sensors) is a
                    NASA-funded 6U CubeSat mission validating cryogenic cooling
                    and methane-sensing technologies for small satellite Earth
                    observation.
                  </p>
                  <ul className="tw-mt-3 tw-list-disc tw-list-inside tw-text-gray-600 dark:tw-text-gray-300 tw-space-y-1">
                    <li>
                      Re-architected the satellite ground station telemetry
                      system from a monolithic, globally-coupled Python
                      application into a modular, queue-driven pipeline —
                      reducing the codebase from ~20K to ~10K lines while adding
                      99 automated tests where the original had none
                    </li>
                    <li>
                      Achieved 100x+ reduction in per-packet processing latency
                      by replacing Python-level byte iteration with C-level
                      buffer search, eliminating deepcopy on the hot path, and
                      removing a 1-second polling latency floor caused by polled
                      message routing
                    </li>
                    <li>
                      Replaced a centralized message router and deep inheritance
                      hierarchy with bounded queue pipelines and composable
                      pipeline stages, eliminating deadlock-prone cross-thread
                      patterns and cutting per-component complexity by an order
                      of magnitude
                    </li>
                    <li>
                      Introduced build/start lifecycle separation and dependency
                      injection, enabling a 99-test suite that runs without
                      Docker or hardware dependencies
                    </li>
                    <li>
                      Architected a communication bridge between proprietary
                      packet processing software and OpenC3 COSMOS for
                      telecommanding
                    </li>
                  </ul>
                </div>

                <div className="tw-border-l-4 tw-border-blue-500 tw-pl-4">
                  <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-justify-between sm:tw-items-start">
                    <div>
                      <h4 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100">
                        Full-stack Developer and Project Manager
                      </h4>
                      <p className="tw-text-md tw-font-medium tw-text-blue-600 dark:tw-text-blue-400">
                        <a href="https://www.aimsmarketing.ai">
                          Athlete &amp; Influencer Marketing Solutions
                        </a>
                      </p>
                    </div>
                    <span className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400 tw-mt-1 sm:tw-mt-0">
                      April, 2025 - November, 2025
                    </span>
                  </div>
                  <ul className="tw-mt-3 tw-list-disc tw-list-inside tw-text-gray-600 dark:tw-text-gray-300 tw-space-y-1">
                    <li>
                      Engineered a scalable backend architecture in Express.js
                      with tRPC and input validation using Yup schemas for
                      end-to-end type safety, applying a layered service pattern
                      for clear separation of functionality
                    </li>
                    <li>
                      Established a modular component-based design system with
                      Tailwind CSS to standardize UI patterns, improve
                      development speed, and maintain consistent styling
                    </li>
                    <li>
                      Built a contract generation pipeline converting campaign
                      data into preformatted PDFs via pdfMake, integrating AWS
                      S3 presigned URLs for secure, temporary uploads/downloads
                    </li>
                    <li>
                      Developed a payment system leveraging Stripe APIs (Payment
                      Intents, Webhooks, Subscriptions, and Connect) to automate
                      athlete payouts and manage recurring billing
                    </li>
                  </ul>
                </div>

                <div className="tw-border-l-4 tw-border-green-500 tw-pl-4">
                  <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-justify-between sm:tw-items-start">
                    <div>
                      <h4 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100">
                        Full-Stack Engineer
                      </h4>
                      <p className="tw-text-md tw-font-medium tw-text-green-600 dark:tw-text-green-400">
                        <a href="https://www.tarifflo.com">Tarifflo</a>
                      </p>
                    </div>
                    <span className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400 tw-mt-1 sm:tw-mt-0">
                      January, 2025 - April, 2025
                    </span>
                  </div>
                  <ul className="tw-mt-3 tw-list-disc tw-list-inside tw-text-gray-600 dark:tw-text-gray-300 tw-space-y-1">
                    <li>
                      Developed comprehensive anti-dumping and CVD analysis
                      system with automated job queuing, real-time status
                      tracking, and email notifications for failed processing
                      jobs
                    </li>
                    <li>
                      Architected and developed a comprehensive CRM system with
                      Google Calendar API integration, contact management, and
                      communication tracking, featuring real-time updates,
                      automated email history fetching, and multi-user
                      collaboration capabilities supporting both email and SMS
                      through Twilio
                    </li>
                  </ul>
                </div>

                <div className="tw-border-l-4 tw-border-purple-500 tw-pl-4">
                  <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-justify-between sm:tw-items-start">
                    <div>
                      <h4 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100">
                        Founder/Full-Stack Engineer
                      </h4>
                      <p className="tw-text-md tw-font-medium tw-text-purple-600 dark:tw-text-purple-400">
                        <a href="https://web.sandbox.ing/">Sandbox Program</a>
                      </p>
                    </div>
                    <span className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400 tw-mt-1 sm:tw-mt-0">
                      May, 2024 - April, 2025
                    </span>
                  </div>
                  <ul className="tw-mt-3 tw-list-disc tw-list-inside tw-text-gray-600 dark:tw-text-gray-300 tw-space-y-1">
                    <li>
                      As a part of this program, I worked with students across
                      different colleges to build and launch a tech startup.
                      Although I&apos;ve chosen not to further pursue the
                      product we created, I gained invaluable experience working
                      on a real product and moving quickly
                    </li>
                  </ul>
                </div>
                <div className="tw-border-l-4 tw-border-yellow-500 tw-pl-4">
                  <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-justify-between sm:tw-items-start">
                    <div>
                      <h4 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100">
                        Website Technician
                      </h4>
                      <p className="tw-text-md tw-font-medium tw-text-yellow-600 dark:tw-text-yellow-400">
                        Utah State University
                      </p>
                    </div>
                    <span className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400 tw-mt-1 sm:tw-mt-0">
                      April, 2024 - April, 2025
                    </span>
                  </div>
                  <ul className="tw-mt-3 tw-list-disc tw-list-inside tw-text-gray-600 dark:tw-text-gray-300 tw-space-y-1">
                    <li>
                      Communicated daily with clients about designing and
                      implementing changes to USU websites
                    </li>
                    <li>Trained new users to effectively use our CMS</li>
                  </ul>
                </div>

                <div className="tw-border-l-4 tw-border-orange-500 tw-pl-4">
                  <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-justify-between sm:tw-items-start">
                    <div>
                      <h4 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100">
                        IT Support Technician
                      </h4>
                      <p className="tw-text-md tw-font-medium tw-text-orange-600 dark:tw-text-orange-400">
                        Utah State University
                      </p>
                    </div>
                    <span className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400 tw-mt-1 sm:tw-mt-0">
                      January, 2022 - April, 2024
                    </span>
                  </div>
                  <ul className="tw-mt-3 tw-list-disc tw-list-inside tw-text-gray-600 dark:tw-text-gray-300 tw-space-y-1">
                    <li>
                      Responded to calls and chats from incoming customers and
                      fixed issues in a timely and respectful manner
                    </li>
                    <li>
                      Communicated with members of a team to tackle a multitude
                      of unique problems day-to-day
                    </li>
                    <li>
                      Relayed problems efficiently between administrators with a
                      focus on user-facing decisions
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="tw-mt-16 tw-space-y-16">
              <div>
                <h3 className="tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900 dark:tw-text-gray-100">
                  Website built with:
                </h3>
                <div className="tw-mt-6 tw-space-y-4">
                  <div>
                    <h4 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100">
                      Frontend
                    </h4>
                    <ul className="tw-mt-2 tw-list-disc tw-list-inside tw-text-gray-600 dark:tw-text-gray-300">
                      <li>Next.js 14 with App Router</li>
                      <li>TypeScript</li>
                      <li>Tailwind CSS</li>
                      <li>Redux</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100">
                      Backend
                    </h4>
                    <ul className="tw-mt-2 tw-list-disc tw-list-inside tw-text-gray-600 dark:tw-text-gray-300">
                      <li>tRPC for type-safe APIs</li>
                      <li>MongoDB</li>
                      <li>Mongoose ODM</li>
                      <li>JWT</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
