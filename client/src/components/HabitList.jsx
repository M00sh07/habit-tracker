import React, { useMemo, useState } from "react";
import { markHabitComplete } from "../utils/utils";

function HabitList({ habits, setHabits }) {
  const [frequencyFilter, setFrequencyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Alphabetical");

  const handleCheckbox = (habitId) => {
    markHabitComplete(habitId, new Date());
  };

  const filteredAndSortedHabits = useMemo(() => {
    let list = [...habits];

    // ---- FILTER: Frequency ----
    if (frequencyFilter !== "All") {
      list = list.filter(
        (h) => h.freq?.mode === frequencyFilter
      );
    }

    // ---- FILTER: Completion Status ----
    if (statusFilter === "Completed") {
      list = list.filter((h) => h.lastCompleted);
    } else if (statusFilter === "Incomplete") {
      list = list.filter((h) => !h.lastCompleted);
    }

    // ---- SORT ----
    if (sortBy === "Alphabetical") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortBy === "Created") {
      list.sort((a, b) => a.id - b.id);
    }

    if (sortBy === "Updated") {
      list.sort(
        (a, b) =>
          new Date(b.lastCompleted || 0) -
          new Date(a.lastCompleted || 0)
      );
    }

    return list;
  }, [habits, frequencyFilter, statusFilter, sortBy]);

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-3 sm:p-5 shadow-xl h-full flex flex-col min-h-0">
      <h2 className="text-lg sm:text-xl font-semibold text-sky-300 mb-3">
        Your Habits
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-3">
        <select
          value={frequencyFilter}
          onChange={(e) => setFrequencyFilter(e.target.value)}
          className="bg-slate-800 text-slate-100 rounded-lg px-2 py-1 text-sm"
        >
          <option value="All">All Frequencies</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Custom">Custom</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-800 text-slate-100 rounded-lg px-2 py-1 text-sm"
        >
          <option value="All">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Incomplete">Incomplete</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-slate-800 text-slate-100 rounded-lg px-2 py-1 text-sm"
        >
          <option value="Alphabetical">Alphabetical</option>
          <option value="Created">Creation Date</option>
          <option value="Updated">Last Updated</option>
        </select>
      </div>

      {filteredAndSortedHabits.length === 0 ? (
        <p className="text-slate-400">No matching habits</p>
      ) : (
        <ul className="space-y-2 overflow-y-auto pr-2 flex-1 custom-scrollbar">
          {filteredAndSortedHabits.map((habit) => (
            <li
              key={habit.id}
              className="flex items-center justify-between bg-slate-800 rounded-xl p-3 hover:bg-sky-900/40 transition"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  onChange={() => handleCheckbox(habit.id)}
                  className="accent-sky-500"
                />
                <span className="font-medium truncate">
                  {habit.title}
                </span>
              </div>

              <span className="text-sky-400 font-semibold text-sm">
                🔥 {habit.currentStreak}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HabitList;
