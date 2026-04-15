"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useChartTheme, CHART_COLORS, TOOLTIP_WRAPPER_STYLE } from "./chartTheme";

interface Props {
  data: { date: string; e1rm: number; weight: number; reps: number }[];
  exerciseName: string;
}

export function E1RMProgressionChart({ data, exerciseName }: Props) {
  const theme = useChartTheme();

  if (!data.length) return null;

  const maxE1RM = Math.max(...data.map((d) => d.e1rm));

  return (
    <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow tw-p-6">
      <div className="tw-flex tw-items-center tw-justify-between tw-mb-1">
        <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100">
          Estimated 1RM — {exerciseName}
        </h3>
        <span className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">
          PR: {maxE1RM} lbs
        </span>
      </div>
      <p className="tw-text-xs tw-text-gray-400 dark:tw-text-gray-500 tw-mb-4">
        Epley formula: weight × (1 + reps / 30)
      </p>
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
            tick={{ fill: theme.axis, fontSize: 12 }}
            domain={["dataMin - 10", "dataMax + 10"]}
            label={{
              value: "Est. 1RM (lbs)",
              angle: -90,
              position: "insideLeft",
              fill: theme.axis,
            }}
          />
          <ReferenceLine
            y={maxE1RM}
            stroke={CHART_COLORS[5]}
            strokeDasharray="3 3"
            strokeOpacity={0.6}
          />
          <Tooltip
            wrapperStyle={TOOLTIP_WRAPPER_STYLE}
            contentStyle={theme.tooltipStyle}
            formatter={(_value, _name, entry) => {
              const p = (entry as { payload: { e1rm: number; weight: number; reps: number } }).payload;
              return [`${p.e1rm} lbs (${p.weight}×${p.reps})`, "Est. 1RM"];
            }}
            labelFormatter={(label) =>
              new Date(label).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            }
          />
          <Line
            type="monotone"
            dataKey="e1rm"
            stroke={CHART_COLORS[0]}
            strokeWidth={2.5}
            dot={{ r: 4, fill: CHART_COLORS[0] }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
