"use client";

import { useState } from "react";
import { FileUpload } from "@/components/shared/FileUpload";

interface FileProcessResult {
  success: boolean;
  fileId: string;
  processedFilePath: string;
  downloadUrl: string;
  originalUrls: string[];
  shortenedUrls: string[];
  message?: string;
}

export default function UrlShortenerPage() {
  const [uploadResults, setUploadResults] = useState<FileProcessResult[]>([]);

  const handleUploadSuccess = (result: FileProcessResult) => {
    setUploadResults((prev) => [...prev, result]);
  };

  const handleUploadError = (error: string) => {
    console.error("Upload error:", error);
  };

  return (
    <div className="tw-min-h-screen tw-bg-gray-50 tw-py-12">
      <div className="tw-container tw-mx-auto tw-px-4">
        {/* Header */}
        <div className="tw-text-center tw-mb-12">
          <h1 className="tw-text-4xl tw-font-bold tw-text-gray-900 tw-mb-4">
            HTML File URL Shortener
          </h1>
          <p className="tw-text-lg tw-text-gray-600 tw-max-w-3xl tw-mx-auto">
            Upload your HTML files to automatically find and shorten all URLs,
            reducing email size and improving deliverability. Perfect for email
            templates and HTML newsletters.
          </p>
        </div>

        {/* File Upload Component */}
        <div className="tw-mb-12">
          <FileUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            maxFileSize={10}
            className="tw-mb-8"
          />
        </div>
      </div>
    </div>
  );
}
