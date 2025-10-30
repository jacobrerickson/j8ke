"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { CopyrightYear } from "@/components/copyright-year";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";

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
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="tw-min-h-screen tw-flex tw-flex-col tw-bg-white dark:tw-bg-gray-900 tw-transition-colors tw-duration-300 tw-ease-in-out">
      {/* Navigation */}
      <nav className="tw-border-b tw-border-gray-200 tw-bg-white dark:tw-border-gray-700 dark:tw-bg-gray-900 tw-transition-colors tw-duration-300 tw-ease-in-out">
        <div className="tw-mx-auto tw-max-w-7xl tw-px-4 sm:tw-px-6 lg:tw-px-8">
          <div className="tw-flex tw-h-16 tw-items-center tw-justify-between">
            {/* Left - Logo */}
            <div className="tw-flex-shrink-0">
              <Link
                href="/"
                className="tw-text-xl tw-font-semibold tw-text-blue-600 dark:tw-text-blue-400"
              >
                Jacob Erickson
              </Link>
            </div>

            {/* Center - Navigation Links */}
            <div className="tw-hidden md:tw-block">
              <div className="tw-flex tw-items-center tw-justify-center tw-space-x-8">
                <Link
                  href="/"
                  className={`tw-text-sm tw-font-medium ${
                    pathname === "/"
                      ? "tw-text-blue-600 dark:tw-text-blue-400"
                      : "tw-text-gray-700 hover:tw-text-gray-900 dark:tw-text-gray-200 dark:hover:tw-text-gray-100"
                  }`}
                >
                  Home
                </Link>

                <Link
                  href="/form"
                  className={`tw-text-sm tw-font-medium ${
                    pathname === "/form"
                      ? "tw-text-blue-600 dark:tw-text-blue-400"
                      : "tw-text-gray-700 hover:tw-text-gray-900 dark:tw-text-gray-200 dark:hover:tw-text-gray-100"
                  }`}
                >
                  Form
                </Link>
                <Link
                  href="/url-shortener"
                  className={`tw-text-sm tw-font-medium ${
                    pathname === "/url-shortener"
                      ? "tw-text-blue-600 dark:tw-text-blue-400"
                      : "tw-text-gray-700 hover:tw-text-gray-900 dark:tw-text-gray-200 dark:hover:tw-text-gray-100"
                  }`}
                >
                  URL Shortener
                </Link>
              </div>
            </div>

            {/* Right - Theme toggle and Mobile menu button */}
            <div className="tw-flex tw-items-center tw-space-x-2">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Mobile menu button */}
              <div className="tw-flex md:tw-hidden">
                <button
                  type="button"
                  className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-p-2 tw-text-gray-700 hover:tw-bg-gray-100 hover:tw-text-gray-900 dark:tw-text-gray-200 dark:hover:tw-bg-gray-800 dark:hover:tw-text-gray-100"
                  onClick={toggleMobileMenu}
                >
                <span className="tw-sr-only">
                  {mobileMenuOpen ? "Close main menu" : "Open main menu"}
                </span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="tw-h-6 tw-w-6" />
                ) : (
                  <Bars3Icon className="tw-h-6 tw-w-6" />
                )}
              </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:tw-hidden">
              <div className="tw-space-y-1 tw-pb-3 tw-pt-2">
                <Link
                  href="/"
                  className={`tw-block tw-px-3 tw-py-2 tw-text-base tw-font-medium ${
                    pathname === "/"
                      ? "tw-bg-blue-50 tw-text-blue-600 dark:tw-bg-blue-900/20 dark:tw-text-blue-400"
                      : "tw-text-gray-700 hover:tw-bg-gray-50 hover:tw-text-gray-900 dark:tw-text-gray-200 dark:hover:tw-bg-gray-800 dark:hover:tw-text-gray-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>

                <Link
                  href="/form"
                  className={`tw-block tw-px-3 tw-py-2 tw-text-base tw-font-medium ${
                    pathname === "/form"
                      ? "tw-bg-blue-50 tw-text-blue-600 dark:tw-bg-blue-900/20 dark:tw-text-blue-400"
                      : "tw-text-gray-700 hover:tw-bg-gray-50 hover:tw-text-gray-900 dark:tw-text-gray-200 dark:hover:tw-bg-gray-800 dark:hover:tw-text-gray-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Form
                </Link>
                <Link
                  href="/url-shortener"
                  className={`tw-block tw-px-3 tw-py-2 tw-text-base tw-font-medium ${
                    pathname === "/url-shortener"
                      ? "tw-bg-blue-50 tw-text-blue-600 dark:tw-bg-blue-900/20 dark:tw-text-blue-400"
                      : "tw-text-gray-700 hover:tw-bg-gray-50 hover:tw-text-gray-900 dark:tw-text-gray-200 dark:hover:tw-bg-gray-800 dark:hover:tw-text-gray-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  URL Shortener
                </Link>
              </div>
            </div>
          )}
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
