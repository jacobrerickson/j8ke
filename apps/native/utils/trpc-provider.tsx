'use client'

import { AppRouter } from "@repo/server/src/router/index";
import { createTRPCProxyClient, httpLink } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { Storage } from "./async-storage";

const getUrl = (): string => {
    return process.env.EXPO_PUBLIC_SERVER_URL!!
}

const tokens = async (): Promise<{ access: string, refresh: string }> => {
    const access = await Storage.get(Storage.keys.AUTH_TOKEN)
    const refresh = await Storage.get(Storage.keys.REFRESH_TOKEN)
    return {
        access: access || "",
        refresh: refresh || ""
    };
}

export const client = createTRPCProxyClient<AppRouter>({
    links: [
        httpLink({
            url: `${getUrl()}`,
            headers: async () => {
                const tokenData = await tokens();
                return {
                    Authorization: "Bearer " + `${tokenData.access}` || ''
                };
            },
            fetch: async (input, options) => {
                const postData = await fetch(input, options)
                if (postData.status !== 200) {
                    const resp: { error: { data: TRPCError } } = await postData.clone().json()
                    if (resp.error.data.code === "UNAUTHORIZED") {
                        const tokenData = await tokens();  // await for tokens to fetch access and refresh tokens
                        const refresh = tokenData.refresh; // make sure to use the await fetched refresh token
                        const tk = await fetch(`${getUrl()}/auth.refreshToken`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ refreshToken: refresh })
                        }).then(resp => resp.json())
                        if (tk.error) return postData
                        const { access, refresh: refreshToken } = tk.result.data.tokens
                        Storage.save(Storage.keys.AUTH_TOKEN, access)
                        Storage.save(Storage.keys.REFRESH_TOKEN, refreshToken)

                        return fetch(input, {
                            ...options,
                            headers: {
                                ...options?.headers,
                                Authorization: `Bearer ${tk.result.data.tokens.access}`,
                            },
                        })
                    }

                    return postData
                } else {
                    return postData
                }
            }
        }),
    ],
})