import * as yup from 'yup';
import { JobStatus } from '../models/job';

export const queueInternetSearchSchema = yup.object({
    query: yup.string().required('Search query is required').min(1, 'Query cannot be empty'),
    options: yup.object({
        max_results: yup.number().min(1).max(50).default(10),
        search_type: yup.string().oneOf(['web', 'news', 'images'] as const).default('web')
    }).default(undefined)
}).required();


export const updateJobSchema = yup.object({
    jobId: yup.string().required('Job ID is required'),
    status: yup.string().oneOf(Object.values(JobStatus), 'Invalid job status').required('Status is required'),
    result: yup.string().optional(),
    error: yup.string().optional()
}).required();

export const getJobSchema = yup.object({
    jobId: yup.string().required('Job ID is required'),
}).required();

export type QueueInternetSearchInput = yup.InferType<typeof queueInternetSearchSchema>;
export type UpdateJobInput = yup.InferType<typeof updateJobSchema>;
export type GetJobInput = yup.InferType<typeof getJobSchema>; 