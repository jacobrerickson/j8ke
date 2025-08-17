import { JobStatus } from "../models/job";
import { createAndQueueInternetSearch, updateJobInMongo, getJobFromMongo, getInternetSearchHistoryFromMongo } from "../utils/redis";

export const queueInternetSearch = async ({ query, userId }: { query: string, userId: string }) => {
    return createAndQueueInternetSearch(query, userId);
};

export const updateJob = async ({ jobId, status, result, error }: {
    jobId: string;
    status: JobStatus;
    result?: { response: string };
    error?: { message: string; type: string };
}) => {
    return updateJobInMongo({ jobId, status, result, error });
};

export const getJob = async ({ jobId, userId }: { jobId: string; userId: string }) => {
    return getJobFromMongo(jobId, userId);
};

export const getInternetSearchHistory = async ({ userId }: { userId: string }) => {
    return getInternetSearchHistoryFromMongo(userId);
}; 