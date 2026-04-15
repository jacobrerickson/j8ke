"use client";

import { useState, useEffect } from "react";
import { CsvUploader } from "@/components/strong/CsvUploader";
import { StrongDashboard } from "@/components/strong/StrongDashboard";
import {
  saveWorkoutData,
  loadWorkoutData,
  clearWorkoutData,
} from "@/lib/strong/storage";
import type { StrongSetRow } from "@/lib/strong/types";

export default function StrongPage() {
  const [rawRows, setRawRows] = useState<StrongSetRow[] | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const cached = loadWorkoutData();
    if (cached) setRawRows(cached);
    setLoaded(true);
  }, []);

  const handleDataLoaded = (rows: StrongSetRow[]) => {
    setRawRows(rows);
    saveWorkoutData(rows);
  };

  const handleClear = () => {
    clearWorkoutData();
    setRawRows(null);
  };

  if (!loaded) {
    return (
      <div className="tw-min-h-screen tw-bg-gray-50 dark:tw-bg-gray-900 tw-flex tw-items-center tw-justify-center">
        <div className="tw-animate-pulse tw-text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="tw-min-h-screen tw-bg-gray-50 dark:tw-bg-gray-900 tw-py-12">
      <div className="tw-container tw-mx-auto tw-px-4 tw-max-w-7xl">
        {rawRows ? (
          <StrongDashboard
            rawRows={rawRows}
            onClear={handleClear}
            onNewUpload={handleDataLoaded}
          />
        ) : (
          <div className="tw-max-w-2xl tw-mx-auto">
            <div className="tw-text-center tw-mb-12">
              <h1 className="tw-text-4xl tw-font-bold tw-text-gray-900 dark:tw-text-gray-100 tw-mb-4">
                Strong Workout Analytics
              </h1>
              <p className="tw-text-lg tw-text-gray-600 dark:tw-text-gray-300">
                Upload your Strong app CSV export to visualize your workout
                progress, track personal records, and analyze training patterns.
              </p>
            </div>
            <CsvUploader onDataLoaded={handleDataLoaded} />
            <p className="tw-text-center tw-text-xs tw-text-gray-400 dark:tw-text-gray-500 tw-mt-6">
              Your data stays in your browser. Nothing is uploaded to any server.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
