"use client";

import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="tw-flex tw-min-h-screen tw-bg-white">
            {/* Left side - Auth content */}
            <div className="tw-flex tw-w-full tw-flex-1 tw-flex-col tw-justify-center tw-bg-white tw-px-4 sm:tw-px-6 lg:tw-flex-none lg:tw-w-[480px] xl:tw-px-12">
                <div className="tw-mx-auto tw-w-full">
                    <div className="tw-mb-8">
                        <Link href="/" className="tw-flex tw-items-center">
                            <span className="tw-text-2xl tw-font-semibold tw-text-blue-600">Template</span>
                        </Link>
                    </div>
                    {children}
                </div>
            </div>

            {/* Right side - Background image */}
            <div className="tw-relative tw-hidden tw-flex-1 lg:tw-block">
                <div className="tw-absolute tw-inset-0 tw-bg-white/80"></div>
                <Image
                    className="tw-absolute tw-inset-0 tw-object-cover"
                    src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=3000&auto=format&fit=crop"
                    alt="Authentication background"
                    fill
                    priority
                    sizes="(max-width: 1023px): 0px, 100vw"
                />
            </div>
        </div>
    );
}