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

export function getDurationTrends(
  sessions: WorkoutSession[],
): { date: string; durationMinutes: number; workoutName: string }[] {
  return sessions.map((s) => ({
    date: toDateKey(s.date),
    durationMinutes: s.durationMinutes,
    workoutName: s.workoutName,
  }));
}
