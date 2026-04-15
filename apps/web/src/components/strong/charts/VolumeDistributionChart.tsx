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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useChartTheme, CHART_COLORS, formatVolume } from "./chartTheme";

interface Props {
  data: { exerciseName: string; totalVolume: number }[];
}

export function VolumeDistributionChart({ data }: Props) {
  const theme = useChartTheme();
  const [view, setView] = useState<"bar" | "pie">("bar");
  const top10 = data.slice(0, 10);

  if (!data.length) return null;

  return (
    <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow tw-p-6">
      <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
        <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100">
          Volume by Exercise
        </h3>
        <div className="tw-flex tw-gap-1 tw-bg-gray-100 dark:tw-bg-gray-700 tw-rounded-md tw-p-0.5">
          {(["bar", "pie"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`tw-px-3 tw-py-1 tw-text-xs tw-font-medium tw-rounded ${
                view === v
                  ? "tw-bg-white dark:tw-bg-gray-600 tw-text-gray-900 dark:tw-text-gray-100 tw-shadow-sm"
                  : "tw-text-gray-500 dark:tw-text-gray-400 hover:tw-text-gray-700 dark:hover:tw-text-gray-200"
              }`}
            >
              {v === "bar" ? "Bar" : "Pie"}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        {view === "bar" ? (
          <BarChart data={top10} layout="vertical" margin={{ left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
            <XAxis
              type="number"
              tick={{ fill: theme.axis, fontSize: 12 }}
              tickFormatter={(v) =>
                formatVolume(v)
              }
            />
            <YAxis
              type="category"
              dataKey="exerciseName"
              tick={{ fill: theme.axis, fontSize: 11 }}
              width={115}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.tooltipBg,
                borderColor: theme.tooltipBorder,
                color: theme.tooltipText,
              }}
              formatter={(value: number) => [
                `${formatVolume(value)} lbs`,
                "Volume",
              ]}
            />
            <Bar dataKey="totalVolume" radius={[0, 4, 4, 0]}>
              {top10.map((_, i) => (
                <Cell
                  key={i}
                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={top10}
              dataKey="totalVolume"
              nameKey="exerciseName"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ exerciseName, percent }) =>
                `${exerciseName.length > 15 ? exerciseName.slice(0, 15) + "…" : exerciseName} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={{ stroke: theme.axis }}
            >
              {top10.map((_, i) => (
                <Cell
                  key={i}
                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: theme.tooltipBg,
                borderColor: theme.tooltipBorder,
                color: theme.tooltipText,
              }}
              formatter={(value: number) => [
                `${formatVolume(value)} lbs`,
                "Volume",
              ]}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
