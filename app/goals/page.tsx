"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Clock3,
  Plus,
  Target,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  MoyoGoal,
  CheckInReason,
  createGoal,
  getGoals,
  saveGoals,
  updateGoalStep,
  updateGoalCheckInReason,
} from "@/lib/moyo-goals";

export default function GoalsPage() {
  const router = useRouter();

  const [goals, setGoals] = useState<MoyoGoal[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [generatingSteps, setGeneratingSteps] = useState<Set<string>>(new Set());

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [days, setDays] = useState("30");

  const [checkInGoalId, setCheckInGoalId] = useState<string | null>(null);

  useEffect(() => {
    setGoals(getGoals());
  }, []);

  async function addGoal() {
    if (!title.trim()) return;

    const newGoal = createGoal(
      title.trim(),
      description.trim(),
      Math.max(1, Number(days) || 30)
    );

    const updated = [newGoal, ...goals];

    setGoals(updated);
    saveGoals(updated);

    setTitle("");
    setDescription("");
    setDays("30");
    setShowCreate(false);

    // Generate first step
    generateFirstStep(newGoal);
  }

  async function generateFirstStep(goal: MoyoGoal) {
    setGeneratingSteps((prev) => new Set([...prev, goal.id]));

    try {
      const response = await fetch("/api/goals/first-step", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: goal.title,
          description: goal.description,
          totalDays: goal.totalDays,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not generate step");
      }

      const data = await response.json();
      const step = data.step;

      // Update goal with step
      const updated = goals.map((g) => {
        if (g.id !== goal.id) return g;
        return updateGoalStep(g, step);
      });

      setGoals(updated);
      saveGoals(updated);
    } catch (error) {
      console.error("Step generation error:", error);
    } finally {
      setGeneratingSteps((prev) => {
        const next = new Set(prev);
        next.delete(goal.id);
        return next;
      });
    }
  }

  function completeToday(goalId: string) {
    const updated = goals.map((goal) => {
      if (goal.id !== goalId) return goal;

      if (goal.completedDays.includes(goal.currentDay)) {
        return goal;
      }

      const newGoal = {
        ...goal,
        completedDays: [
          ...goal.completedDays,
          goal.currentDay,
        ],
        currentDay: Math.min(
          goal.currentDay + 1,
          goal.totalDays
        ),
        updatedAt: Date.now(),
      };

      // Generate next step for the new day
      if (newGoal.currentDay <= newGoal.totalDays) {
        setTimeout(() => generateFirstStep(newGoal), 500);
      }

      return newGoal;
    });

    setGoals(updated);
    saveGoals(updated);
  }

  function handleNeedMoreTime(goalId: string) {
    setCheckInGoalId(goalId);
  }

  function submitCheckInReason(reason: CheckInReason) {
    if (!checkInGoalId) return;

    const updated = goals.map((goal) => {
      if (goal.id !== checkInGoalId) return goal;
      return updateGoalCheckInReason(goal, reason);
    });

    setGoals(updated);
    saveGoals(updated);

    // Generate adapted step based on reason
    const goal = updated.find((g) => g.id === checkInGoalId);
    if (goal) {
      generateFirstStepWithContext(goal, reason);
    }

    setCheckInGoalId(null);
  }

  async function generateFirstStepWithContext(goal: MoyoGoal, reason: CheckInReason) {
    setGeneratingSteps((prev) => new Set([...prev, goal.id]));

    try {
      const reasonLabel = {
        "too-difficult": "too difficult",
        "distracted": "distracted",
        "too-tired": "too tired",
        "something-came-up": "something came up",
      }[reason];

      const response = await fetch("/api/goals/first-step", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: goal.title,
          description: goal.description,
          totalDays: goal.totalDays,
          reason: reasonLabel,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not generate step");
      }

      const data = await response.json();
      const step = data.step;

      // Update goal with adapted step
      const updated = goals.map((g) => {
        if (g.id !== goal.id) return g;
        return updateGoalStep(g, step);
      });

      setGoals(updated);
      saveGoals(updated);
    } catch (error) {
      console.error("Step generation error:", error);
    } finally {
      setGeneratingSteps((prev) => {
        const next = new Set(prev);
        next.delete(goal.id);
        return next;
      });
    }
  }

  return (
    <main className="min-h-[100dvh] bg-[#faf9f7] text-[#151515]">
      <div className="mx-auto min-h-[100dvh] max-w-2xl px-5 sm:px-8">

        <header className="flex items-center justify-between py-5">
          <button
            onClick={() => router.push("/chat")}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-lg font-extrabold tracking-[-0.05em]">
            Your goals
          </h1>

          <button
            onClick={() => setShowCreate(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white shadow-sm"
            aria-label="Create goal"
          >
            <Plus size={18} />
          </button>
        </header>

        <section className="pb-12 pt-8">
          <p className="text-sm leading-6 text-neutral-500">
            Small steps count. MOYO helps you keep moving without
            making your goal feel overwhelming.
          </p>

          <div className="mt-8 space-y-4">
            {goals.length === 0 ? (
              <div className="rounded-[2rem] bg-white px-6 py-12 text-center shadow-sm">
                <Target
                  size={28}
                  className="mx-auto text-neutral-400"
                />

                <p className="mt-4 font-bold">
                  No goals yet.
                </p>

                <p className="mt-2 text-sm text-neutral-400">
                  Start with something small.
                </p>

                <button
                  onClick={() => setShowCreate(true)}
                  className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-bold text-white"
                >
                  Create a goal
                </button>
              </div>
            ) : (
              goals.map((goal) => {
                const completed = goal.completedDays.length;
                const progress =
                  (completed / goal.totalDays) * 100;

                const todayComplete =
                  goal.completedDays.includes(
                    goal.currentDay - 1
                  );

                return (
                  <article
                    key={goal.id}
                    className="rounded-[2rem] bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-extrabold">
                          {goal.title}
                        </h2>

                        {goal.description && (
                          <p className="mt-1 text-sm leading-5 text-neutral-500">
                            {goal.description}
                          </p>
                        )}
                      </div>

                      <Target
                        size={20}
                        className="shrink-0 text-neutral-400"
                      />
                    </div>

                    <div className="mt-6">
                      <div className="mb-2 flex justify-between text-xs font-semibold text-neutral-500">
                        <span>
                          Day {Math.min(goal.currentDay, goal.totalDays)}
                        </span>

                        <span>
                          {completed}/{goal.totalDays}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                        <div
                          className="h-full rounded-full bg-black transition-all"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    {!todayComplete &&
                      completed < goal.totalDays && (
                        <div className="mt-6 space-y-3">
                          {generatingSteps.has(goal.id) && (
                            <div className="rounded-2xl bg-neutral-50 px-4 py-3.5 text-sm text-neutral-600">
                              <div className="flex gap-2">
                                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-400" />
                                <span>MOYO is creating your first step...</span>
                              </div>
                            </div>
                          )}

                          {goal.firstStep && (
                            <div className="rounded-2xl bg-neutral-50 px-4 py-3.5 text-sm leading-5">
                              <p className="font-semibold text-neutral-900">
                                Your step for today:
                              </p>
                              <p className="mt-2 text-neutral-700">
                                {goal.firstStep}
                              </p>
                            </div>
                          )}

                          <button
                            onClick={() =>
                              completeToday(goal.id)
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-3.5 text-sm font-bold text-white"
                          >
                            <Check size={16} />
                            I did today's step
                          </button>

                          <button
                            onClick={() =>
                              handleNeedMoreTime(goal.id)
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-100 px-5 py-3.5 text-sm font-bold"
                          >
                            <Clock3 size={16} />
                            I need more time
                          </button>
                        </div>
                      )}

                    {completed >= goal.totalDays && (
                      <div className="mt-6 rounded-2xl bg-neutral-100 px-4 py-3 text-center text-sm font-bold">
                        Goal completed.
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </section>

        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center">
            <div className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-2xl">
              <h2 className="text-2xl font-extrabold tracking-[-0.04em]">
                What are you working toward?
              </h2>

              <div className="mt-6 space-y-4">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Drink more water"
                  className="w-full rounded-2xl bg-neutral-100 px-4 py-3.5 text-sm outline-none"
                />

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="A little context (optional)"
                  rows={3}
                  className="w-full resize-none rounded-2xl bg-neutral-100 px-4 py-3.5 text-sm outline-none"
                />

                <input
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  type="number"
                  min="1"
                  max="365"
                  placeholder="30"
                  className="w-full rounded-2xl bg-neutral-100 px-4 py-3.5 text-sm outline-none"
                />
              </div>

              <div className="mt-7 flex gap-3">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 rounded-full bg-neutral-100 px-5 py-3.5 text-sm font-bold"
                >
                  Cancel
                </button>

                <button
                  onClick={addGoal}
                  disabled={!title.trim()}
                  className="flex-1 rounded-full bg-black px-5 py-3.5 text-sm font-bold text-white disabled:opacity-30"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {checkInGoalId && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center">
            <div className="w-full max-w-md rounded-[2rem] bg-white p-7 shadow-2xl">
              <h2 className="text-2xl font-extrabold tracking-[-0.04em]">
                What got in the way?
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                No judgment. Let MOYO know so tomorrow's step can be smaller.
              </p>

              <div className="mt-6 space-y-2.5">
                {(
                  [
                    { value: "too-difficult", label: "Too difficult" },
                    { value: "distracted", label: "Distracted" },
                    { value: "too-tired", label: "Too tired" },
                    { value: "something-came-up", label: "Something came up" },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      submitCheckInReason(option.value)
                    }
                    className="w-full rounded-full bg-neutral-100 px-5 py-3.5 text-left text-sm font-semibold transition hover:bg-neutral-200"
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCheckInGoalId(null)}
                className="mt-5 w-full rounded-full bg-neutral-50 px-5 py-3.5 text-sm font-semibold"
              >
                Skip
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
