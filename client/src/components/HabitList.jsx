import React from "react";
import { markHabitComplete } from "../utils/utils";

function HabitList({ habits, setHabits }) {

  // Check if all prerequisites are completed today
  const canCompleteHabit = (habit) => {
    if (!habit.prerequisites || habit.prerequisites.length === 0) return true;

    const todayStr = new Date().toLocaleDateString("en-IN");

    return habit.prerequisites.every((pid) => {
      const prereq = habits.find((h) => h.id === pid);
      return prereq && prereq.progress.includes(todayStr);
    });
  };

  const handleCheckbox = (habit) => {
    if (!canCompleteHabit(habit)) return;
    markHabitComplete(habit.id, new Date());
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-3 sm:p-5 shadow-xl h-full flex flex-col min-h-0">
      <h2 className="text-lg sm:text-xl font-semibold text-sky-300 mb-3 sm:mb-4 shrink-0">
        Your Habits
      </h2>

      {habits.length === 0 ? (
        <p className="text-slate-400">No habits yet. Go add some 🚀</p>
      ) : (
        <ul className="space-y-2 sm:space-y-3 overflow-y-auto pr-1 sm:pr-2 flex-1 min-h-0 custom-scrollbar">
          {habits.map((habit) => {
            const locked = !canCompleteHabit(habit);

            return (
              <li
                key={habit.id}
                className={`flex items-center justify-between rounded-xl p-2 sm:p-3 transition-all duration-300 ease-out border
                  ${locked
                    ? "bg-slate-800/50 border-red-500/30 opacity-70"
                    : "bg-slate-800 hover:bg-sky-900/40 hover:scale-[1.01] border-transparent hover:border-sky-500/30"
                  }`}
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <input
                    type="checkbox"
                    disabled={locked}
                    onChange={() => handleCheckbox(habit)}
                    className="w-4 h-4 sm:w-5 sm:h-5 accent-sky-500 rounded-md disabled:cursor-not-allowed"
                  />

                  <span className="text-base sm:text-lg font-medium truncate">
                    {habit.title}
                  </span>

                  {locked && (
                    <span className="text-xs sm:text-sm text-red-400 ml-2">
                      🔒 Locked
                    </span>
                  )}
                </div>

                <span className="text-sky-400 font-semibold flex items-center gap-1 text-sm sm:text-base">
                  🔥 {habit.currentStreak}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default HabitList;
