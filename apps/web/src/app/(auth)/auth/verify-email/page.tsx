"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { client } from "@/lib/trpc/client";
import { TokensStorage } from "@/lib/utils/tokens-storage";
import { useDispatch } from "react-redux";
import { setAuthState } from "@/store/slices/auth";

export default function VerifyEmail() {
    const [status, setStatus] = useState<"verifying" | "logging-in" | "success" | "error">("verifying");
    const [message, setMessage] = useState("Please wait, we are verifying your account");
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const id = searchParams.get("id");
                const token = searchParams.get("token");

                if (!id || !token) {
                    setStatus("error");
                    setMessage("Invalid verification link");
                    return;
                }

                const response = await client.auth.verifyEmailVerificationLink.mutate({ id, token });

                // Handle auto-login
                if (response.tokens && response.profile) {
                    setStatus("logging-in");
                    setMessage("Email verified! Logging you in...");

                    // Store tokens and update auth state
                    TokensStorage.setTokens(response.tokens.access, response.tokens.refresh);
                    dispatch(setAuthState(response));

                    // Add a delay before showing success and redirecting
                    setTimeout(() => {
                        setStatus("success");
                        setMessage("Successfully logged in! Redirecting to dashboard...");

                        // Redirect to dashboard after showing success message
                        setTimeout(() => {
                            router.push("/app/dashboard");
                        }, 1500);
                    }, 1500);
                }
            } catch (error) {
                setStatus("error");
                setMessage((error as Error).message);
            }
        };

        verifyEmail();
    }, [searchParams, router, dispatch]);

    return (
        <div className="tw-w-full">
            <div className="tw-text-center">
                <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-4">
                    {(status === "verifying" || status === "logging-in") && (
                        <svg className="tw-animate-spin tw-h-8 tw-w-8 tw-text-blue-600" viewBox="0 0 24 24">
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
                    )}
                    <h1 className="tw-text-2xl tw-font-bold tw-tracking-tight">
                        {status === "verifying" && "Verifying Email"}
                        {status === "logging-in" && "Logging In"}
                        {status === "success" && "Success!"}
                        {status === "error" && "Verification Error"}
                    </h1>
                    <p className={`tw-mt-2 ${status === "error" ? "tw-text-red-600" : status === "success" ? "tw-text-green-600" : "tw-text-gray-600"}`}>
                        {message}
                    </p>
                    {status === "error" && (
                        <button
                            onClick={() => router.push("/auth/login")}
                            className="btn-secondary"
                        >
                            Back to Sign In
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}