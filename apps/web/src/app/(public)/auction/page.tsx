"use client";

import dynamic from "next/dynamic";

// Client-only: reads localStorage and renders randomized embers, so we skip SSR
// to avoid hydration mismatches.
const AuctionBoard = dynamic(() => import("@/components/auction/AuctionBoard"), {
  ssr: false,
  loading: () => (
    <div className="tw-flex tw-min-h-screen tw-items-center tw-justify-center tw-bg-[#0a0500] tw-text-orange-300">
      Lighting the fire… 🔥
    </div>
  ),
});

export default function AuctionPage() {
  return <AuctionBoard />;
}
