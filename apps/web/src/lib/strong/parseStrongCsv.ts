import Papa from "papaparse";
import type { StrongSetRow } from "./types";

export function parseDuration(raw: string): number {
  if (!raw) return 0;
  const hMatch = raw.match(/(\d+)\s*h/);
  const mMatch = raw.match(/(\d+)\s*m/);
  const sMatch = raw.match(/(\d+)\s*s/);
  return (
    (hMatch ? parseInt(hMatch[1]) * 60 : 0) +
    (mMatch ? parseInt(mMatch[1]) : 0) +
    (sMatch ? Math.round(parseInt(sMatch[1]) / 60) : 0)
  );
}

const REQUIRED_COLUMNS = [
  "Date",
  "Workout Name",
  "Exercise Name",
  "Set Order",
];

export function parseStrongCsv(
  file: File,
): Promise<{ rows: StrongSetRow[]; errors: string[] }> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const errors: string[] = [];

        if (!results.data.length) {
          resolve({ rows: [], errors: ["CSV file is empty"] });
          return;
        }

        const fields = results.meta.fields ?? [];
        const missing = REQUIRED_COLUMNS.filter((c) => !fields.includes(c));
        if (missing.length) {
          resolve({
            rows: [],
            errors: [`Missing required columns: ${missing.join(", ")}`],
          });
          return;
        }

        const rows: StrongSetRow[] = [];
        for (const raw of results.data as Record<string, string>[]) {
          const date = new Date(raw["Date"] ?? "");
          if (isNaN(date.getTime())) {
            errors.push(`Skipped row with invalid date: "${raw["Date"]}"`);
            continue;
          }

          rows.push({
            date,
            workoutName: (raw["Workout Name"] ?? "").trim(),
            duration: (raw["Duration"] ?? "").trim(),
            exerciseName: (raw["Exercise Name"] ?? "").trim(),
            setOrder: parseInt(raw["Set Order"] ?? "0") || 0,
            weight: parseFloat(raw["Weight"] ?? "0") || 0,
            reps: parseInt(raw["Reps"] ?? "0") || 0,
            distance: parseFloat(raw["Distance"] ?? "0") || 0,
            seconds: parseFloat(raw["Seconds"] ?? "0") || 0,
            rpe: raw["RPE"] ? parseFloat(raw["RPE"]) || null : null,
          });
        }

        resolve({ rows, errors: errors.slice(0, 5) });
      },
      error(err) {
        resolve({ rows: [], errors: [err.message] });
      },
    });
  });
}
