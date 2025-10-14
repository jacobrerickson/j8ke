import { client } from "./trpc/client";

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

export const uploadFileToServer = async (
  file: File,
): Promise<FileUploadResult> => {
  try {
    // Convert file to base64 for tRPC transmission
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]); // Remove data:type;base64, prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Create upload payload
    const uploadPayload = {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      base64Data: base64,
    };

    // Use tRPC client for upload
    const result = await client.fileUpload.upload.mutate(uploadPayload);
    return result;
  } catch (error) {
    throw new Error(
      `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

export const processFileOnServer = async (
  fileId: string,
): Promise<FileProcessResult> => {
  try {
    // Use tRPC client for processing
    const result = await client.fileUpload.process.mutate({ fileId });
    return result;
  } catch (error) {
    throw new Error(
      `Processing failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
