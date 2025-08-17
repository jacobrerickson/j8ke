"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { client } from "@/lib/trpc/client";

export default function ResetPassword() {
    const [status, setStatus] = useState<"loading" | "form" | "error">("loading");
    const [message, setMessage] = useState<string | null>("Please wait, we are verifying your reset link");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const verifyResetToken = async () => {
            try {
                const id = searchParams.get("id");
                const token = searchParams.get("token");

                if (!id || !token) {
                    setStatus("error");
                    setMessage("Invalid reset link");
                    return;
                }

                await client.auth.verifyPasswordResetToken.mutate({ id, token });
                setStatus("form");
                setMessage(null); // Clear the verification message
            } catch (error) {
                setStatus("error");
                setMessage((error as Error).message);
            }
        };

        verifyResetToken();
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password.trim()) {
            setMessage("Password is required");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        setIsSubmitting(true);
        try {
            const id = searchParams.get("id");
            const token = searchParams.get("token");

            await client.auth.resetPassword.mutate({
                id: id!,
                token: token!,
                password
            });

            setStatus("error"); // Using error state for success message display
            setMessage("Password reset successful! Redirecting to login...");

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push("/auth/login");
            }, 2000);
        } catch (error) {
            setMessage((error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="tw-w-full">
                <div className="tw-text-center">
                    <h1 className="tw-text-2xl tw-font-bold tw-tracking-tight">Verifying Reset Link</h1>
                    <p className="tw-mt-2 tw-text-gray-600">{message}</p>
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="tw-w-full">
                <div className="tw-text-center">
                    <h1 className="tw-text-2xl tw-font-bold tw-tracking-tight">
                        {message?.includes("successful") ? "Success!" : "Reset Link Error"}
                    </h1>
                    <p className={`tw-mt-2 ${message?.includes("successful") ? "tw-text-green-600" : "tw-text-red-600"}`}>
                        {message}
                    </p>
                    {!message?.includes("successful") && (
                        <button
                            onClick={() => router.push("/auth/login")}
                            className="btn-secondary"
                        >
                            Back to Sign In
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="tw-w-full">
            <div className="tw-max-w-md tw-mx-auto">
                <h1 className="tw-text-2xl tw-font-bold tw-tracking-tight tw-text-center">Reset Password</h1>
                <form onSubmit={handleSubmit} className="tw-mt-8 tw-space-y-6">
                    <div>
                        <label htmlFor="password" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                            New Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="tw-mt-1 tw-block tw-w-full tw-rounded-lg tw-border tw-border-gray-300 tw-px-3 tw-py-2 tw-shadow-sm focus:tw-border-blue-500 focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirm-password" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                            Confirm New Password
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="tw-mt-1 tw-block tw-w-full tw-rounded-lg tw-border tw-border-gray-300 tw-px-3 tw-py-2 tw-shadow-sm focus:tw-border-blue-500 focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500"
                        />
                    </div>

                    {message && (
                        <p className="tw-text-red-600 tw-text-sm">{message}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="tw-animate-spin tw-h-4 tw-w-4 tw-mr-2" viewBox="0 0 24 24">
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
                                Resetting...
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}