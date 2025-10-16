import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jacob Erickson",
  description: "Jacob Erickson's Personal Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="tw-h-full">
      <body className={`${inter.className} tw-h-full`}>
        <Providers>
          <Suspense fallback={<div className="tw-flex tw-justify-center tw-items-center tw-min-h-screen">
            <div className="tw-flex tw-flex-col tw-items-center tw-gap-4">
              <div className="tw-animate-spin tw-h-8 tw-w-8 tw-border-4 tw-border-blue-600 tw-border-t-transparent tw-rounded-full"></div>
              <p className="tw-text-gray-600">Loading...</p>
            </div>
          </div>}>
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
