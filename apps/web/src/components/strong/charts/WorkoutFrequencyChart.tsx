"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useChartTheme, CHART_COLORS } from "./chartTheme";
import type { WorkoutSession } from "@/lib/strong/types";
import { getWorkoutFrequency } from "@/lib/strong/processWorkoutData";

interface Props {
  sessions: WorkoutSession[];
}

export function WorkoutFrequencyChart({ sessions }: Props) {
  const theme = useChartTheme();
  const [granularity, setGranularity] = useState<"week" | "month">("week");
  const data = getWorkoutFrequency(sessions, granularity);

  if (!data.length) return null;

  return (
    <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow tw-p-6">
      <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
        <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100">
          Workout Frequency
        </h3>
        <div className="tw-flex tw-gap-1 tw-bg-gray-100 dark:tw-bg-gray-700 tw-rounded-md tw-p-0.5">
          {(["week", "month"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGranularity(g)}
              className={`tw-px-3 tw-py-1 tw-text-xs tw-font-medium tw-rounded ${
                granularity === g
                  ? "tw-bg-white dark:tw-bg-gray-600 tw-text-gray-900 dark:tw-text-gray-100 tw-shadow-sm"
                  : "tw-text-gray-500 dark:tw-text-gray-400 hover:tw-text-gray-700 dark:hover:tw-text-gray-200"
              }`}
            >
              {g === "week" ? "Weekly" : "Monthly"}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis
            dataKey="period"
            tick={{ fill: theme.axis, fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fill: theme.axis, fontSize: 12 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltipBg,
              borderColor: theme.tooltipBorder,
              color: theme.tooltipText,
            }}
            formatter={(value) => [`${value} workouts`, "Count"]}
          />
          <Bar dataKey="count" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
