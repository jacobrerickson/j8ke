"use client";

import type { ExerciseOverloadSummary } from "@/lib/strong/processWorkoutData";

interface Props {
  summaries: ExerciseOverloadSummary[];
}

const statusConfig = {
  progressing: {
    label: "Progressing",
    bg: "tw-bg-green-50 dark:tw-bg-green-900/20",
    border: "tw-border-green-200 dark:tw-border-green-800",
    badge: "tw-bg-green-100 dark:tw-bg-green-900/40 tw-text-green-700 dark:tw-text-green-400",
    arrow: "tw-text-green-600 dark:tw-text-green-400",
  },
  maintaining: {
    label: "Maintaining",
    bg: "tw-bg-yellow-50 dark:tw-bg-yellow-900/20",
    border: "tw-border-yellow-200 dark:tw-border-yellow-800",
    badge: "tw-bg-yellow-100 dark:tw-bg-yellow-900/40 tw-text-yellow-700 dark:tw-text-yellow-400",
    arrow: "tw-text-yellow-600 dark:tw-text-yellow-400",
  },
  regressing: {
    label: "Regressing",
    bg: "tw-bg-red-50 dark:tw-bg-red-900/20",
    border: "tw-border-red-200 dark:tw-border-red-800",
    badge: "tw-bg-red-100 dark:tw-bg-red-900/40 tw-text-red-700 dark:tw-text-red-400",
    arrow: "tw-text-red-600 dark:tw-text-red-400",
  },
};

export function OverloadTracker({ summaries }: Props) {
  if (!summaries.length) return null;

  const progressing = summaries.filter((s) => s.status === "progressing");
  const maintaining = summaries.filter((s) => s.status === "maintaining");
  const regressing = summaries.filter((s) => s.status === "regressing");

  return (
    <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow tw-p-6">
      <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100 tw-mb-1">
        Progressive Overload Tracker
      </h3>
      <p className="tw-text-xs tw-text-gray-400 dark:tw-text-gray-500 tw-mb-4">
        Comparing avg E1RM of last 3 sessions vs prior 3 sessions per exercise
      </p>

      {/* Summary counts */}
      <div className="tw-flex tw-gap-4 tw-mb-5">
        {[
          { count: progressing.length, status: "progressing" as const },
          { count: maintaining.length, status: "maintaining" as const },
          { count: regressing.length, status: "regressing" as const },
        ].map(({ count, status }) => (
          <div
            key={status}
            className={`tw-flex tw-items-center tw-gap-2 tw-px-3 tw-py-1.5 tw-rounded-full tw-text-sm tw-font-medium ${statusConfig[status].badge}`}
          >
            <span className="tw-font-bold">{count}</span>
            {statusConfig[status].label}
          </div>
        ))}
      </div>

      {/* Exercise list */}
      <div className="tw-space-y-2">
        {summaries.map((s) => {
          const config = statusConfig[s.status];
          return (
            <div
              key={s.exerciseName}
              className={`tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-3 tw-rounded-lg tw-border ${config.bg} ${config.border}`}
            >
              <div className="tw-flex tw-items-center tw-gap-3">
                <span className="tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-gray-100">
                  {s.exerciseName}
                </span>
                <span className={`tw-text-xs tw-px-2 tw-py-0.5 tw-rounded-full ${config.badge}`}>
                  {config.label}
                </span>
              </div>
              <div className="tw-flex tw-items-center tw-gap-4 tw-text-sm">
                <span className="tw-text-gray-500 dark:tw-text-gray-400">
                  {s.previousE1RM} → {s.recentE1RM}
                </span>
                <span className={`tw-font-semibold ${config.arrow}`}>
                  {s.changePercent > 0 ? "+" : ""}
                  {s.changePercent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
