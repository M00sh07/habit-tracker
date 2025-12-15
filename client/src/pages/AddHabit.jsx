import React, { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddHabit() {
  const { setHabits } = useOutletContext();

  const todayISO = new Date().toISOString().split("T")[0];

  const [habitName, setHabitName] = useState("");
  const [startDate, setStartDate] = useState(todayISO);
  const [frequency, setFrequency] = useState("Daily");
  const [selectedDays, setSelectedDays] = useState([]);
  const [dateError, setDateError] = useState("");

  const navigate = useNavigate();

  /* -------------------- Calendar helpers -------------------- */

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();

  const [year, month] = startDate.split("-").map(Number);

  const toLocalDate = (d) => {
    const [y, m, day] = d.split("-").map(Number);
    return new Date(y, m - 1, day);
  };

  const start = toLocalDate(startDate);
  const today = new Date();

  const daysInMonth = Array.from(
    { length: getDaysInMonth(year, month - 1) },
    (_, i) => {
      const date = new Date(year, month - 1, i + 1);
      const diff =
        Math.floor(
          (date.setHours(0, 0, 0, 0) -
            start.setHours(0, 0, 0, 0)) /
            86400000
        );

      const isHabitDay =
        diff >= 0 &&
        (frequency === "Daily" ||
          (frequency !== "Daily" && selectedDays.includes(date.getDay())));

      return {
        day: i + 1,
        isStart: diff === 0,
        isHabitDay,
        isPast: diff < 0,
      };
    }
  );

  const getDayClass = (d) => {
    if (d.isStart) return "bg-sky-500 text-white scale-105";
    if (d.isHabitDay) return "bg-sky-300/30";
    return "border-slate-600";
  };

  /* -------------------- Handlers -------------------- */

  const handleAddHabit = () => {
    if (!habitName.trim()) {
      toast.error("Habit name is required");
      return;
    }

    if (startDate < todayISO) {
      setDateError("Start date cannot be in the past");
      return;
    }

    setDateError("");

    setHabits((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: habitName,
        currentStreak: 0,
        highestStreak: 0,
        freq: {
          mode: frequency,
          days: selectedDays,
          startDate,
        },
        progress: [],
        lastCompleted: null,
      },
    ]);

    toast.success("Habit added successfully");
    navigate("/");
  };

  const toggleDay = (day) => {
    if (frequency === "Weekly") setSelectedDays([day]);
    else
      setSelectedDays((prev) =>
        prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
      );
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl border border-sky-800">
        <h1 className="text-5xl font-extrabold text-sky-300 text-center mb-6">
          Add New Habit
        </h1>

        <div className="flex flex-col sm:flex-row gap-10">
          {/* LEFT FORM */}
          <div className="w-full sm:w-1/2 space-y-6">
            <div>
              <label className="block text-sky-200 mb-2">Habit Name</label>
              <input
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-700 text-white border-2 border-sky-700"
                placeholder="Morning Run"
              />
            </div>

            <div>
              <label className="block text-sky-200 mb-2">Start Date</label>
              <input
                type="date"
                min={todayISO}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setDateError("");
                }}
                className="w-full p-3 rounded-xl bg-slate-700 text-white border-2 border-sky-700"
              />
              {dateError && (
                <p className="text-red-400 text-sm mt-1">{dateError}</p>
              )}
            </div>

            <div>
              <label className="block text-sky-200 mb-2">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => {
                  setFrequency(e.target.value);
                  setSelectedDays([]);
                }}
                className="w-full p-3 rounded-xl bg-slate-700 text-white border-2 border-sky-700"
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Custom</option>
              </select>
            </div>

            {(frequency === "Weekly" || frequency === "Custom") && (
              <div className="flex gap-2 flex-wrap">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (d, i) => (
                    <button
                      key={i}
                      onClick={() => toggleDay(i)}
                      className={`px-3 py-1 rounded-lg border ${
                        selectedDays.includes(i)
                          ? "bg-sky-500"
                          : "bg-slate-700"
                      }`}
                    >
                      {d}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* RIGHT CALENDAR (RESTORED) */}
          <div className="w-full sm:w-1/2">
            <h2 className="text-3xl text-sky-300 text-center mb-4">
              Your Journey
            </h2>

            <div className="grid grid-cols-7 gap-2 text-center">
              {daysInMonth.map((d) => (
                <div
                  key={d.day}
                  className={`w-9 h-9 flex items-center justify-center rounded-full border transition ${getDayClass(
                    d
                  )}`}
                >
                  {d.day}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-10 flex justify-center gap-6">
          <Link to="/">
            <button className="px-6 py-2 rounded-xl bg-gray-600 text-white">
              Cancel
            </button>
          </Link>
          <button
            onClick={handleAddHabit}
            className="px-6 py-2 rounded-xl bg-sky-500 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
