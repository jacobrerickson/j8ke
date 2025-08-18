"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();


    return (
        <div className="tw-min-h-screen tw-flex tw-flex-col tw-bg-white">
            {/* Navigation */}
            <nav className="tw-border-b tw-border-gray-200 tw-bg-white">
                <div className="tw-mx-auto tw-max-w-7xl tw-px-4 sm:tw-px-6 lg:tw-px-8">
                    <div className="tw-flex tw-h-16 tw-items-center tw-justify-between">
                        {/* Left - Logo */}
                        <div className="tw-flex-shrink-0">
                            <Link href="/" className="tw-text-xl tw-font-semibold tw-text-blue-600">
                                Jacob Erickson
                            </Link>
                        </div>

                        {/* Center - Navigation Links */}
                        <div className="tw-hidden md:tw-block">
                            <div className="tw-flex tw-items-center tw-justify-center tw-space-x-8">
                                <Link
                                    href="/"
                                    className={`tw-text-sm tw-font-medium ${pathname === "/"
                                        ? "tw-text-blue-600"
                                        : "tw-text-gray-700 hover:tw-text-gray-900"
                                        }`}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/about"
                                    className={`tw-text-sm tw-font-medium ${pathname === "/about"
                                        ? "tw-text-blue-600"
                                        : "tw-text-gray-700 hover:tw-text-gray-900"
                                        }`}
                                >
                                    About
                                </Link>
                                <Link
                                    href="/form"
                                    className={`tw-text-sm tw-font-medium ${pathname === "/form"
                                        ? "tw-text-blue-600"
                                        : "tw-text-gray-700 hover:tw-text-gray-900"
                                        }`}
                                >
                                    Form
                                </Link>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="tw-flex md:tw-hidden">
                            <button
                                type="button"
                                className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-md tw-p-2 tw-text-gray-700 hover:tw-bg-gray-100 hover:tw-text-gray-900"
                            >
                                <span className="tw-sr-only">Open main menu</span>
                                <svg
                                    className="tw-h-6 tw-w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main className="tw-flex-grow">{children}</main>

            {/* Footer */}
            <footer className="tw-bg-gray-50 tw-border-t tw-border-gray-200">
                <div className="tw-mx-auto tw-max-w-7xl tw-px-4 tw-py-12 sm:tw-px-6 lg:tw-px-8">
                    <div className="tw-text-center">
                        <p className="tw-text-sm tw-text-gray-500">
                            © {new Date().getFullYear()} Jacob Erickson. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
} 