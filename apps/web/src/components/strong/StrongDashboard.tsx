"use client";

import { useState, useMemo } from "react";
import type { StrongSetRow, FilterState, WorkoutSession } from "@/lib/strong/types";
import { groupIntoSessions } from "@/lib/strong/processWorkoutData";
import {
  getWorkoutProgression,
  getExerciseProgression,
  getVolumeDistribution,
  getPersonalRecords,
  getDurationTrends,
} from "@/lib/strong/processWorkoutData";
import { formatVolume } from "./charts/chartTheme";
import { FilterBar } from "./filters/FilterBar";
import { WorkoutProgressionChart } from "./charts/WorkoutProgressionChart";
import { ExerciseProgressionChart } from "./charts/ExerciseProgressionChart";
import { WorkoutFrequencyChart } from "./charts/WorkoutFrequencyChart";
import { VolumeDistributionChart } from "./charts/VolumeDistributionChart";
import { DurationTrendChart } from "./charts/DurationTrendChart";
import { PersonalRecordsTable } from "./charts/PersonalRecordsTable";

type Tab = "overview" | "exercises" | "records";

interface Props {
  rawRows: StrongSetRow[];
  onClear: () => void;
  onNewUpload: (rows: StrongSetRow[]) => void;
}

export function StrongDashboard({ rawRows, onClear, onNewUpload }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { start: "", end: "" },
    workoutNames: [],
    exerciseNames: [],
  });
  const [selectedExercise, setSelectedExercise] = useState<string>("");

  const allSessions = useMemo(() => groupIntoSessions(rawRows), [rawRows]);

  const filteredSessions = useMemo(() => {
    let sessions = allSessions;

    if (filters.dateRange.start) {
      const start = new Date(filters.dateRange.start);
      sessions = sessions.filter((s) => s.date >= start);
    }
    if (filters.dateRange.end) {
      const end = new Date(filters.dateRange.end);
      end.setHours(23, 59, 59, 999);
      sessions = sessions.filter((s) => s.date <= end);
    }
    if (filters.workoutNames.length) {
      sessions = sessions.filter((s) =>
        filters.workoutNames.includes(s.workoutName),
      );
    }
    if (filters.exerciseNames.length) {
      sessions = sessions.map((s) => ({
        ...s,
        exercises: s.exercises.filter((e) =>
          filters.exerciseNames.includes(e.exerciseName),
        ),
        totalVolume: s.exercises
          .filter((e) => filters.exerciseNames.includes(e.exerciseName))
          .reduce((sum, e) => sum + e.totalVolume, 0),
      })).filter((s) => s.exercises.length > 0);
    }

    return sessions;
  }, [allSessions, filters]);

  const exerciseNames = useMemo(
    () =>
      [
        ...new Set(
          allSessions.flatMap((s) => s.exercises.map((e) => e.exerciseName)),
        ),
      ].sort(),
    [allSessions],
  );

  const stats = useMemo(() => {
    const totalWorkouts = filteredSessions.length;
    const totalExercises = new Set(
      filteredSessions.flatMap((s) => s.exercises.map((e) => e.exerciseName)),
    ).size;
    const totalVolume = filteredSessions.reduce(
      (sum, s) => sum + s.totalVolume,
      0,
    );
    const avgDuration =
      totalWorkouts > 0
        ? Math.round(
            filteredSessions.reduce((sum, s) => sum + s.durationMinutes, 0) /
              totalWorkouts,
          )
        : 0;
    return { totalWorkouts, totalExercises, totalVolume, avgDuration };
  }, [filteredSessions]);

  const progressionData = useMemo(
    () => getWorkoutProgression(filteredSessions),
    [filteredSessions],
  );
  const volumeDistData = useMemo(
    () => getVolumeDistribution(filteredSessions),
    [filteredSessions],
  );
  const durationData = useMemo(
    () => getDurationTrends(filteredSessions),
    [filteredSessions],
  );
  const recordsData = useMemo(
    () => getPersonalRecords(filteredSessions),
    [filteredSessions],
  );
  const exerciseData = useMemo(
    () =>
      selectedExercise
        ? getExerciseProgression(filteredSessions, selectedExercise)
        : [],
    [filteredSessions, selectedExercise],
  );

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "exercises", label: "Exercises" },
    { key: "records", label: "Records" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="tw-flex tw-flex-col sm:tw-flex-row tw-items-start sm:tw-items-center tw-justify-between tw-gap-4 tw-mb-6">
        <div>
          <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900 dark:tw-text-gray-100">
            Workout Analytics
          </h1>
          <p className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400 tw-mt-1">
            {rawRows.length.toLocaleString()} sets across{" "}
            {allSessions.length} workouts
          </p>
        </div>
        <div className="tw-flex tw-gap-3">
          <label className="tw-text-sm tw-text-blue-600 dark:tw-text-blue-400 hover:tw-underline tw-cursor-pointer">
            Upload new CSV
            <input
              type="file"
              accept=".csv"
              className="tw-hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const { parseStrongCsv } = await import(
                  "@/lib/strong/parseStrongCsv"
                );
                const { rows } = await parseStrongCsv(file);
                if (rows.length) onNewUpload(rows);
              }}
            />
          </label>
          <button
            onClick={onClear}
            className="tw-text-sm tw-text-red-500 hover:tw-underline"
          >
            Clear data
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="tw-grid tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4 tw-mb-6">
        {[
          { label: "Workouts", value: stats.totalWorkouts },
          { label: "Exercises", value: stats.totalExercises },
          {
            label: "Total Volume",
            value: `${formatVolume(stats.totalVolume)} lbs`,
          },
          { label: "Avg Duration", value: `${stats.avgDuration} min` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow tw-p-4"
          >
            <p className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">
              {stat.label}
            </p>
            <p className="tw-text-2xl tw-font-bold tw-text-gray-900 dark:tw-text-gray-100">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <FilterBar
        sessions={allSessions}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Tabs */}
      <div className="tw-border-b tw-border-gray-200 dark:tw-border-gray-700 tw-mb-6 tw-overflow-x-auto">
        <div className="tw-flex tw-gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`tw-pb-3 tw-text-sm tw-font-medium tw-border-b-2 tw-whitespace-nowrap ${
                activeTab === tab.key
                  ? "tw-border-blue-500 tw-text-blue-600 dark:tw-text-blue-400"
                  : "tw-border-transparent tw-text-gray-500 dark:tw-text-gray-400 hover:tw-text-gray-700 dark:hover:tw-text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6">
          <WorkoutProgressionChart data={progressionData} />
          <WorkoutFrequencyChart sessions={filteredSessions} />
          <VolumeDistributionChart data={volumeDistData} />
          <DurationTrendChart data={durationData} />
        </div>
      )}

      {activeTab === "exercises" && (
        <div>
          <div className="tw-mb-6">
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="tw-rounded-md tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-bg-white dark:tw-bg-gray-700 tw-text-gray-900 dark:tw-text-gray-100 tw-px-4 tw-py-2 tw-text-sm"
            >
              <option value="">Select an exercise...</option>
              {exerciseNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          {selectedExercise ? (
            <ExerciseProgressionChart
              data={exerciseData}
              exerciseName={selectedExercise}
            />
          ) : (
            <p className="tw-text-gray-500 dark:tw-text-gray-400 tw-text-center tw-py-12">
              Select an exercise above to view its progression over time.
            </p>
          )}
        </div>
      )}

      {activeTab === "records" && <PersonalRecordsTable records={recordsData} />}
    </div>
  );
}
