import React, { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddHabit() {
  const { habits, setHabits } = useOutletContext();

  const [habitName, setHabitName] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [frequency, setFrequency] = useState("Daily");
  const [selectedDays, setSelectedDays] = useState([]);
  const [prerequisites, setPrerequisites] = useState([]);

  const navigate = useNavigate();

  /* ---------- DAY SELECTION ---------- */
  const handleDayToggle = (day) => {
    if (frequency === "Weekly") {
      setSelectedDays([day]);
    } else {
      setSelectedDays((prev) =>
        prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
      );
    }
  };

  /* ---------- PREREQUISITES ---------- */
  const togglePrerequisite = (id) => {
    setPrerequisites((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  /* ---------- SAVE ---------- */
  const handleAddHabit = () => {
    if (!habitName.trim()) {
      toast.error("Please enter a habit name");
      return;
    }

    const newHabit = {
      id: Date.now(),
      title: habitName,
      freq: {
        mode: frequency,
        days: selectedDays,
        startDate,
      },
      progress: [],
      currentStreak: 0,
      highestStreak: 0,
      lastCompleted: null,
      prerequisites, // ✅ NEW
    };

    setHabits((prev) => [...prev, newHabit]);

    toast.success("Habit added successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto bg-slate-800 rounded-2xl p-8 shadow-xl border border-sky-800">
        <h1 className="text-4xl font-bold text-sky-300 mb-6 text-center">
          Add New Habit
        </h1>

        <div className="flex flex-col sm:flex-row gap-10">
          {/* ---------- LEFT FORM ---------- */}
          <div className="w-full sm:w-1/2 space-y-6">
            <div>
              <label className="text-sky-200 font-semibold">Habit Name</label>
              <input
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-700 text-white border border-sky-700"
              />
            </div>

            <div>
              <label className="text-sky-200 font-semibold">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-700 text-white border border-sky-700"
              />
            </div>

            <div>
              <label className="text-sky-200 font-semibold">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => {
                  setFrequency(e.target.value);
                  setSelectedDays([]);
                }}
                className="w-full p-3 rounded-xl bg-slate-700 text-white border border-sky-700"
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Custom</option>
              </select>
            </div>

            {(frequency === "Weekly" || frequency === "Custom") && (
              <div>
                <label className="text-sky-200 font-semibold">
                  Select Days
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day, i) => (
                      <button
                        key={i}
                        onClick={() => handleDayToggle(i)}
                        className={`px-3 py-1 rounded-lg border ${
                          selectedDays.includes(i)
                            ? "bg-sky-500 text-white"
                            : "bg-slate-700 text-white"
                        }`}
                      >
                        {day}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* ---------- PREREQUISITES UI ---------- */}
            {habits.length > 0 && (
              <div>
                <label className="text-sky-200 font-semibold">
                  Prerequisites
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {habits.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => togglePrerequisite(h.id)}
                      className={`px-3 py-1 rounded-lg border ${
                        prerequisites.includes(h.id)
                          ? "bg-purple-600 text-white"
                          : "bg-slate-700 text-white"
                      }`}
                    >
                      {h.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ---------- ACTIONS ---------- */}
        <div className="mt-8 flex justify-center gap-6">
          <Link to="/">
            <button className="px-6 py-2 bg-gray-600 rounded-lg text-white">
              Cancel
            </button>
          </Link>
          <button
            onClick={handleAddHabit}
            className="px-6 py-2 bg-sky-500 rounded-lg text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
