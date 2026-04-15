import type { CSSProperties } from "react";

export function formatVolume(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 100_000 ? 0 : 1)}K`;
  return value.toLocaleString();
}

export const CHART_COLORS = [
  "#6366f1", // indigo-500
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#a855f7", // purple-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#06b6d4", // cyan-500
  "#ec4899", // pink-500
];

export const TOOLTIP_WRAPPER_STYLE: CSSProperties = {
  maxWidth: "90vw",
  zIndex: 10,
};

const tooltipContentBase: CSSProperties = {
  maxWidth: "85vw",
  whiteSpace: "normal",
  wordBreak: "break-word",
};

interface ChartTheme {
  axis: string;
  grid: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
  tooltipStyle: CSSProperties;
}

export function useChartTheme(): ChartTheme {
  if (typeof window === "undefined") {
    return lightTheme;
  }
  const isDark = document.documentElement.classList.contains("dark");
  return isDark ? darkTheme : lightTheme;
}

const lightTheme: ChartTheme = {
  axis: "#6b7280",
  grid: "#e5e7eb",
  tooltipBg: "#ffffff",
  tooltipBorder: "#e5e7eb",
  tooltipText: "#111827",
  tooltipStyle: { ...tooltipContentBase, backgroundColor: "#ffffff", borderColor: "#e5e7eb", color: "#111827" },
};

const darkTheme: ChartTheme = {
  axis: "#9ca3af",
  grid: "#374151",
  tooltipBg: "#1f2937",
  tooltipBorder: "#4b5563",
  tooltipText: "#f3f4f6",
  tooltipStyle: { ...tooltipContentBase, backgroundColor: "#1f2937", borderColor: "#4b5563", color: "#f3f4f6" },
};
