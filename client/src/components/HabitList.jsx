import React from "react";
import { markHabitComplete } from "../utils/utils";

function HabitList({ habits, setHabits }) {

  const handleCheckbox = (habitId) => {
    markHabitComplete(habitId, new Date());
  };

  const handleDelete = (habit) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${habit.title}"?`
    );

    if (!confirmDelete) return;

    setHabits((prev) => prev.filter((h) => h.id !== habit.id));
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-3 sm:p-5 shadow-xl">
      <h2 className="text-lg sm:text-xl font-semibold text-sky-300 mb-4">
        Your Habits
      </h2>

      {habits.length === 0 ? (
        <p className="text-slate-400">No habits yet 🚀</p>
      ) : (
        <ul className="space-y-3">
          {habits.map((habit) => (
            <li
              key={habit.id}
              className="flex items-center justify-between bg-slate-800 rounded-xl p-3"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  onChange={() => handleCheckbox(habit.id)}
                  className="accent-sky-500"
                />
                <span className="font-medium">{habit.title}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sky-400 font-semibold">
                  🔥 {habit.currentStreak}
                </span>

                <button
                  onClick={() => handleDelete(habit)}
                  className="text-red-400 hover:text-red-300"
                  title="Delete habit"
                >
                  🗑
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HabitList;
