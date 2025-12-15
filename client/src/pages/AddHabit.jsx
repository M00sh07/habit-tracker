import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddHabit() {
  const { habits, setHabits } = useOutletContext();

  const [habitName, setHabitName] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [frequency, setFrequency] = useState("Daily");
  const [isHabitAdded, setIsHabitAdded] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // ---------------- Validation ----------------
  const validateForm = () => {
    const newErrors = {};

    if (!habitName.trim()) {
      newErrors.habitName = "Habit name is required";
    }

    if (!frequency) {
      newErrors.frequency = "Please select a frequency";
    }

    if (!startDate || isNaN(new Date(startDate).getTime())) {
      newErrors.startDate = "Please select a valid start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- Calendar Logic (UNCHANGED) ----------------
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const [selectedYear, selectedMonth] = startDate.split("-").map(Number);

  const toLocalDate = (yyyyMmDd) => {
    const [y, m, d] = yyyyMmDd.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const sameYMD = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const atMidnight = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const daysBetween = (a, b) =>
    Math.round((atMidnight(a) - atMidnight(b)) / 86400000);

  const start = toLocalDate(startDate);
  const today = new Date();

  const daysInMonth = Array.from(
    { length: getDaysInMonth(selectedYear, selectedMonth - 1) },
    (_, i) => {
      const date = new Date(selectedYear, selectedMonth - 1, i + 1);
      const diff = daysBetween(date, start);

      const isStartDate = sameYMD(date, start);
      const isToday = sameYMD(date, today);
      const isBeforeStart = diff < 0;
      const isAfterStart = diff > 0;

      const isHabitDay =
        diff >= 0 &&
        (
          frequency === "Daily" ||
          (frequency === "Weekly" && selectedDays.includes(date.getDay())) ||
          (frequency === "Custom" && selectedDays.includes(date.getDay()))
        );

      return {
        day: i + 1,
        isStartDate,
        isBeforeStart,
        isAfterStart,
        isToday,
        isHabitDay,
      };
    }
  );

  const getDayClass = (day) => {
    if (day.isBeforeStart) return "bg-transparent border-gray-600";

    if (day.isStartDate) {
      return `bg-sky-500 bg-opacity-90 text-white font-bold border-sky-700 shadow-lg scale-105 ${
        isHabitAdded ? "animate-bounce" : ""
      }`;
    }

    if (day.isToday && day.isHabitDay)
      return "bg-sky-200/30 border-sky-700 animate-pulse";

    if (day.isAfterStart && day.isHabitDay)
      return "bg-sky-300/30 border-sky-700 animate-pulse-slow hover:bg-sky-400/70 hover:scale-105 cursor-pointer";

    if (day.isAfterStart)
      return "bg-transparent border-sky-700 w-6 h-6 sm:w-8 sm:h-8";

    return "bg-transparent border-gray-600";
  };

  // ---------------- Add Habit ----------------
  const handleAddHabit = () => {
    if (!validateForm()) return;

    const newHabit = {
      id: Date.now(),
      title: habitName,
      highestStreak: 0,
      currentStreak: 0,
      freq: {
        mode: frequency,
        days: selectedDays,
        n: selectedDays.length,
        startDate,
      },
      progress: [],
      lastCompleted: null,
    };

    setHabits((prev) => [...prev, newHabit]);

    toast.success("Habit saved successfully!", {
      position: "top-right",
      autoClose: 2000,
    });

    setIsHabitAdded(true);
    setTimeout(() => {
      setIsHabitAdded(false);
      navigate("/");
    }, 1000);
  };

  const handleDayToggle = (day) => {
    if (frequency === "Weekly") {
      setSelectedDays([day]);
    } else {
      setSelectedDays((prev) =>
        prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
      );
    }
  };

  // ---------------- UI (UNCHANGED) ----------------
  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl border border-sky-800">

        <h1 className="text-5xl font-extrabold text-sky-300 mb-6 text-center">
          Add New Habit
        </h1>

        <div className="flex flex-col sm:flex-row gap-10">

          <div className="w-full sm:w-1/2 space-y-6">

            <div>
              <label className="block text-lg font-semibold text-sky-200 mb-2">
                Habit Name
              </label>
              <input
                type="text"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-700 text-white border-2 border-sky-700"
              />
              {errors.habitName && (
                <p className="text-red-400 text-sm mt-1">{errors.habitName}</p>
              )}
            </div>

            <div>
              <label className="block text-lg font-semibold text-sky-200 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-700 text-white border-2 border-sky-700"
              />
              {errors.startDate && (
                <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-lg font-semibold text-sky-200 mb-2">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => {
                  setFrequency(e.target.value);
                  setSelectedDays([]);
                }}
                className="w-full p-3 rounded-xl bg-slate-700 text-white border-2 border-sky-700"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Custom">Custom</option>
              </select>
              {errors.frequency && (
                <p className="text-red-400 text-sm mt-1">{errors.frequency}</p>
              )}
            </div>

            {(frequency === "Weekly" || frequency === "Custom") && (
              <div className="flex flex-wrap gap-2">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day, index) => (
                  <button
                    key={index}
                    onClick={() => handleDayToggle(index)}
                    className={`px-3 py-1 rounded-lg border-2 ${
                      selectedDays.includes(index)
                        ? "bg-sky-500 text-white border-sky-700"
                        : "bg-slate-700 text-white border-sky-700"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-full sm:w-1/2 space-y-4">
            <h2 className="text-3xl font-extrabold text-sky-300 text-center">
              Your Journey
            </h2>
            <div className="grid grid-cols-7 gap-2">
              {daysInMonth.map((day) => (
                <div
                  key={day.day}
                  className={`w-9 h-9 flex items-center justify-center rounded-full border-2 ${getDayClass(day)}`}
                >
                  {day.day}
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-10 flex justify-center gap-6">
          <Link to="/">
            <button className="px-6 py-2.5 rounded-xl bg-gray-600 text-white">
              Cancel
            </button>
          </Link>
          <button
            onClick={handleAddHabit}
            className="px-6 py-2.5 rounded-xl bg-sky-500 text-white"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
