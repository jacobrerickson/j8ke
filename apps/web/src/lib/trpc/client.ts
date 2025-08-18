import { createTRPCClient, httpLink } from "@trpc/client";
import type { AppRouter } from "@repo/server/src/router";
import { TokensStorage } from "../utils/tokens-storage";

// Environment configuration
const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return 'http://localhost:3000'; // Use the backend server URL
    }
    return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
};

// Token management helper
const getTokens = () => {
    const tokens = TokensStorage.getTokens();
    return {
        access: tokens?.accessToken || '',
        refresh: tokens?.refreshToken || ''
    };
};

// Create tRPC client with automatic token refresh
export const client = createTRPCClient<AppRouter>({
    links: [
        httpLink({
            url: `${getBaseUrl()}/trpc`,
            // Add authorization header to all requests
            headers() {
                return {
                    Authorization: `Bearer ${getTokens().access}`
                };
            },
            // Custom fetch implementation with token refresh
            fetch: async (input, options) => {
                const response = await fetch(input, options);

                // Handle non-200 responses
                if (response.status !== 200) {
                    try {
                        const resp = await response.clone().json();

                        // Handle unauthorized errors (expired token)
                        if (resp.error?.message.includes("Session Expired!")) {
                            const refresh = getTokens().refresh;

                            // Attempt to refresh token
                            const refreshResponse = await fetch(`${getBaseUrl()}/auth.refreshToken`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ refreshToken: refresh })
                            });

                            const refreshData = await refreshResponse.json();

                            // Return original error if refresh fails
                            if (!refreshResponse.ok) return response;

                            // Store new tokens
                            TokensStorage.setTokens(
                                refreshData.result.data.tokens.access,
                                refreshData.result.data.tokens.refresh
                            );

                            // Retry original request with new token
                            return fetch(input, {
                                ...options,
                                headers: {
                                    ...options?.headers,
                                    Authorization: `Bearer ${refreshData.result.data.tokens.access}`,
                                },
                            });
                        }
                    } catch {
                        // If we can't parse the error response, return the original response
                        return response;
                    }
                }
                return response;
            }
        }),
    ],
}); 