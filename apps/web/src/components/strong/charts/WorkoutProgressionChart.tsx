"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useChartTheme, CHART_COLORS, formatVolume, TOOLTIP_WRAPPER_STYLE } from "./chartTheme";

interface Props {
  data: { date: string; workoutName: string; totalVolume: number }[];
}

export function WorkoutProgressionChart({ data }: Props) {
  const theme = useChartTheme();

  const { chartData, workoutNames } = useMemo(() => {
    const names = [...new Set(data.map((d) => d.workoutName))];
    const byDate = new Map<string, Record<string, number>>();

    for (const d of data) {
      const existing = byDate.get(d.date) ?? {};
      existing[d.workoutName] = d.totalVolume;
      byDate.set(d.date, existing);
    }

    const sorted = Array.from(byDate.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, vals]) => ({ date, ...vals }));

    return { chartData: sorted, workoutNames: names };
  }, [data]);

  if (!chartData.length) return null;

  return (
    <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow tw-p-6">
      <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100 tw-mb-4">
        Workout Volume Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis
            dataKey="date"
            tick={{ fill: theme.axis, fontSize: 12 }}
            tickFormatter={(v) =>
              new Date(v).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })
            }
          />
          <YAxis
            tick={{ fill: theme.axis, fontSize: 12 }}
            tickFormatter={formatVolume}
          />
          <Tooltip
            wrapperStyle={TOOLTIP_WRAPPER_STYLE}
            contentStyle={theme.tooltipStyle}
            formatter={(value) => [
              `${formatVolume(Number(value))} lbs`,
              "Volume",
            ]}
            labelFormatter={(label) =>
              new Date(label).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            }
          />
          <Legend />
          {workoutNames.map((name, i) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
