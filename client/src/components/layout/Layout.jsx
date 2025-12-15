import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeToggle from "../ThemeToggle";

function Layout({ markHabitComplete }) {
  const [habits, setHabits] = useState(() => {
    const stored = localStorage.getItem("habits");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    resetStreakIfMissed();
  }, []);

  const resetStreakIfMissed = () => {
    const today = new Date();

    habits.forEach((habit) => {
      if (!habit.lastCompleted) return;

      const lastDate = new Date(habit.lastCompleted);

      if (habit.freq.mode === "daily") {
        const diffDays = Math.floor(
          (today - lastDate) / (1000 * 60 * 60 * 24)
        );
        if (diffDays > 1) habit.currentStreak = 0;
      } else if (habit.freq.mode === "weekly") {
        const diffDays = Math.floor(
          (today - lastDate) / (1000 * 60 * 60 * 24)
        );
        if (diffDays > 7) habit.currentStreak = 0;
      } else if (habit.freq.mode === "custom") {
        const scheduledDays = habit.freq.days;
        let tempDate = new Date(lastDate);

        while (tempDate < today) {
          tempDate.setDate(tempDate.getDate() + 1);
          const day = tempDate.getDay();
          const tempStr = tempDate.toISOString().split("T")[0];

          if (
            scheduledDays.includes(day) &&
            !habit.progress.includes(tempStr)
          ) {
            habit.currentStreak = 0;
            break;
          }
        }
      }
    });
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      {/* 🌙 THEME TOGGLE (TOP-RIGHT) */}
      <ThemeToggle />

      <Header />

      <main className="p-6">
        <ToastContainer position="top-right" autoClose={2000} />
        <Outlet context={{ habits, setHabits, markHabitComplete }} />
      </main>
    </div>
  );
}

export default Layout;
