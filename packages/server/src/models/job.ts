import { Schema, model, Document } from "mongoose";


export enum JobStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

export enum JobType {
    INTERNET_SEARCH = "internet_search"
}

// Document interface - internal MongoDB type
export interface JobDocument extends Document {
    _id: string;
    queueId: string;
    type: JobType;
    status: JobStatus;
    data?: {
        query: string;
    };
    result?: string;
    error?: string;
    userId: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    toClient(): Job;
}

// Client interface - what gets sent to the client
export interface Job {
    id: string;
    queueId: string;
    type: JobType;
    status: JobStatus;
    data?: {
        query: string;
    };
    result?: string;
    error?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

const jobSchema = new Schema<JobDocument>(
    {
        queueId: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(JobType),
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(JobStatus),
            required: true,
            default: JobStatus.PENDING,
        },
        data: {
            query: {
                type: String,
                required: true,
            }
        },
        result: {
            type: String,
            required: false,
        },
        error: {
            type: String,
            required: false,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
    },
    { timestamps: true }
);

// Add toClient method to transform document to client format
jobSchema.methods.toClient = function (): Job {
    return {
        id: this._id.toString(),
        queueId: this.queueId,
        type: this.type,
        status: this.status,
        data: this.data,
        result: this.result,
        error: this.error,
        userId: this.userId.toString(),
        createdAt: this.createdAt.toISOString(),
        updatedAt: this.updatedAt.toISOString(),
    };
};

// Add index for faster querying
jobSchema.index({ userId: 1, status: 1 });

const JobModel = model("Jobs", jobSchema);
export default JobModel;