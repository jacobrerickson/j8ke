'use client';

import Link from 'next/link';

export function Navbar() {

    return (
        <nav className="tw-fixed tw-top-0 tw-left-0 tw-right-0 tw-h-navbar tw-bg-white tw-border-b tw-border-gray-200 tw-z-navbar">
            <div className="tw-h-full tw-max-w-7xl tw-mx-auto tw-px-4 tw-flex tw-items-center tw-justify-between">
                <Link href="/" className="tw-text-xl tw-font-bold">
                    App Template
                </Link>

                <div className="tw-flex tw-items-center tw-space-x-4">
                    {true ? (
                        <>
                            <Link
                                href="/app/dashboard"
                                className="tw-rounded-lg tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-gray-700 hover:tw-bg-gray-50"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={() => { }}
                                className="tw-text-gray-600 hover:tw-text-gray-900 tw-text-sm tw-font-medium"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/auth/login"
                                className="tw-text-gray-600 hover:tw-text-gray-900 tw-text-sm tw-font-medium"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/auth/register"
                                className="tw-bg-black tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-text-sm tw-font-medium hover:tw-bg-gray-800"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
} 