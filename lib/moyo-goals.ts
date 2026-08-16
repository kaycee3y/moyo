export type CheckInReason = "too-difficult" | "distracted" | "too-tired" | "something-came-up";

export type MoyoGoal = {
  id: string;
  title: string;
  description: string;
  totalDays: number;
  currentDay: number;
  completedDays: number[];
  firstStep?: string;
  lastCheckInReason?: CheckInReason;
  createdAt: number;
  updatedAt: number;
};

const GOALS_KEY = "moyo-goals";

export function getGoals(): MoyoGoal[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(GOALS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveGoals(goals: MoyoGoal[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

export function createGoal(
  title: string,
  description: string,
  totalDays: number
): MoyoGoal {
  const now = Date.now();

  return {
    id: crypto.randomUUID(),
    title,
    description,
    totalDays,
    currentDay: 1,
    completedDays: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function updateGoalStep(goal: MoyoGoal, step: string): MoyoGoal {
  return {
    ...goal,
    firstStep: step,
    updatedAt: Date.now(),
  };
}

export function updateGoalCheckInReason(goal: MoyoGoal, reason: CheckInReason): MoyoGoal {
  return {
    ...goal,
    lastCheckInReason: reason,
    updatedAt: Date.now(),
  };
}
