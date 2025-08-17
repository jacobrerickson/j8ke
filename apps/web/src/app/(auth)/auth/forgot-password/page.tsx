"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/lib/trpc/client";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setStatus("error");
            setMessage("Email is required");
            return;
        }

        setStatus("loading");
        setMessage("");

        try {
            await client.auth.forgotPassword.mutate({ email });
            setStatus("success");
            setMessage("Password reset link has been sent to your email");
        } catch (error) {
            setStatus("error");
            setMessage((error as Error).message);
        }
    };

    return (
        <div className="tw-w-full">
            <div className="tw-max-w-md tw-mx-auto">
                <h1 className="tw-text-2xl tw-font-bold tw-tracking-tight tw-text-center">Forgot Password</h1>
                <p className="tw-mt-2 tw-text-gray-600 tw-text-center">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="tw-mt-8 tw-space-y-6">
                    <div>
                        <label htmlFor="email" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={status === "loading"}
                            className="tw-mt-1 tw-block tw-w-full tw-rounded-lg tw-border tw-border-gray-300 tw-px-3 tw-py-2 tw-shadow-sm focus:tw-border-blue-500 focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
                        />
                    </div>

                    {message && (
                        <p className={`tw-text-sm ${status === "success" ? "tw-text-green-600" : "tw-text-red-600"}`}>
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="btn"
                    >
                        {status === "loading" ? (
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
                                Sending...
                            </>
                        ) : (
                            "Send Reset Link"
                        )}
                    </button>

                    <div className="tw-text-center">
                        <button
                            type="button"
                            onClick={() => router.push("/auth/login")}
                            className="tw-text-sm tw-text-gray-600 hover:tw-text-gray-900"
                        >
                            Back to Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}