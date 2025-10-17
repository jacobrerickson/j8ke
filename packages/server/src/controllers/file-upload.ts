import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { File } from "formidable";

import { UrlMappingModel } from "../models/url-mapping";

export interface FileUploadResult {
  success: boolean;
  fileId: string;
  originalName: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  message?: string;
}

export interface FileProcessResult {
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

// Upload directory configuration
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const PROCESSED_DIR = path.join(process.cwd(), "processed");

// Ensure directories exist
const ensureDirectories = async (): Promise<void> => {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.mkdir(PROCESSED_DIR, { recursive: true });
  } catch (error) {
    console.error("Error creating directories:", error);
  }
};

// Initialize directories on module load
void ensureDirectories();

export const uploadFileFromBase64 = async (input: {
  fileName: string;
  fileSize: number;
  mimeType: string;
  base64Data: string;
}): Promise<FileUploadResult> => {
  try {
    const { fileName, fileSize, mimeType, base64Data } = input;

    // Validate file type - only accept HTML files
    const allowedMimeTypes = ["text/html", "application/xhtml+xml"];
    const fileExtension = path.extname(fileName).toLowerCase();

    if (
      !allowedMimeTypes.includes(mimeType) &&
      fileExtension !== ".html" &&
      fileExtension !== ".htm"
    ) {
      return {
        success: false,
        fileId: "",
        originalName: "",
        fileName: "",
        filePath: "",
        fileSize: 0,
        mimeType: "",
        message: "Only HTML files are supported for URL shortening",
      };
    }

    // Generate unique file ID and name
    const fileId = randomUUID();
    const processedFileName = `${fileId}.html`;
    const filePath = path.join(UPLOAD_DIR, processedFileName);

    // Convert base64 to buffer and write to file
    const buffer = Buffer.from(base64Data, "base64");
    await fs.writeFile(filePath, buffer);

    return {
      success: true,
      fileId,
      originalName: fileName,
      fileName: processedFileName,
      filePath,
      fileSize,
      mimeType: mimeType || "text/html",
      message: "HTML file uploaded successfully",
    };
  } catch (error) {
    console.error("File upload error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      fileId: "",
      originalName: "",
      fileName: "",
      filePath: "",
      fileSize: 0,
      mimeType: "",
      message: `Upload failed: ${errorMessage}`,
    };
  }
};

export const uploadFile = async (
  files: Record<string, File | File[]>,
): Promise<FileUploadResult> => {
  try {
    const file = files.file;

    if (!file || Array.isArray(file)) {
      return {
        success: false,
        fileId: "",
        originalName: "",
        fileName: "",
        filePath: "",
        fileSize: 0,
        mimeType: "",
        message: "No file provided or multiple files not supported",
      };
    }

    // Validate file type - only accept HTML files
    const allowedMimeTypes = ["text/html", "application/xhtml+xml"];
    const fileExtension = path
      .extname(file.originalFilename ?? "")
      .toLowerCase();

    if (
      !allowedMimeTypes.includes(file.mimetype ?? "") &&
      fileExtension !== ".html" &&
      fileExtension !== ".htm"
    ) {
      return {
        success: false,
        fileId: "",
        originalName: "",
        fileName: "",
        filePath: "",
        fileSize: 0,
        mimeType: "",
        message: "Only HTML files are supported for URL shortening",
      };
    }

    // Generate unique file ID and name
    const fileId = randomUUID();
    const fileName = `${fileId}.html`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Move file to upload directory
    if (file.filepath) {
      await fs.rename(file.filepath, filePath);
    } else {
      throw new Error("File path is missing");
    }

    return {
      success: true,
      fileId,
      originalName: file.originalFilename ?? "unknown",
      fileName,
      filePath,
      fileSize: file.size,
      mimeType: file.mimetype ?? "text/html",
      message: "HTML file uploaded successfully",
    };
  } catch (error) {
    console.error("File upload error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      fileId: "",
      originalName: "",
      fileName: "",
      filePath: "",
      fileSize: 0,
      mimeType: "",
      message: `Upload failed: ${errorMessage}`,
    };
  }
};

// Database-based URL mapping functions
const findShortCodeByUrl = async (url: string): Promise<string | null> => {
  try {
    const mapping = await UrlMappingModel.findOne({ originalUrl: url });
    return mapping ? mapping.shortCode : null;
  } catch (error) {
    console.error("Error finding short code by URL:", error);
    return null;
  }
};

const createUrlMapping = async (
  shortCode: string,
  originalUrl: string,
): Promise<void> => {
  try {
    await UrlMappingModel.create({
      shortCode,
      originalUrl,
      clickCount: 0,
    });
  } catch (error) {
    console.error("Error creating URL mapping:", error);
    throw error;
  }
};

// URL shortening service - creates working shortened URLs using database
const shortenUrl = async (url: string): Promise<string> => {
  console.log('Shortening URL:', url);
  const crypto = await import("crypto");
  const hash = crypto
    .createHash("md5")
    .update(url)
    .digest("hex")
    .substring(0, 8);

  // Check if this URL is already shortened
  const existingShortCode = await findShortCodeByUrl(url);
  if (existingShortCode) {
    return `${process.env.SERVER_URL ?? "http://localhost:3000"}/s/${existingShortCode}`;
  }

  // Create new shortened URL
  const shortCode = hash;
  await createUrlMapping(shortCode, url);

  return `${process.env.SERVER_URL ?? "http://localhost:3000"}/s/${shortCode}`;
};

// Calculate space savings from URL shortening
const calculateSpaceSavings = (
  originalUrls: string[],
  shortenedUrls: string[],
) => {
  const originalSize = originalUrls.reduce((total, url) => total + url.length, 0);
  const shortenedSize = shortenedUrls.reduce(
    (total, url) => total + url.length,
    0,
  );
  const savedBytes = originalSize - shortenedSize;
  const savedPercentage = originalSize > 0 ? (savedBytes / originalSize) * 100 : 0;

  // Debug logging for production issues
  console.log('Space Savings Calculation:', {
    originalUrls: originalUrls.slice(0, 3), // Log first 3 URLs for debugging
    shortenedUrls: shortenedUrls.slice(0, 3),
    originalSize,
    shortenedSize,
    savedBytes,
    savedPercentage,
    serverUrl: process.env.SERVER_URL
  });

  return {
    originalSize,
    shortenedSize,
    savedBytes,
    savedPercentage: Math.round(savedPercentage * 100) / 100, // Round to 2 decimal places
  };
};

// Extract URLs from HTML content
const extractUrlsFromHtml = (htmlContent: string): string[] => {
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;
  const urls = htmlContent.match(urlRegex) ?? [];

  // Remove duplicates and filter out common non-content URLs
  const uniqueUrls = [...new Set(urls)].filter((url) => {
    // Filter out common non-content URLs
    const excludePatterns = [
      /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i,
      /googleapis\.com/i,
      /fonts\.googleapis\.com/i,
      /cdn\./i,
      /static\./i,
    ];

    return !excludePatterns.some((pattern) => pattern.test(url));
  });

  return uniqueUrls;
};

export const processFile = async (input: {
  fileId: string;
}): Promise<FileProcessResult> => {
  try {
    const { fileId } = input;

    // Find the uploaded file
    const files = await fs.readdir(UPLOAD_DIR);
    const uploadedFile = files.find((f) => f.startsWith(fileId));

    if (!uploadedFile) {
      return {
        success: false,
        fileId,
        processedFilePath: "",
        downloadUrl: "",
        originalUrls: [],
        shortenedUrls: [],
        message: "File not found",
      };
    }

    const sourcePath = path.join(UPLOAD_DIR, uploadedFile);
    const processedFileName = `${fileId}_processed.html`;
    const processedFilePath = path.join(PROCESSED_DIR, processedFileName);

    // Read the HTML file
    console.log('Processing file:', sourcePath);
    const htmlContent = await fs.readFile(sourcePath, "utf-8");

    // Extract URLs from the HTML
    console.log('Extracting URLs from HTML...');
    const originalUrls = extractUrlsFromHtml(htmlContent);
    console.log('Number of original URLs:', originalUrls.length);

    if (originalUrls.length === 0) {
      // Generate download URL with full server URL
      const serverUrl =
        process.env.SERVER_URL ??
        `http://localhost:${process.env.PORT ?? 3000}`;
      const downloadUrl = `${serverUrl}/api/files/download/${uploadedFile}`;

      return {
        success: true,
        fileId,
        processedFilePath: sourcePath, // No processing needed
        downloadUrl,
        originalUrls: [],
        shortenedUrls: [],
        spaceSavings: {
          originalSize: 0,
          shortenedSize: 0,
          savedBytes: 0,
          savedPercentage: 0,
        },
        message: "No URLs found in HTML file",
      };
    }

    // Shorten URLs
    console.log('Shortening URLs...');
    const shortenedUrls: string[] = [];
    for (const url of originalUrls) {
      const shortened = await shortenUrl(url);
      shortenedUrls.push(shortened);
    }

    // Replace URLs in HTML content
    console.log('Replacing URLs in HTML...');
    let processedContent = htmlContent;
    for (let i = 0; i < originalUrls.length; i++) {
      const originalUrl = originalUrls[i];
      const shortenedUrl = shortenedUrls[i];
      if (originalUrl && shortenedUrl) {
        processedContent = processedContent.replace(
          new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
          shortenedUrl,
        );
      }
    }

    // Write processed content to new file
    console.log('Writing processed content to new file...');
    await fs.writeFile(processedFilePath, processedContent, "utf-8");

    // Calculate space savings
    console.log('Calculating space savings...');
    const spaceSavings = calculateSpaceSavings(originalUrls, shortenedUrls);

    // Generate download URL with full server URL
    const serverUrl =
      process.env.SERVER_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
    const downloadUrl = `${serverUrl}/api/files/download/${processedFileName}`;

    return {
      success: true,
      fileId,
      processedFilePath,
      downloadUrl,
      originalUrls,
      shortenedUrls,
      spaceSavings,
      message: `Successfully shortened ${originalUrls.length} URLs`,
    };
  } catch (error) {
    console.error("File processing error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      fileId: input.fileId,
      processedFilePath: "",
      downloadUrl: "",
      originalUrls: [],
      shortenedUrls: [],
      message: `Processing failed: ${errorMessage}`,
    };
  }
};
