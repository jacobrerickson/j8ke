export interface StrongSetRow {
  date: Date;
  workoutName: string;
  duration: string;
  exerciseName: string;
  setOrder: number;
  weight: number;
  reps: number;
  distance: number;
  seconds: number;
  rpe: number | null;
}

export interface SetData {
  setOrder: number;
  weight: number;
  reps: number;
  volume: number;
  distance: number;
  seconds: number;
  rpe: number | null;
}

export interface ExerciseInSession {
  exerciseName: string;
  sets: SetData[];
  totalVolume: number;
  maxWeight: number;
  maxReps: number;
  maxSetVolume: number;
}

export interface WorkoutSession {
  date: Date;
  workoutName: string;
  durationMinutes: number;
  exercises: ExerciseInSession[];
  totalVolume: number;
}

export interface PersonalRecord {
  exerciseName: string;
  maxWeight: { value: number; date: Date };
  maxReps: { value: number; date: Date };
  maxSetVolume: { value: number; date: Date };
  maxSessionVolume: { value: number; date: Date };
}

export interface FilterState {
  dateRange: { start: string; end: string };
  workoutNames: string[];
  exerciseNames: string[];
}
