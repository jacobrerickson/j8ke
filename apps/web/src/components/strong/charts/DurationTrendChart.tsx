"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useChartTheme, CHART_COLORS, TOOLTIP_WRAPPER_STYLE } from "./chartTheme";

interface Props {
  data: { date: string; durationMinutes: number; workoutName: string }[];
}

export function DurationTrendChart({ data }: Props) {
  const theme = useChartTheme();

  if (!data.length) return null;

  return (
    <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow tw-p-6">
      <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100 tw-mb-4">
        Workout Duration Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="durationGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={CHART_COLORS[4]}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={CHART_COLORS[4]}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
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
            label={{
              value: "Minutes",
              angle: -90,
              position: "insideLeft",
              fill: theme.axis,
            }}
          />
          <Tooltip
            wrapperStyle={TOOLTIP_WRAPPER_STYLE}
            contentStyle={theme.tooltipStyle}
            formatter={(value, _name, entry) => [
              `${value} min`,
              (entry as { payload: { workoutName: string } }).payload.workoutName,
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
          <Area
            type="monotone"
            dataKey="durationMinutes"
            stroke={CHART_COLORS[4]}
            strokeWidth={2}
            fill="url(#durationGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
