"use client";

import { useState } from "react";
import type { PersonalRecord } from "@/lib/strong/types";
import { formatVolume } from "./chartTheme";

interface Props {
  records: PersonalRecord[];
}

type SortKey = "exerciseName" | "maxWeight" | "maxReps" | "maxSetVolume" | "maxSessionVolume";

function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PersonalRecordsTable({ records }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("maxSessionVolume");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = [...records].sort((a, b) => {
    const dir = sortAsc ? 1 : -1;
    if (sortKey === "exerciseName") {
      return dir * a.exerciseName.localeCompare(b.exerciseName);
    }
    return dir * (a[sortKey].value - b[sortKey].value);
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const headerClass =
    "tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-400 tw-uppercase tw-tracking-wider tw-cursor-pointer hover:tw-text-gray-700 dark:hover:tw-text-gray-200 tw-select-none";

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortAsc ? " ↑" : " ↓") : "";

  if (!records.length) return null;

  return (
    <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow tw-overflow-hidden">
      <div className="tw-p-6 tw-pb-0">
        <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100 tw-mb-4">
          Personal Records
        </h3>
      </div>
      <div className="tw-overflow-x-auto">
        <table className="tw-min-w-full tw-divide-y tw-divide-gray-200 dark:tw-divide-gray-700">
          <thead className="tw-bg-gray-50 dark:tw-bg-gray-900/50">
            <tr>
              <th onClick={() => handleSort("exerciseName")} className={headerClass}>
                Exercise{arrow("exerciseName")}
              </th>
              <th onClick={() => handleSort("maxWeight")} className={headerClass}>
                Max Weight{arrow("maxWeight")}
              </th>
              <th onClick={() => handleSort("maxReps")} className={headerClass}>
                Max Reps{arrow("maxReps")}
              </th>
              <th onClick={() => handleSort("maxSetVolume")} className={headerClass}>
                Best Set{arrow("maxSetVolume")}
              </th>
              <th onClick={() => handleSort("maxSessionVolume")} className={headerClass}>
                Best Session{arrow("maxSessionVolume")}
              </th>
            </tr>
          </thead>
          <tbody className="tw-divide-y tw-divide-gray-200 dark:tw-divide-gray-700">
            {sorted.map((rec) => (
              <tr
                key={rec.exerciseName}
                className="hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700/50"
              >
                <td className="tw-px-4 tw-py-3 tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-gray-100 tw-whitespace-nowrap">
                  {rec.exerciseName}
                </td>
                <td className="tw-px-4 tw-py-3 tw-text-sm tw-text-gray-600 dark:tw-text-gray-300">
                  <span className="tw-font-semibold">{rec.maxWeight.value}</span>
                  <span className="tw-text-gray-400 dark:tw-text-gray-500 tw-ml-1 tw-text-xs">
                    {formatDate(rec.maxWeight.date)}
                  </span>
                </td>
                <td className="tw-px-4 tw-py-3 tw-text-sm tw-text-gray-600 dark:tw-text-gray-300">
                  <span className="tw-font-semibold">{rec.maxReps.value}</span>
                  <span className="tw-text-gray-400 dark:tw-text-gray-500 tw-ml-1 tw-text-xs">
                    {formatDate(rec.maxReps.date)}
                  </span>
                </td>
                <td className="tw-px-4 tw-py-3 tw-text-sm tw-text-gray-600 dark:tw-text-gray-300">
                  <span className="tw-font-semibold">
                    {formatVolume(rec.maxSetVolume.value)}
                  </span>
                  <span className="tw-text-gray-400 dark:tw-text-gray-500 tw-ml-1 tw-text-xs">
                    {formatDate(rec.maxSetVolume.date)}
                  </span>
                </td>
                <td className="tw-px-4 tw-py-3 tw-text-sm tw-text-gray-600 dark:tw-text-gray-300">
                  <span className="tw-font-semibold">
                    {formatVolume(rec.maxSessionVolume.value)}
                  </span>
                  <span className="tw-text-gray-400 dark:tw-text-gray-500 tw-ml-1 tw-text-xs">
                    {formatDate(rec.maxSessionVolume.date)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
