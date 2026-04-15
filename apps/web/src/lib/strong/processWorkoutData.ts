import type {
  StrongSetRow,
  WorkoutSession,
  ExerciseInSession,
  SetData,
  PersonalRecord,
} from "./types";
import { parseDuration } from "./parseStrongCsv";

function toDateKey(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function groupIntoSessions(rows: StrongSetRow[]): WorkoutSession[] {
  const map = new Map<string, StrongSetRow[]>();

  for (const row of rows) {
    const key = `${toDateKey(row.date)}|${row.workoutName}`;
    const group = map.get(key);
    if (group) {
      group.push(row);
    } else {
      map.set(key, [row]);
    }
  }

  const sessions: WorkoutSession[] = [];
  for (const [, group] of map) {
    const first = group[0];
    const exerciseMap = new Map<string, StrongSetRow[]>();

    for (const row of group) {
      const exGroup = exerciseMap.get(row.exerciseName);
      if (exGroup) {
        exGroup.push(row);
      } else {
        exerciseMap.set(row.exerciseName, [row]);
      }
    }

    const exercises: ExerciseInSession[] = [];
    for (const [exerciseName, exRows] of exerciseMap) {
      const sets: SetData[] = exRows.map((r) => ({
        setOrder: r.setOrder,
        weight: r.weight,
        reps: r.reps,
        volume: r.weight * r.reps,
        distance: r.distance,
        seconds: r.seconds,
        rpe: r.rpe,
      }));

      exercises.push({
        exerciseName,
        sets,
        totalVolume: sets.reduce((sum, s) => sum + s.volume, 0),
        maxWeight: Math.max(...sets.map((s) => s.weight)),
        maxReps: Math.max(...sets.map((s) => s.reps)),
        maxSetVolume: Math.max(...sets.map((s) => s.volume)),
      });
    }

    sessions.push({
      date: first.date,
      workoutName: first.workoutName,
      durationMinutes: parseDuration(first.duration),
      exercises,
      totalVolume: exercises.reduce((sum, e) => sum + e.totalVolume, 0),
    });
  }

  return sessions.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function getWorkoutProgression(
  sessions: WorkoutSession[],
): { date: string; workoutName: string; totalVolume: number }[] {
  return sessions.map((s) => ({
    date: toDateKey(s.date),
    workoutName: s.workoutName,
    totalVolume: s.totalVolume,
  }));
}

export function getExerciseProgression(
  sessions: WorkoutSession[],
  exerciseName: string,
): { date: string; maxWeight: number; totalVolume: number; maxReps: number }[] {
  const result: {
    date: string;
    maxWeight: number;
    totalVolume: number;
    maxReps: number;
  }[] = [];

  for (const session of sessions) {
    for (const ex of session.exercises) {
      if (ex.exerciseName === exerciseName) {
        result.push({
          date: toDateKey(session.date),
          maxWeight: ex.maxWeight,
          totalVolume: ex.totalVolume,
          maxReps: ex.maxReps,
        });
      }
    }
  }

  return result;
}

export function getWorkoutFrequency(
  sessions: WorkoutSession[],
  granularity: "week" | "month",
): { period: string; count: number }[] {
  const map = new Map<string, number>();

  for (const s of sessions) {
    let key: string;
    if (granularity === "month") {
      key = `${s.date.getFullYear()}-${String(s.date.getMonth() + 1).padStart(2, "0")}`;
    } else {
      const d = new Date(s.date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diff));
      key = `W ${toDateKey(monday)}`;
    }
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  return Array.from(map.entries())
    .map(([period, count]) => ({ period, count }))
    .sort((a, b) => a.period.localeCompare(b.period));
}

export function getVolumeDistribution(
  sessions: WorkoutSession[],
): { exerciseName: string; totalVolume: number }[] {
  const map = new Map<string, number>();

  for (const s of sessions) {
    for (const ex of s.exercises) {
      map.set(ex.exerciseName, (map.get(ex.exerciseName) ?? 0) + ex.totalVolume);
    }
  }

  return Array.from(map.entries())
    .map(([exerciseName, totalVolume]) => ({ exerciseName, totalVolume }))
    .sort((a, b) => b.totalVolume - a.totalVolume);
}

export function getPersonalRecords(
  sessions: WorkoutSession[],
): PersonalRecord[] {
  const map = new Map<
    string,
    {
      maxWeight: { value: number; date: Date };
      maxReps: { value: number; date: Date };
      maxSetVolume: { value: number; date: Date };
      maxSessionVolume: { value: number; date: Date };
    }
  >();

  for (const s of sessions) {
    for (const ex of s.exercises) {
      let rec = map.get(ex.exerciseName);
      if (!rec) {
        rec = {
          maxWeight: { value: 0, date: s.date },
          maxReps: { value: 0, date: s.date },
          maxSetVolume: { value: 0, date: s.date },
          maxSessionVolume: { value: 0, date: s.date },
        };
        map.set(ex.exerciseName, rec);
      }

      if (ex.maxWeight > rec.maxWeight.value) {
        rec.maxWeight = { value: ex.maxWeight, date: s.date };
      }
      if (ex.maxReps > rec.maxReps.value) {
        rec.maxReps = { value: ex.maxReps, date: s.date };
      }
      if (ex.maxSetVolume > rec.maxSetVolume.value) {
        rec.maxSetVolume = { value: ex.maxSetVolume, date: s.date };
      }
      if (ex.totalVolume > rec.maxSessionVolume.value) {
        rec.maxSessionVolume = { value: ex.totalVolume, date: s.date };
      }
    }
  }

  return Array.from(map.entries())
    .map(([exerciseName, rec]) => ({ exerciseName, ...rec }))
    .sort((a, b) => b.maxSessionVolume.value - a.maxSessionVolume.value);
}

/** Epley formula: weight × (1 + reps / 30). Only meaningful for reps <= 30 with weight > 0. */
export function estimateE1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

export function getE1RMProgression(
  sessions: WorkoutSession[],
  exerciseName: string,
): { date: string; e1rm: number; weight: number; reps: number }[] {
  const result: { date: string; e1rm: number; weight: number; reps: number }[] = [];

  for (const session of sessions) {
    for (const ex of session.exercises) {
      if (ex.exerciseName !== exerciseName) continue;

      let bestE1RM = 0;
      let bestWeight = 0;
      let bestReps = 0;

      for (const set of ex.sets) {
        const e1rm = estimateE1RM(set.weight, set.reps);
        if (e1rm > bestE1RM) {
          bestE1RM = e1rm;
          bestWeight = set.weight;
          bestReps = set.reps;
        }
      }

      if (bestE1RM > 0) {
        result.push({
          date: toDateKey(session.date),
          e1rm: bestE1RM,
          weight: bestWeight,
          reps: bestReps,
        });
      }
    }
  }

  return result;
}

export type OverloadStatus = "progressing" | "maintaining" | "regressing";

export interface ExerciseOverloadSummary {
  exerciseName: string;
  status: OverloadStatus;
  recentE1RM: number;
  previousE1RM: number;
  changePercent: number;
  sessionCount: number;
}

/**
 * Compares the average E1RM of the last `recentCount` sessions to the prior
 * `recentCount` sessions for each exercise. Requires at least 2 sessions.
 */
export function getOverloadSummaries(
  sessions: WorkoutSession[],
  recentCount = 3,
): ExerciseOverloadSummary[] {
  const exerciseSessionsMap = new Map<
    string,
    { date: Date; bestE1RM: number }[]
  >();

  for (const session of sessions) {
    for (const ex of session.exercises) {
      let bestE1RM = 0;
      for (const set of ex.sets) {
        const e1rm = estimateE1RM(set.weight, set.reps);
        if (e1rm > bestE1RM) bestE1RM = e1rm;
      }
      if (bestE1RM <= 0) continue;

      const list = exerciseSessionsMap.get(ex.exerciseName) ?? [];
      list.push({ date: session.date, bestE1RM });
      exerciseSessionsMap.set(ex.exerciseName, list);
    }
  }

  const summaries: ExerciseOverloadSummary[] = [];

  for (const [exerciseName, entries] of exerciseSessionsMap) {
    if (entries.length < 2) continue;

    entries.sort((a, b) => a.date.getTime() - b.date.getTime());

    const recent = entries.slice(-recentCount);
    const prior = entries.slice(
      Math.max(0, entries.length - recentCount * 2),
      entries.length - recentCount,
    );

    if (!prior.length) continue;

    const avgRecent = recent.reduce((s, e) => s + e.bestE1RM, 0) / recent.length;
    const avgPrior = prior.reduce((s, e) => s + e.bestE1RM, 0) / prior.length;
    const changePercent =
      avgPrior > 0 ? ((avgRecent - avgPrior) / avgPrior) * 100 : 0;

    let status: OverloadStatus;
    if (changePercent > 1.5) status = "progressing";
    else if (changePercent < -1.5) status = "regressing";
    else status = "maintaining";

    summaries.push({
      exerciseName,
      status,
      recentE1RM: Math.round(avgRecent),
      previousE1RM: Math.round(avgPrior),
      changePercent: Math.round(changePercent * 10) / 10,
      sessionCount: entries.length,
    });
  }

  return summaries.sort((a, b) => b.changePercent - a.changePercent);
}

export function getDurationTrends(
  sessions: WorkoutSession[],
): { date: string; durationMinutes: number; workoutName: string }[] {
  return sessions.map((s) => ({
    date: toDateKey(s.date),
    durationMinutes: s.durationMinutes,
    workoutName: s.workoutName,
  }));
}
