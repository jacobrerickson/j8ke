"use client";

import { useState, useEffect, useCallback } from "react";
import { MagnifyingGlassIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { client } from "@/lib/trpc/client";
import { JobStatus, type Job } from "@repo/server/src/models/job";
import { format } from "date-fns";

export default function InternetSearch() {
    const [query, setQuery] = useState("");
    const [searchResult, setSearchResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [jobId, setJobId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
    const [searchHistory, setSearchHistory] = useState<Job[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        setExpandedResults(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    // Fetch search history
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await client.redis.getInternetSearchHistory.query();
                setSearchHistory(history);
            } catch (error) {
                console.error("Error fetching search history:", error);
            } finally {
                setIsLoadingHistory(false);
            }
        };

        fetchHistory();
    }, []);

    // Poll for job status
    const pollJobStatus = useCallback(async (id: string) => {
        try {
            const job = await client.redis.getJob.query({ jobId: id });
            setJobStatus(job.status as JobStatus);

            if (job.status === JobStatus.COMPLETED && job.result) {
                setSearchResult(job.result);
                setJobId(null); // Clear job ID to stop polling
                setIsLoading(false);
                // Refresh search history
                const history = await client.redis.getInternetSearchHistory.query();
                setSearchHistory(history);
            } else if (job.status === JobStatus.FAILED) {
                setError(job.error || 'Job failed');
                setJobId(null); // Clear job ID to stop polling
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error polling job status:", error);
            setError('Failed to check job status');
            setJobId(null);
            setIsLoading(false);
        }
    }, []);

    // Set up polling when jobId changes
    useEffect(() => {
        if (!jobId) return;

        const pollInterval = setInterval(() => {
            pollJobStatus(jobId);
        }, 2000); // Poll every 2 seconds

        // Initial poll
        pollJobStatus(jobId);

        return () => clearInterval(pollInterval);
    }, [jobId, pollJobStatus]);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        setSearchResult(null);
        setJobStatus(null);

        try {
            // Queue the search job
            const result = await client.redis.queueInternetSearch.mutate({
                query: query.trim(),
                options: {
                    max_results: 10,
                    search_type: 'web'
                }
            });

            if (result.jobId) {
                setJobId(result.jobId);
                setJobStatus(JobStatus.PENDING);
            }
        } catch (error) {
            console.error("Search error:", error);
            setError('Failed to queue search job. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="tw-p-8">
            <div className="tw-max-w-4xl tw-mx-auto">
                <h1 className="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-8">Internet Search</h1>

                {/* Search Box */}
                <div className="tw-flex tw-gap-4 tw-mb-8">
                    <div className="tw-flex-1">
                        <div className="tw-relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                placeholder="Enter your search query..."
                                className="tw-w-full tw-pl-4 tw-pr-10 tw-py-3 tw-border tw-border-gray-300 tw-rounded-lg tw-shadow-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                            />
                            <div className="tw-absolute tw-right-3 tw-top-1/2 tw--translate-y-1/2">
                                {isLoading ? (
                                    <div className="tw-animate-spin tw-h-5 tw-w-5 tw-text-gray-400">
                                        <svg className="tw-h-5 tw-w-5" viewBox="0 0 24 24">
                                            <circle
                                                className="tw-opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            <path
                                                className="tw-opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                    </div>
                                ) : (
                                    <MagnifyingGlassIcon className="tw-h-5 tw-w-5 tw-text-gray-400" />
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={isLoading || !query.trim()}
                        className="tw-px-6 tw-py-3 tw-bg-blue-600 tw-text-white tw-rounded-lg tw-font-medium hover:tw-bg-blue-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
                    >
                        Search
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="tw-mb-8 tw-p-4 tw-bg-red-50 tw-rounded-lg">
                        <p className="tw-text-sm tw-text-red-600">{error}</p>
                    </div>
                )}

                {/* Job Status */}
                {jobStatus && jobStatus !== JobStatus.COMPLETED && !error && (
                    <div className="tw-mb-8 tw-p-4 tw-bg-blue-50 tw-rounded-lg">
                        <p className="tw-text-sm tw-text-blue-700">
                            Search job status: {jobStatus}
                            {jobStatus === JobStatus.PENDING && " (waiting to start)"}
                            {jobStatus === JobStatus.PROCESSING && " (processing your query)"}
                        </p>
                    </div>
                )}

                {/* Current Search Results */}
                {searchResult && (
                    <div className="tw-mt-8">
                        <h2 className="tw-text-xl tw-font-semibold tw-mb-4 tw-text-gray-900">Search Results</h2>
                        <div className="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow">
                            <div className="tw-prose tw-max-w-none tw-text-gray-900">
                                {searchResult.split('\n').map((paragraph, index) => (
                                    <p key={index} className="tw-mb-4">{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Search History */}
                <div className="tw-mt-12">
                    <h2 className="tw-text-xl tw-font-semibold tw-mb-6 tw-text-gray-900">Search History</h2>
                    {isLoadingHistory ? (
                        <div className="tw-flex tw-justify-center tw-items-center tw-p-8">
                            <div className="tw-animate-spin tw-h-8 tw-w-8 tw-text-blue-600">
                                <svg className="tw-h-8 tw-w-8" viewBox="0 0 24 24">
                                    <circle
                                        className="tw-opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="tw-opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            </div>
                        </div>
                    ) : searchHistory.length === 0 ? (
                        <div className="tw-text-center tw-p-8 tw-bg-gray-50 tw-rounded-lg">
                            <p className="tw-text-gray-600">No search history yet</p>
                        </div>
                    ) : (
                        <div className="tw-space-y-4">
                            {searchHistory.map((search) => (
                                <div key={search.id} className="tw-bg-white tw-rounded-lg tw-shadow tw-overflow-hidden">
                                    <div
                                        className="tw-p-4 tw-cursor-pointer hover:tw-bg-gray-50 tw-transition-colors"
                                        onClick={() => toggleExpand(search.id)}
                                    >
                                        <div className="tw-flex tw-justify-between tw-items-center">
                                            <div className="tw-flex-1">
                                                <div className="tw-flex tw-items-center tw-gap-2">
                                                    <h3 className="tw-font-medium tw-text-gray-900">
                                                        {search.data?.query}
                                                    </h3>
                                                    {expandedResults.has(search.id) ? (
                                                        <ChevronUpIcon className="tw-h-5 tw-w-5 tw-text-gray-500" />
                                                    ) : (
                                                        <ChevronDownIcon className="tw-h-5 tw-w-5 tw-text-gray-500" />
                                                    )}
                                                </div>
                                                <p className="tw-text-sm tw-text-gray-500">
                                                    {format(new Date(search.createdAt), "MMM d, yyyy 'at' h:mm a")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={`tw-overflow-hidden tw-transition-all tw-duration-300 tw-ease-in-out ${expandedResults.has(search.id) ? 'tw-max-h-[2000px]' : 'tw-max-h-0'
                                            }`}
                                    >
                                        <div className="tw-border-t tw-border-gray-100 tw-p-4">
                                            <div className="tw-prose tw-max-w-none tw-text-gray-900">
                                                {search.result?.split('\n').map((paragraph: string, index: number) => (
                                                    <p key={index} className="tw-mb-2 last:tw-mb-0">{paragraph}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 