import React from "react";
import { Link } from "react-router-dom";

function Header({ username }) {
  return (
    <header
      className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 shadow-md border-b"
      style={{
        background: "var(--card)",
        borderColor: "rgba(0,0,0,0.1)",
      }}
    >
      <h1
        className="text-xl sm:text-2xl font-semibold truncate"
        style={{ color: "var(--accent)" }}
      >
        Hello, {username} 👋
      </h1>

      <Link to="/addHabit">
        <button
          className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg font-medium text-sm sm:text-base shadow-sm transition-colors duration-200"
          style={{
            background: "var(--accent)",
            color: "#fff",
          }}
        >
          + Add Habit
        </button>
      </Link>
    </header>
  );
}

export default Header;
