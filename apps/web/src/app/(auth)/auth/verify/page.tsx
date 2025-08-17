"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function VerifyCodeClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const { verifyEmailCode } = useAuth();
    const [code, setCode] = useState(["", "", "", "", ""]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Initialize refs array
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 5);
    }, []);

    // Handle input change
    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;

        const newCode = [...code];
        // Take only the last character if multiple characters are pasted
        newCode[index] = value.slice(-1);
        setCode(newCode);

        // If a digit was entered and there's a next input, focus it
        if (value && index < 4) {
            inputRefs.current[index + 1]?.focus();
        }

        // If all digits are entered, submit
        if (index === 4 && value && !newCode.includes("")) {
            handleSubmit(newCode.join(""));
        }
    };

    // Handle backspace
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            // If current input is empty and backspace is pressed, focus previous input
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 5);
        if (!/^\d+$/.test(pastedData)) return; // Only allow numbers

        const newCode = [...code];
        pastedData.split("").forEach((char, index) => {
            if (index < 5) newCode[index] = char;
        });
        setCode(newCode);

        // Focus last input or the next empty input
        const lastFilledIndex = newCode.findIndex(c => !c);
        const focusIndex = lastFilledIndex === -1 ? 4 : lastFilledIndex;
        inputRefs.current[focusIndex]?.focus();

        // If all digits are entered, submit
        if (!newCode.includes("") && newCode.length === 5) {
            handleSubmit(newCode.join(""));
        }
    };

    const handleSubmit = async (verificationCode: string) => {
        if (!email) {
            setError("Email is required. Please try signing in again.");
            return;
        }

        try {
            setError("");
            setIsLoading(true);
            await verifyEmailCode(email, verificationCode);
            router.push("/app/dashboard");
        } catch (err) {
            setError((err as Error).message);
            // Clear code on error
            setCode(["", "", "", "", ""]);
            // Focus first input
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="tw-w-full">
                <div className="tw-text-center">
                    <h1 className="tw-text-2xl tw-font-bold tw-tracking-tight tw-text-red-600">Error</h1>
                    <p className="tw-mt-2">Email is missing. Please try signing in again.</p>
                    <button
                        onClick={() => router.push("/auth/login")}
                        className="tw-mt-4 tw-rounded-md tw-bg-black tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-text-white hover:tw-bg-gray-800"
                    >
                        Back to Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="tw-w-full">
            <div className="tw-text-center">
                <h1 className="tw-text-2xl tw-font-bold tw-tracking-tight">Verify Your Email</h1>
                <p className="tw-mt-2 tw-text-gray-600">
                    Please enter the verification code sent to {email}
                </p>
                {error && (
                    <p className="tw-mt-4 tw-text-sm tw-text-red-600 tw-bg-red-50 tw-py-2 tw-px-4 tw-rounded-md">
                        {error}
                    </p>
                )}
            </div>

            <div className="tw-mt-8">
                <div className="tw-flex tw-justify-center tw-gap-2">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => inputRefs.current[index] = el}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={e => handleChange(index, e.target.value)}
                            onKeyDown={e => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            disabled={isLoading}
                            className="tw-w-12 tw-h-12 tw-text-center tw-text-xl tw-font-semibold tw-text-gray-900 tw-rounded-md tw-border tw-border-gray-300 focus:tw-border-black focus:tw-outline-none focus:tw-ring-1 focus:tw-ring-black disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
                        />
                    ))}
                </div>

                {isLoading && (
                    <div className="tw-mt-4 tw-flex tw-justify-center tw-items-center tw-text-sm tw-text-gray-600">
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
                        Verifying...
                    </div>
                )}

                <div className="tw-mt-8 tw-text-center">
                    <button
                        onClick={() => router.push("/auth/login")}
                        disabled={isLoading}
                        className="tw-text-sm tw-text-gray-600 hover:tw-text-gray-900 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
                    >
                        Back to Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}
