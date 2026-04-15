"use client";

import { useState, useCallback, useRef } from "react";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { parseStrongCsv } from "@/lib/strong/parseStrongCsv";
import type { StrongSetRow } from "@/lib/strong/types";

interface CsvUploaderProps {
  onDataLoaded: (rows: StrongSetRow[]) => void;
  compact?: boolean;
}

export function CsvUploader({ onDataLoaded, compact }: CsvUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".csv")) {
        setError("Please upload a .csv file");
        return;
      }

      setError(null);
      setIsLoading(true);

      try {
        const { rows, errors } = await parseStrongCsv(file);
        if (!rows.length) {
          setError(errors[0] ?? "No valid data found in file");
          return;
        }
        if (errors.length) {
          console.warn("CSV parse warnings:", errors);
        }
        onDataLoaded(rows);
      } catch {
        setError("Failed to parse CSV file");
      } finally {
        setIsLoading(false);
      }
    },
    [onDataLoaded],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  if (compact) {
    return (
      <div className="tw-flex tw-items-center tw-gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="tw-text-sm tw-text-blue-600 dark:tw-text-blue-400 hover:tw-underline"
        >
          Upload new CSV
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={onFileChange}
          className="tw-hidden"
        />
        {error && (
          <span className="tw-text-sm tw-text-red-500">{error}</span>
        )}
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`tw-border-2 tw-border-dashed tw-rounded-xl tw-p-12 tw-text-center tw-cursor-pointer tw-transition-colors ${
        isDragging
          ? "tw-border-blue-500 tw-bg-blue-50 dark:tw-bg-blue-900/20"
          : "tw-border-gray-300 dark:tw-border-gray-600 hover:tw-border-blue-400 dark:hover:tw-border-blue-500 tw-bg-white dark:tw-bg-gray-800"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={onFileChange}
        className="tw-hidden"
      />
      <CloudArrowUpIcon className="tw-w-16 tw-h-16 tw-mx-auto tw-text-gray-400 dark:tw-text-gray-500 tw-mb-4" />
      {isLoading ? (
        <p className="tw-text-lg tw-text-gray-600 dark:tw-text-gray-300">
          Parsing CSV...
        </p>
      ) : (
        <>
          <p className="tw-text-lg tw-font-medium tw-text-gray-700 dark:tw-text-gray-200 tw-mb-2">
            Drop your Strong CSV export here
          </p>
          <p className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">
            or click to browse files
          </p>
        </>
      )}
      {error && (
        <p className="tw-mt-4 tw-text-sm tw-text-red-500 dark:tw-text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
