"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { CopyrightYear } from "@/components/copyright-year";

// Import ThemeToggle with SSR disabled to prevent hydration mismatch
const ThemeToggle = dynamic(() => import("@/components/theme-toggle").then(mod => ({ default: mod.ThemeToggle })), {
  ssr: false,
  loading: () => (
    <div className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-p-2 tw-w-9 tw-h-9">
      <div className="tw-w-5 tw-h-5 tw-bg-gray-300 dark:tw-bg-gray-600 tw-rounded tw-animate-pulse" />
    </div>
  ),
});

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="tw-min-h-screen tw-flex tw-flex-col tw-bg-white dark:tw-bg-gray-900 tw-transition-colors tw-duration-300 tw-ease-in-out">
      {/* Navigation */}
      <nav className="tw-border-b tw-border-gray-200 tw-bg-white dark:tw-border-gray-700 dark:tw-bg-gray-900 tw-transition-colors tw-duration-300 tw-ease-in-out">
        <div className="tw-mx-auto tw-max-w-7xl tw-px-4 sm:tw-px-6 lg:tw-px-8">
          <div className="tw-flex tw-h-16 tw-items-center tw-justify-between">
            {/* Left - Logo & Social Links */}
            <div className="tw-flex tw-items-center tw-space-x-3">
              <Link
                href="/"
                className="tw-text-xl tw-font-semibold tw-text-blue-600 dark:tw-text-blue-400"
              >
                Jacob Erickson
              </Link>
              <a
                href="https://github.com/jacobrerickson"
                target="_blank"
                rel="noopener noreferrer"
                className="tw-text-gray-600 hover:tw-text-gray-900 dark:tw-text-gray-400 dark:hover:tw-text-gray-100 tw-transition-colors"
                aria-label="GitHub"
              >
                <svg className="tw-w-5 tw-h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/jacob-r-erickson/"
                target="_blank"
                rel="noopener noreferrer"
                className="tw-text-gray-600 hover:tw-text-gray-900 dark:tw-text-gray-400 dark:hover:tw-text-gray-100 tw-transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="tw-w-5 tw-h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="tw-flex-grow">{children}</main>

      {/* Footer */}
      <footer className="tw-bg-gray-50 tw-border-t tw-border-gray-200 dark:tw-bg-gray-800 dark:tw-border-gray-700 tw-transition-colors tw-duration-300 tw-ease-in-out">
        <div className="tw-mx-auto tw-max-w-7xl tw-px-4 tw-py-12 sm:tw-px-6 lg:tw-px-8">
          <div className="tw-text-center">
            <p className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">
              © <CopyrightYear /> Jacob Erickson. All rights reserved.
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
