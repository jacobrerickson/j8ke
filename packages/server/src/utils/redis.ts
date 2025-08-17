import { Queue } from 'bullmq';
import { JobStatus, JobType } from '../models/job';
import { nanoid } from 'nanoid';
import JobModel from '../models/job';
import { TRPCError } from '@trpc/server';

// Define job types
export type AIAgentJobType = 'internet_search' | 'other_future_job_type';


const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || "",
};

const createQueue = (name: string) => {
    return new Queue(name, {
        connection,
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            removeOnComplete: true,
            removeOnFail: false,
        },
    });
};

// AI Agent Queues
export const aiAgentsQueue = createQueue('ai_agents_queue');

/**
 * Creates a new job in MongoDB and queues it in Redis
 * @param query The search query
 * @param userId The ID of the user making the search
 * @returns The created job information
 */
export const createAndQueueInternetSearch = async (query: string, userId: string) => {
    try {
        // Create a new job in MongoDB
        const job = await JobModel.create({
            queueId: nanoid(), // Temporary ID that will be updated with Redis queue ID
            type: JobType.INTERNET_SEARCH,
            status: JobStatus.PENDING,
            data: {
                query,
            },
            userId,
        });

        // Add job to Redis queue
        const queuedJob = await aiAgentsQueue.add('internet_search', {
            query,
            jobId: job._id.toString(),
        });
        job.queueId = queuedJob.id!!;
        await job.save();

        return {
            jobId: job._id.toString(),
            queueId: queuedJob.id,
            status: JobStatus.PENDING,
        };
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to queue internet search",
            cause: error,
        });
    }
};

/**
 * Updates a job's status and result/error in MongoDB
 */
export const updateJobInMongo = async ({
    jobId,
    status,
    result,
    error
}: {
    jobId: string;
    status: JobStatus;
    result?: { response: string };
    error?: { message: string; type: string };
}) => {
    try {
        const job = await JobModel.findById(jobId);

        if (!job) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Job not found",
            });
        }

        const updatedJob = await JobModel.findByIdAndUpdate(
            jobId,
            {
                status,
                ...(result && { result: result.response }),
                ...(error && { error: error.message }),
            },
            { new: true }
        );

        if (!updatedJob) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to update job",
            });
        }

        return updatedJob.toClient();
    } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update job",
            cause: error,
        });
    }
};

/**
 * Fetches a job from MongoDB
 */
export const getJobFromMongo = async (jobId: string, userId: string) => {
    try {
        const job = await JobModel.findOne({ _id: jobId, userId });

        if (!job) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Job not found",
            });
        }

        return job.toClient();
    } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch job",
            cause: error,
        });
    }
};

/**
 * Fetches internet search history from MongoDB
 */
export const getInternetSearchHistoryFromMongo = async (userId: string) => {
    try {
        const jobs = await JobModel.find({
            userId,
            type: JobType.INTERNET_SEARCH,
            status: JobStatus.COMPLETED
        }).sort({ createdAt: -1 }); // Most recent first

        return jobs.map(job => job.toClient());
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch search history",
            cause: error,
        });
    }
}; 