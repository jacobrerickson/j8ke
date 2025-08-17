"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { signIn, resendVerificationEmail } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await signIn(email, password);
            if (response.message) {
                router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
            } else {
                router.push('/app/dashboard');
            }
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="tw-w-full">
            <div className="tw-max-w-md tw-mx-auto">
                <div className="tw-text-center">
                    <h1 className="tw-text-2xl tw-font-bold tw-tracking-tight">Sign in to Template</h1>
                    <p className="tw-mt-2 tw-text-sm tw-text-gray-600">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/register" className="tw-font-medium tw-text-blue-600 hover:tw-text-blue-500">
                            Sign up
                        </Link>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="tw-mt-8 tw-space-y-6">
                    <div>
                        <label htmlFor="email" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            className="tw-mt-1 tw-block tw-w-full tw-rounded-lg tw-border tw-border-gray-300 tw-px-3 tw-py-2 tw-shadow-sm focus:tw-border-blue-500 focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
                            placeholder="example@email.com"
                        />
                    </div>

                    <div>
                        <div className="tw-flex tw-items-center tw-justify-between">
                            <label htmlFor="password" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
                                Password
                            </label>
                            <Link href="/auth/forgot-password" className="tw-text-sm tw-text-blue-600 hover:tw-text-blue-800">
                                Forgot Password?
                            </Link>
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            className="tw-mt-1 tw-block tw-w-full tw-rounded-lg tw-border tw-border-gray-300 tw-px-3 tw-py-2 tw-shadow-sm focus:tw-border-blue-500 focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-blue-500 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
                        />
                    </div>

                    {error && (
                        <div className="tw-rounded-lg tw-bg-red-50 tw-p-4 tw-text-sm tw-text-red-600 tw-flex tw-flex-row tw-gap-2">
                            {error}
                            {error.includes("Please verify your email") && (
                                <button
                                    onClick={() => {
                                        resendVerificationEmail(email);
                                        setError("Verification email sent");
                                    }}
                                    className="tw-text-blue-600 hover:tw-text-blue-800"
                                >
                                    Resend
                                </button>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn"
                    >
                        {isLoading ? (
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
                                Signing in...
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </button>

                    <div className="tw-relative">
                        <div className="tw-absolute tw-inset-0 tw-flex tw-items-center">
                            <div className="tw-w-full tw-border-t tw-border-gray-300" />
                        </div>
                        <div className="tw-relative tw-flex tw-justify-center tw-text-sm">
                            <span className="tw-bg-white tw-px-2 tw-text-gray-500">or sign in with</span>
                        </div>
                    </div>

                    <div className="tw-grid tw-grid-cols-3 tw-gap-3">
                        <button
                            type="button"
                            disabled={isLoading}
                            className="btn-outline"
                        >
                            <svg className="tw-h-5 tw-w-5" viewBox="0 0 24 24">
                                <path
                                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                                    fill="#EA4335"
                                />
                                <path
                                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.27498 6.60986C0.46498 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46498 15.7699 1.27498 17.3899L5.26498 14.2949Z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12.0004 24C15.2354 24 17.9504 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24 12.0004 24Z"
                                    fill="#34A853"
                                />
                            </svg>
                        </button>

                        <button
                            type="button"
                            disabled={isLoading}
                            className="btn-outline"
                        >
                            <svg className="tw-h-5 tw-w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 0C4.477 0 0 4.477 0 10c0 4.411 2.865 8.138 6.839 9.459.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.135 20 14.41 20 10c0-5.523-4.477-10-10-10z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        <button
                            type="button"
                            disabled={isLoading}
                            className="btn-outline"
                        >
                            <svg className="tw-h-5 tw-w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M11.182 0c.11.802-.19 1.594-.5 2.313-.348.802-1.01 1.512-1.716 1.487-.11-.764.19-1.533.5-2.252C9.814.747 10.532.037 11.182 0zM8.005 4.245c.607 0 1.752-.803 3.234-.803 2.554 0 3.563 1.824 3.563 1.824s-1.965.986-1.965 3.38c0 2.705 2.402 3.63 2.402 3.63s-1.678 4.724-3.944 4.724c-1.042 0-1.85-.701-2.943-.701-1.12 0-2.23.73-2.944.73C3.698 17.029 0 12.35 0 8.04 0 3.82 2.92 1.97 4.798 1.97c1.51 0 2.682.803 3.207.803v1.472z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}