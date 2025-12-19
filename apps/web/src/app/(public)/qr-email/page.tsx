"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { client } from "@/lib/trpc/client";

const EMAIL = "marissa.erickson93@gmail.com";

function QREmailContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const hasSentRef = useRef(false);
  const searchParams = useSearchParams();


  useEffect(() => {
    // Prevent sending multiple times if component re-renders
    if (hasSentRef.current) return;

    const sendEmail = async () => {
      hasSentRef.current = true;
      setIsSubmitting(true);
      setSubmitStatus({ type: null, message: "" });

      // Get optional message from URL query params
      const messageParam = searchParams.get("message");
      const message = messageParam || undefined;

      try {
        await client.qrEmail.send.mutate({
          recipientEmail: EMAIL,
          message,
        });

        setSubmitStatus({
          type: "success",
          message: "Email sent successfully!",
        });
      } catch (error) {
        setSubmitStatus({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Failed to send email. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    sendEmail();
  }, [searchParams]);

  return (
    <div className="tw-min-h-screen tw-bg-gradient-to-br tw-from-red-600 tw-to-green-700 tw-py-12 tw-px-4 tw-relative tw-overflow-hidden">
      {/* Falling snowflakes */}
      <div
        className="snowflake tw-text-2xl tw-text-white/70"
        style={{
          left: "10%",
          animationDuration: "8s",
          animationDelay: "0s",
        }}
      >
        ❄️
      </div>
      <div
        className="snowflake tw-text-xl tw-text-white/60"
        style={{
          left: "20%",
          animationDuration: "10s",
          animationDelay: "1s",
        }}
      >
        ❄️
      </div>
      <div
        className="snowflake tw-text-lg tw-text-white/50"
        style={{
          left: "30%",
          animationDuration: "12s",
          animationDelay: "2s",
        }}
      >
        ❄️
      </div>
      <div
        className="snowflake tw-text-2xl tw-text-white/65"
        style={{
          left: "40%",
          animationDuration: "9s",
          animationDelay: "0.5s",
        }}
      >
        ❄️
      </div>
      <div
        className="snowflake tw-text-xl tw-text-white/55"
        style={{
          left: "50%",
          animationDuration: "11s",
          animationDelay: "1.5s",
        }}
      >
        ❄️
      </div>
      <div
        className="snowflake tw-text-lg tw-text-white/45"
        style={{
          left: "60%",
          animationDuration: "13s",
          animationDelay: "2.5s",
        }}
      >
        ❄️
      </div>
      <div
        className="snowflake tw-text-2xl tw-text-white/70"
        style={{
          left: "70%",
          animationDuration: "8.5s",
          animationDelay: "0.3s",
        }}
      >
        ❄️
      </div>
      <div
        className="snowflake tw-text-xl tw-text-white/60"
        style={{
          left: "80%",
          animationDuration: "10.5s",
          animationDelay: "1.8s",
        }}
      >
        ❄️
      </div>
      <div
        className="snowflake tw-text-lg tw-text-white/50"
        style={{
          left: "90%",
          animationDuration: "11.5s",
          animationDelay: "3s",
        }}
      >
        ❄️
      </div>
      <div
        className="snowflake tw-text-xl tw-text-white/55"
        style={{
          left: "15%",
          animationDuration: "9.5s",
          animationDelay: "0.7s",
        }}
      >
        ❄️
      </div>
      <div
        className="snowflake tw-text-lg tw-text-white/45"
        style={{
          left: "25%",
          animationDuration: "12.5s",
          animationDelay: "2.2s",
        }}
      >
        ❄️
      </div>
      <div
        className="snowflake tw-text-2xl tw-text-white/65"
        style={{
          left: "35%",
          animationDuration: "8.8s",
          animationDelay: "0.2s",
        }}
      >
        ❄️
      </div>
      <div
        className="snowflake tw-text-xl tw-text-white/60"
        style={{
          left: "45%",
          animationDuration: "10.2s",
          animationDelay: "1.2s",
        }}
      >
        ❄️
      </div>
      <div
        className="snowflake tw-text-lg tw-text-white/50"
        style={{
          left: "55%",
          animationDuration: "11.8s",
          animationDelay: "2.8s",
        }}
      >
        ❄️
      </div>
      <div
        className="snowflake tw-text-2xl tw-text-white/70"
        style={{
          left: "65%",
          animationDuration: "9.2s",
          animationDelay: "0.4s",
        }}
      >
        ❄️
      </div>
      <div
        className="snowflake tw-text-xl tw-text-white/55"
        style={{
          left: "75%",
          animationDuration: "10.8s",
          animationDelay: "1.6s",
        }}
      >
        ❄️
      </div>
      <div
        className="snowflake tw-text-lg tw-text-white/45"
        style={{
          left: "85%",
          animationDuration: "12.2s",
          animationDelay: "3.2s",
        }}
      >
        ❄️
      </div>
      <div
        className="snowflake tw-text-xl tw-text-white/60"
        style={{
          left: "5%",
          animationDuration: "9.8s",
          animationDelay: "0.6s",
        }}
      >
        ❄️
      </div>
      <div
        className="snowflake tw-text-lg tw-text-white/50"
        style={{
          left: "95%",
          animationDuration: "11.2s",
          animationDelay: "2.4s",
        }}
      >
        ❄️
      </div>

      <div className="tw-container tw-mx-auto tw-max-w-2xl tw-relative tw-z-10">
        <div className="tw-bg-white tw-rounded-2xl tw-shadow-2xl tw-p-8 tw-border-4 tw-bg-gradient-to-b tw-from-white tw-to-yellow-50">
          {/* Top decorative emojis */}
          <div className="tw-text-center tw-text-3xl tw-mb-6">🎅 🎄 🎁</div>

          <div className="tw-text-center tw-mb-8">
            <h1
              className="tw-text-4xl tw-font-bold tw-text-red-600 tw-mb-4 tw-tracking-wide"
              style={{
                fontFamily: "Georgia, serif",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              🎄 Merry Christmas Marissa! 🎄
            </h1>
            <div className="tw-w-3/4 tw-h-1 tw-bg-gradient-to-r tw-from-red-600 tw-via-yellow-400 tw-to-green-600 tw-mx-auto tw-rounded-full tw-mb-4"></div>
          </div>

          {/* GIF Display - Always visible */}
          <div className="tw-flex tw-justify-center tw-mb-6">
            <Image
              src="/christmas-gif.gif"
              alt="Merry Christmas"
              width={400}
              height={300}
              className="tw-rounded-lg tw-shadow-lg"
              style={{
                maxHeight: "300px",
                width: "auto",
                height: "auto",
              }}
              unoptimized
            />
          </div>

          <div className="tw-space-y-6">
            {isSubmitting && !submitStatus.type && (
              <div className="tw-text-center">
                <div className="tw-p-4 tw-rounded-xl tw-bg-gradient-to-r tw-from-red-50 tw-to-green-50 tw-text-red-800 tw-border-2 tw-border-red-300 tw-inline-flex tw-items-center tw-gap-3 tw-shadow-lg">
                  <div className="tw-animate-spin tw-rounded-full tw-h-5 tw-w-5 tw-border-3 tw-border-red-600 tw-border-t-transparent"></div>
                  <span className="tw-text-lg tw-font-semibold">
                    🎅 Sending your Christmas email...
                  </span>
                </div>
              </div>
            )}

            {submitStatus.type === "success" && (
              <div className="tw-text-center tw-space-y-4">
                <div className="tw-text-4xl tw-mb-4">🎁 🎄 ⛄ 🎅 🦌</div>
              </div>
            )}
          </div>

          {/* Combined status message at bottom */}
          {submitStatus.type && (
            <div className="tw-mt-8 tw-text-center">
              <div
                className={`tw-inline-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2 tw-rounded-lg tw-text-sm ${
                  submitStatus.type === "success"
                    ? "tw-bg-green-50 tw-text-green-700 tw-border tw-border-green-200"
                    : "tw-bg-red-50 tw-text-red-700 tw-border tw-border-red-200"
                }`}
              >
                {submitStatus.type === "success" ? (
                  <>
                    <span>✅</span>
                    <span>
                      {submitStatus.message} - Sent to {EMAIL}
                    </span>
                  </>
                ) : (
                  <>
                    <span>❌</span>
                    <span>{submitStatus.message}</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QREmailPage() {
  return (
    <Suspense
      fallback={
        <div className="tw-min-h-screen tw-bg-gradient-to-br tw-from-red-600 tw-via-red-800 tw-to-green-700 tw-flex tw-items-center tw-justify-center tw-px-4">
          <div className="tw-bg-white tw-rounded-2xl tw-shadow-2xl tw-p-8 tw-border-4 tw-border-yellow-400 tw-text-center tw-max-w-md">
            <div className="tw-text-4xl tw-mb-4">🎄</div>
            <div className="tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-4 tw-border-red-600 tw-border-t-transparent tw-mx-auto tw-mb-4"></div>
            <p className="tw-text-xl tw-text-gray-700 tw-font-semibold">
              Loading Christmas magic... ✨
            </p>
          </div>
        </div>
      }
    >
      <QREmailContent />
    </Suspense>
  );
}
