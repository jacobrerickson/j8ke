import type { StrongSetRow } from "./types";

const STORAGE_KEY = "strong-workout-data";

export function saveWorkoutData(rows: StrongSetRow[]): boolean {
  try {
    const serialized = JSON.stringify(rows);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch {
    return false;
  }
}

export function loadWorkoutData(): StrongSetRow[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StrongSetRow[];
    return parsed.map((r) => ({ ...r, date: new Date(r.date) }));
  } catch {
    return null;
  }
}

export function clearWorkoutData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
