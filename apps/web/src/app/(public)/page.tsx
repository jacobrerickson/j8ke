"use client";

export default function Home() {
  return (
    <div className="tw-relative tw-bg-white tw-overflow-hidden">
      {/* About Section */}
      <div className="tw-py-24 sm:tw-py-32">
        <div className="tw-mx-auto tw-max-w-7xl tw-px-6 lg:tw-px-8">
          <div className="tw-mx-auto tw-max-w-2xl">
            <h2 className="tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900 sm:tw-text-6xl">
              About Me
            </h2>
            <p className="tw-mt-6 tw-text-lg tw-leading-8 tw-text-gray-600">
              I&apos;m a full-stack engineer with a passion for problem solving.
              Included on this site are a couple small tools I&apos;ve built.
            </p>
            {/* Experience Section */}
            <div className="tw-mt-16">
              <h3 className="tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900">
                Professional Experience
              </h3>
              <div className="tw-mt-6 tw-space-y-6">
                <div className="tw-border-l-4 tw-border-blue-500 tw-pl-4">
                  <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-justify-between sm:tw-items-start">
                    <div>
                      <h4 className="tw-text-lg tw-font-semibold tw-text-gray-900">
                        Full-Stack Engineer/Product Manager
                      </h4>
                      <p className="tw-text-md tw-font-medium tw-text-blue-600">
                        <a href="https://www.aimsmarketing.ai">Athlete &amp; Influencer Marketing Solutions</a>
                      </p>
                    </div>
                    <span className="tw-text-sm tw-text-gray-500 tw-mt-1 sm:tw-mt-0">
                      April, 2025 - Present
                    </span>
                  </div>
                  <ul className="tw-mt-3 tw-list-disc tw-list-inside tw-text-gray-600 tw-space-y-1">
                    <li>Led development of full-stack web application</li>
                    <li>
                      Communicated with stakeholders to define product
                      requirements and focus
                    </li>
                  </ul>
                </div>

                <div className="tw-border-l-4 tw-border-green-500 tw-pl-4">
                  <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-justify-between sm:tw-items-start">
                    <div>
                      <h4 className="tw-text-lg tw-font-semibold tw-text-gray-900">
                        Full-Stack Engineer
                      </h4>
                      <p className="tw-text-md tw-font-medium tw-text-green-600">
                        <a href="https://www.tarifflo.com">Tarifflo</a>
                      </p>
                    </div>
                    <span className="tw-text-sm tw-text-gray-500 tw-mt-1 sm:tw-mt-0">
                      January, 2025 - April, 2025
                    </span>
                  </div>
                  <ul className="tw-mt-3 tw-list-disc tw-list-inside tw-text-gray-600 tw-space-y-1">
                    <li>
                      Collaborated with designers and data scientists to
                      implement complex AI features from front-end to back-end
                    </li>
                  </ul>
                </div>

                <div className="tw-border-l-4 tw-border-purple-500 tw-pl-4">
                  <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-justify-between sm:tw-items-start">
                    <div>
                      <h4 className="tw-text-lg tw-font-semibold tw-text-gray-900">
                        Founder/Full-Stack Engineer
                      </h4>
                      <p className="tw-text-md tw-font-medium tw-text-purple-600">
                        <a href="https://web.sandbox.ing/">
                          Sandbox Program
                        </a>
                      </p>
                    </div>
                    <span className="tw-text-sm tw-text-gray-500 tw-mt-1 sm:tw-mt-0">
                      May, 2024 - April, 2025
                    </span>
                  </div>
                  <ul className="tw-mt-3 tw-list-disc tw-list-inside tw-text-gray-600 tw-space-y-1">
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
                      <h4 className="tw-text-lg tw-font-semibold tw-text-gray-900">
                        Website Technician
                      </h4>
                      <p className="tw-text-md tw-font-medium tw-text-yellow-600">
                        Utah State University
                      </p>
                    </div>
                    <span className="tw-text-sm tw-text-gray-500 tw-mt-1 sm:tw-mt-0">
                      April, 2024 - April, 2025
                    </span>
                  </div>
                  <ul className="tw-mt-3 tw-list-disc tw-list-inside tw-text-gray-600 tw-space-y-1">
                    <li>
                      Worked with university content providers to best display relevant information on webpages, mostly working with HTML and CSS and applying best-practices for accessibility
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="tw-mt-16 tw-space-y-16">
              <div>
                <h3 className="tw-text-2xl tw-font-bold tw-tracking-tight tw-text-gray-900">
                  Website built with:
                </h3>
                <div className="tw-mt-6 tw-space-y-4">
                  <div>
                    <h4 className="tw-text-lg tw-font-semibold tw-text-gray-900">
                      Frontend
                    </h4>
                    <ul className="tw-mt-2 tw-list-disc tw-list-inside tw-text-gray-600">
                      <li>Next.js 14 with App Router</li>
                      <li>TypeScript</li>
                      <li>Tailwind CSS</li>
                      <li>Redux</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="tw-text-lg tw-font-semibold tw-text-gray-900">
                      Backend
                    </h4>
                    <ul className="tw-mt-2 tw-list-disc tw-list-inside tw-text-gray-600">
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
