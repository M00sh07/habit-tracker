import React, { useState } from "react";
import { markHabitComplete } from "../utils/utils";
import HabitHistoryModal from "./HabitHistoryModal";

function HabitList({ habits, setHabits }) {
  const [historyHabit, setHistoryHabit] = useState(null);

  const handleCheckbox = (habitId) => {
    markHabitComplete(habitId, new Date());
  };

  const handleDelete = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  return (
    <>
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 shadow-xl">
        <h2 className="text-xl font-semibold text-sky-300 mb-4">
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
                  <span className="text-sky-400">
                    🔥 {habit.currentStreak}
                  </span>

                  <button
                    onClick={() => setHistoryHabit(habit)}
                    className="text-sky-400 hover:text-sky-300"
                    title="View History"
                  >
                    📅
                  </button>

                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="text-red-400 hover:text-red-300"
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <HabitHistoryModal
        habit={historyHabit}
        onClose={() => setHistoryHabit(null)}
      />
    </>
  );
}

export default HabitList;
