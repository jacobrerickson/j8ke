"use client";

import { useCallback, useRef, useState } from "react";
import { processFileOnServer, uploadFileToServer } from "@/lib/file-upload";
import Arkanoid from "./Arkanoid";
import {
  CheckCircleIcon,
  CloudArrowUpIcon
} from "@heroicons/react/24/outline";
import {
  XCircleIcon as XCircleIconSolid,
  CheckCircleIcon as CheckCircleIconSolid
} from "@heroicons/react/24/solid";

interface FileProcessResult {
  success: boolean;
  fileId: string;
  processedFilePath: string;
  downloadUrl: string;
  originalUrls: string[];
  shortenedUrls: string[];
  spaceSavings?: {
    originalSize: number;
    shortenedSize: number;
    savedBytes: number;
    savedPercentage: number;
  };
  message?: string;
}

interface FileUploadProps {
  onUploadSuccess?: (result: FileProcessResult) => void;
  onUploadError?: (error: string) => void;
  maxFileSize?: number; // in MB
  className?: string;
}

interface UploadState {
  isUploading: boolean;
  isProcessing: boolean;
  uploadProgress: number;
  error: string | null;
  success: boolean;
  fileId: string | null;
  downloadUrl: string | null;
  originalUrls: string[];
  shortenedUrls: string[];
  originalFileSize: number | null;
  spaceSavings?: {
    originalSize: number;
    shortenedSize: number;
    savedBytes: number;
    savedPercentage: number;
  };
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }
};

export const FileUpload = ({
  onUploadSuccess,
  onUploadError,
  maxFileSize = 10, // 10MB default
  className = "",
}: FileUploadProps) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    isProcessing: false,
    uploadProgress: 0,
    error: null,
    success: false,
    fileId: null,
    downloadUrl: null,
    originalUrls: [],
    shortenedUrls: [],
    originalFileSize: null,
    spaceSavings: undefined,
  });

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userWantsToPlayGame, setUserWantsToPlayGame] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxFileSize * 1024 * 1024) {
        return `File size must be less than ${maxFileSize}MB`;
      }

      // Only accept HTML files
      const allowedTypes = ["text/html", "application/xhtml+xml"];
      const allowedExtensions = [".html", ".htm"];
      const fileExtension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf("."));

      if (
        !allowedTypes.includes(file.type) &&
        !allowedExtensions.includes(fileExtension)
      ) {
        return "Only HTML files are supported for URL shortening";
      }

      return null;
    },
    [maxFileSize],
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setUploadState((prev) => ({ ...prev, error: validationError }));
        onUploadError?.(validationError);
        return;
      }

      setSelectedFile(file);
      setUploadState((prev) => ({ ...prev, error: null, originalFileSize: file.size }));
    },
    [validateFile, onUploadError],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    },
    [handleFileSelect],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelect(e.target.files[0]);
      }
    },
    [handleFileSelect],
  );

  const uploadFile = async () => {
    if (!selectedFile) return;

    setUploadState((prev) => ({ ...prev, isUploading: true, error: null }));

    try {
      // Upload file to server
      const uploadResult = await uploadFileToServer(selectedFile);

      if (uploadResult.success) {
        setUploadState((prev) => ({
          ...prev,
          isUploading: false,
          success: true,
          fileId: uploadResult.fileId,
        }));

        // Process the file
        setUploadState((prev) => ({ ...prev, isProcessing: true }));

        const processResult = await processFileOnServer(uploadResult.fileId);

        if (processResult.success) {
          setUploadState((prev) => ({
            ...prev,
            isProcessing: false,
            downloadUrl: processResult.downloadUrl,
            originalUrls: processResult.originalUrls,
            shortenedUrls: processResult.shortenedUrls,
            spaceSavings: processResult.spaceSavings,
          }));
          onUploadSuccess?.(processResult);
        } else {
          throw new Error(processResult.message || "Processing failed");
        }
      } else {
        throw new Error(uploadResult.message || "Upload failed");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setUploadState((prev) => ({
        ...prev,
        isUploading: false,
        isProcessing: false,
        error: errorMessage,
      }));
      onUploadError?.(errorMessage);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadState({
      isUploading: false,
      isProcessing: false,
      uploadProgress: 0,
      error: null,
      success: false,
      fileId: null,
      downloadUrl: null,
      originalUrls: [],
      shortenedUrls: [],
      originalFileSize: null,
      spaceSavings: undefined,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Check if file is larger than 1MB (1000KB)
  const isLargeFile = selectedFile && selectedFile.size > 500 * 1024;
  const isProcessing = uploadState.isUploading || uploadState.isProcessing;
  const showGamePrompt = isProcessing && isLargeFile && !userWantsToPlayGame;
  const showArkanoidGame = isProcessing && isLargeFile && userWantsToPlayGame;

  return (
    <div className={`tw-w-full tw-max-w-2xl tw-mx-auto ${className}`}>


      {/* Upload Area */}
      <div
        className={`
          tw-relative tw-border-2 tw-border-dashed tw-rounded-lg tw-p-8 tw-text-center tw-transition-colors
          ${
            dragActive
              ? "tw-border-blue-500 tw-bg-blue-50 dark:tw-bg-blue-900/20"
              : "tw-border-gray-300 hover:tw-border-gray-400 dark:tw-border-gray-600 dark:hover:tw-border-gray-500"
          }
          ${
            uploadState.isUploading || uploadState.isProcessing
              ? "tw-pointer-events-none tw-opacity-50"
              : "tw-cursor-pointer"
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="tw-hidden"
          onChange={handleFileInputChange}
          accept=".html,.htm,text/html"
        />

        {uploadState.isUploading || uploadState.isProcessing ? (
          <div className="tw-flex tw-flex-col tw-items-center tw-space-y-4">
            <div className="tw-animate-spin tw-rounded-full tw-h-12 tw-w-12 tw-border-b-2 tw-border-blue-500"></div>
            <p className="tw-text-lg tw-font-medium">
              {uploadState.isUploading ? "Uploading..." : "Processing..."}
            </p>
          </div>
        ) : selectedFile ? (
          <div className="tw-space-y-4">
            <div className="tw-flex tw-items-center tw-justify-center tw-space-x-2">
              <CheckCircleIcon className="tw-w-8 tw-h-8 tw-text-green-500" />
              <span className="tw-text-lg tw-font-medium tw-text-green-600">
                {selectedFile.name}
              </span>
            </div>
            <p className="tw-text-sm tw-text-gray-500">
              {formatFileSize(selectedFile.size)}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                uploadFile();
              }}
              className="tw-bg-blue-500 hover:tw-bg-blue-600 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 tw-text-white tw-px-6 tw-py-2 tw-rounded-md tw-transition-colors"
            >
              Shorten URLs in HTML
            </button>
          </div>
        ) : (
          <div className="tw-space-y-4">
            <CloudArrowUpIcon className="tw-mx-auto tw-h-12 tw-w-12 tw-text-gray-400 dark:tw-text-gray-500" />
            <div>
              <p className="tw-text-lg tw-font-medium tw-text-gray-900 dark:tw-text-gray-100">
                Drop your HTML file here, or click to browse
              </p>
              <p className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400 tw-mt-2">
                Max file size: {maxFileSize}MB
              </p>
              <p className="tw-text-xs tw-text-gray-400 dark:tw-text-gray-500 tw-mt-1">
                Only HTML files (.html, .htm) are supported
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Game Prompt for Large Files */}
      {showGamePrompt && (
        <div className="tw-mt-6 tw-p-6 tw-bg-blue-50 dark:tw-bg-blue-900/20 tw-border tw-border-blue-200 dark:tw-border-blue-800 tw-rounded-lg tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center">
          <p className="tw-text-lg tw-font-medium tw-text-blue-900 dark:tw-text-blue-200 tw-mb-4">
            This may take a while. Would you like to play a game while we process?
          </p>
          <div className="tw-flex tw-gap-3">
            <button
              onClick={() => setUserWantsToPlayGame(true)}
              className="tw-px-6 tw-py-2 tw-bg-green-500 hover:tw-bg-green-600 dark:tw-bg-green-600 dark:hover:tw-bg-green-700 tw-text-white tw-rounded-md tw-font-semibold tw-transition-colors"
            >
              Yes, Let&apos;s Play!
            </button>
            <button
              onClick={() => setUserWantsToPlayGame(false)}
              className="tw-px-6 tw-py-2 tw-bg-gray-500 hover:tw-bg-gray-600 dark:tw-bg-gray-600 dark:hover:tw-bg-gray-700 tw-text-white tw-rounded-md tw-font-semibold tw-transition-colors"
            >
              No Thanks
            </button>
          </div>
        </div>
      )}

      {/* Arkanoid Game for Large Files */}
      {showArkanoidGame && (
        <div className="tw-mt-6 tw-p-4 tw-rounded-lg tw-flex tw-flex-col tw-items-center tw-justify-center">
          <p className="tw-text-white tw-mb-4 tw-text-center tw-text-sm">
            Processing your file... Enjoy the game!
          </p>
          <Arkanoid />
        </div>
      )}

      {/* Status Messages */}
      {uploadState.error && (
        <div className="tw-mt-4 tw-p-4 tw-bg-red-50 dark:tw-bg-red-900/20 tw-border tw-border-red-200 dark:tw-border-red-800 tw-rounded-md">
          <div className="tw-flex">
            <XCircleIconSolid className="tw-w-5 tw-h-5 tw-text-red-400" />
            <div className="tw-ml-3">
              <p className="tw-text-sm tw-text-red-800 dark:tw-text-red-200">{uploadState.error}</p>
            </div>
          </div>
        </div>
      )}

      {uploadState.success && uploadState.downloadUrl && (
        <div className="tw-mt-4 tw-space-y-4">
          <div className="tw-p-4 tw-bg-green-50 dark:tw-bg-green-900/20 tw-border tw-border-green-200 dark:tw-border-green-800 tw-rounded-md">
            <div className="tw-flex tw-items-center tw-justify-between">
              <div className="tw-flex">
                <CheckCircleIconSolid className="tw-w-5 tw-h-5 tw-text-green-400" />
                <div className="tw-ml-3">
                  <p className="tw-text-sm tw-text-green-800 dark:tw-text-green-200">
                    HTML processed successfully!
                  </p>
                </div>
              </div>
              <div className="tw-flex tw-space-x-2">
                <a
                  href={uploadState.downloadUrl}
                  download
                  className="tw-bg-green-500 hover:tw-bg-green-600 tw-text-white tw-px-3 tw-py-1 tw-rounded tw-text-sm tw-transition-colors"
                >
                  Download
                </a>
                <button
                  onClick={resetUpload}
                  className="tw-bg-gray-500 hover:tw-bg-gray-600 dark:tw-bg-gray-600 dark:hover:tw-bg-gray-700 tw-text-white tw-px-3 tw-py-1 tw-rounded tw-text-sm tw-transition-colors"
                >
                  Upload Another
                </button>
              </div>
            </div>
          </div>

          {/* URL Shortening Results */}
          {uploadState.originalUrls && uploadState.originalUrls.length > 0 && (
            <div className="tw-space-y-4">
              <div className="tw-p-4 tw-bg-blue-50 dark:tw-bg-blue-900/20 tw-border tw-border-blue-200 dark:tw-border-blue-800 tw-rounded-md">
                <h3 className="tw-text-lg tw-font-medium tw-text-blue-900 dark:tw-text-blue-200 tw-mb-3">
                  URL Shortening Results
                </h3>
                <div className="tw-space-y-2">
                  {uploadState.originalUrls.map((originalUrl, index) => (
                    <div
                      key={index}
                      className="tw-flex tw-items-center tw-space-x-2 tw-text-sm"
                    >
                      <span className="tw-text-gray-600 tw-truncate tw-flex-1">
                        {originalUrl}
                      </span>
                      <span className="tw-text-gray-400">→</span>
                      <span className="tw-text-blue-600 tw-font-medium">
                        {uploadState.shortenedUrls?.[index] || "Processing..."}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Space Savings */}
              {uploadState.spaceSavings && (
                <div
                  className={`tw-p-4 tw-border tw-rounded-md ${
                    uploadState.spaceSavings.savedBytes > 0
                      ? "tw-bg-purple-50 dark:tw-bg-purple-900/20 tw-border-purple-200 dark:tw-border-purple-800"
                      : "tw-bg-yellow-50 dark:tw-bg-yellow-900/20 tw-border-yellow-200 dark:tw-border-yellow-800"
                  }`}
                >
                  <h3
                    className={`tw-text-lg tw-font-medium tw-mb-3 ${
                      uploadState.spaceSavings.savedBytes > 0
                        ? "tw-text-purple-900 dark:tw-text-purple-200"
                        : "tw-text-yellow-900 dark:tw-text-yellow-200"
                    }`}
                  >
                    {uploadState.spaceSavings.savedBytes > 0
                      ? "Space Savings"
                      : "URL Analysis"}
                  </h3>
                  <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-text-sm">
                    <div>
                      <span className="tw-text-gray-600">
                        Original URLs size:
                      </span>
                      <span className="tw-ml-2 tw-font-medium">
                        {formatFileSize(uploadState.spaceSavings.originalSize)}
                      </span>
                    </div>
                    <div>
                      <span className="tw-text-gray-600">
                        Shortened URLs size:
                      </span>
                      <span className="tw-ml-2 tw-font-medium">
                        {formatFileSize(uploadState.spaceSavings.shortenedSize)}
                      </span>
                    </div>
                    <div>
                      <span className="tw-text-gray-600">
                        {uploadState.spaceSavings.savedBytes > 0
                          ? "Space saved:"
                          : "Space difference:"}
                      </span>
                      <span
                        className={`tw-ml-2 tw-font-medium ${
                          uploadState.spaceSavings.savedBytes > 0
                            ? "tw-text-purple-600"
                            : uploadState.spaceSavings.savedBytes < 0
                              ? "tw-text-red-600"
                              : "tw-text-gray-600"
                        }`}
                      >
                        {formatFileSize(uploadState.spaceSavings.savedBytes)}
                      </span>
                    </div>
                    <div>
                      <span className="tw-text-gray-600">
                        New File Size:
                      </span>
                      <span
                        className={`tw-ml-2 tw-font-medium ${
                          uploadState.spaceSavings.savedBytes > 0
                            ? "tw-text-purple-600"
                            : uploadState.spaceSavings.savedBytes < 0
                              ? "tw-text-red-600"
                              : "tw-text-gray-600"
                        }`}
                      >
                        {uploadState.originalFileSize !== null
                          ? formatFileSize(uploadState.originalFileSize - uploadState.spaceSavings.savedBytes)
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  {uploadState.spaceSavings.savedBytes <= 0 && (
                    <div className="tw-mt-3 tw-text-xs tw-text-yellow-700">
                      <p>
                        💡 The shortened URLs are not saving space because the
                        domain name is longer than the original URLs. This is
                        common with longer domain names in production
                        environments.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
