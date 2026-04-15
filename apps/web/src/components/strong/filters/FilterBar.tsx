"use client";

import { useMemo } from "react";
import type { WorkoutSession, FilterState } from "@/lib/strong/types";

interface FilterBarProps {
  sessions: WorkoutSession[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function FilterBar({
  sessions,
  filters,
  onFiltersChange,
}: FilterBarProps) {
  const workoutNames = useMemo(
    () => [...new Set(sessions.map((s) => s.workoutName))].sort(),
    [sessions],
  );

  const exerciseNames = useMemo(
    () =>
      [
        ...new Set(
          sessions.flatMap((s) => s.exercises.map((e) => e.exerciseName)),
        ),
      ].sort(),
    [sessions],
  );

  return (
    <div className="tw-flex tw-flex-col tw-gap-3 sm:tw-flex-row sm:tw-flex-wrap sm:tw-gap-4 tw-mb-6">
      <div className="tw-grid tw-grid-cols-[auto_1fr_auto_1fr] tw-gap-2 tw-items-center sm:tw-flex">
        <label className="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-whitespace-nowrap">
          From
        </label>
        <input
          type="date"
          value={filters.dateRange.start}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              dateRange: { ...filters.dateRange, start: e.target.value },
            })
          }
          className="tw-rounded-md tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-bg-white dark:tw-bg-gray-700 tw-text-gray-900 dark:tw-text-gray-100 tw-px-3 tw-py-1.5 tw-text-sm tw-min-w-0"
        />
        <label className="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">
          to
        </label>
        <input
          type="date"
          value={filters.dateRange.end}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              dateRange: { ...filters.dateRange, end: e.target.value },
            })
          }
          className="tw-rounded-md tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-bg-white dark:tw-bg-gray-700 tw-text-gray-900 dark:tw-text-gray-100 tw-px-3 tw-py-1.5 tw-text-sm tw-min-w-0"
        />
      </div>

      <select
        value={filters.workoutNames[0] ?? ""}
        onChange={(e) =>
          onFiltersChange({
            ...filters,
            workoutNames: e.target.value ? [e.target.value] : [],
          })
        }
        className="tw-w-full sm:tw-w-auto tw-rounded-md tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-bg-white dark:tw-bg-gray-700 tw-text-gray-900 dark:tw-text-gray-100 tw-px-3 tw-py-1.5 tw-text-sm"
      >
        <option value="">All Workouts</option>
        {workoutNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      <select
        value={filters.exerciseNames[0] ?? ""}
        onChange={(e) =>
          onFiltersChange({
            ...filters,
            exerciseNames: e.target.value ? [e.target.value] : [],
          })
        }
        className="tw-w-full sm:tw-w-auto tw-rounded-md tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-bg-white dark:tw-bg-gray-700 tw-text-gray-900 dark:tw-text-gray-100 tw-px-3 tw-py-1.5 tw-text-sm"
      >
        <option value="">All Exercises</option>
        {exerciseNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      {!!(filters.dateRange.start ||
        filters.dateRange.end ||
        filters.workoutNames.length ||
        filters.exerciseNames.length) && (
        <button
          onClick={() =>
            onFiltersChange({
              dateRange: { start: "", end: "" },
              workoutNames: [],
              exerciseNames: [],
            })
          }
          className="tw-text-sm tw-text-blue-600 dark:tw-text-blue-400 hover:tw-underline tw-whitespace-nowrap"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
