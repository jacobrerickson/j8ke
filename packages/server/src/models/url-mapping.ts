import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

export interface UrlMappingDocument extends Document {
  shortCode: string;
  originalUrl: string;
  createdAt: Date;
  updatedAt: Date;
  clickCount: number;
  lastAccessedAt?: Date;
}

export interface UrlMapping {
  shortCode: string;
  originalUrl: string;
  createdAt: string;
  updatedAt: string;
  clickCount: number;
  lastAccessedAt?: string;
}

const urlMappingSchema = new Schema<UrlMappingDocument>(
  {
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    originalUrl: {
      type: String,
      required: true,
      index: true,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    lastAccessedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster lookups
urlMappingSchema.index({ shortCode: 1 });
urlMappingSchema.index({ originalUrl: 1 });

export const UrlMappingModel = mongoose.model<UrlMappingDocument>(
  "UrlMapping",
  urlMappingSchema,
);
