"use client";

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
import { useChartTheme, CHART_COLORS, TOOLTIP_WRAPPER_STYLE } from "./chartTheme";

interface Props {
  data: { date: string; maxWeight: number; totalVolume: number; maxReps: number }[];
  exerciseName: string;
}

export function ExerciseProgressionChart({ data, exerciseName }: Props) {
  const theme = useChartTheme();

  if (!data.length) return null;

  return (
    <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow tw-p-6">
      <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100 tw-mb-4">
        {exerciseName} Progression
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
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
            yAxisId="weight"
            tick={{ fill: theme.axis, fontSize: 12 }}
            label={{
              value: "Weight",
              angle: -90,
              position: "insideLeft",
              fill: theme.axis,
            }}
          />
          <YAxis
            yAxisId="volume"
            orientation="right"
            tick={{ fill: theme.axis, fontSize: 12 }}
            label={{
              value: "Volume",
              angle: 90,
              position: "insideRight",
              fill: theme.axis,
            }}
          />
          <Tooltip
            wrapperStyle={TOOLTIP_WRAPPER_STYLE}
            contentStyle={theme.tooltipStyle}
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
          <Line
            yAxisId="weight"
            type="monotone"
            dataKey="maxWeight"
            name="Max Weight"
            stroke={CHART_COLORS[0]}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            yAxisId="volume"
            type="monotone"
            dataKey="totalVolume"
            name="Total Volume"
            stroke={CHART_COLORS[1]}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            yAxisId="weight"
            type="monotone"
            dataKey="maxReps"
            name="Max Reps"
            stroke={CHART_COLORS[2]}
            strokeWidth={2}
            dot={{ r: 3 }}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
