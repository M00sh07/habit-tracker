import React from "react";

function HabitHistoryModal({ habit, onClose }) {
  if (!habit) return null;

  const formattedDates =
    habit.progress?.length > 0
      ? habit.progress.map((d) =>
          new Date(d).toLocaleDateString("en-GB")
        )
      : [];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-xl p-6 w-[90%] max-w-md shadow-xl">
        <h2 className="text-xl font-semibold text-sky-300 mb-4">
          {habit.title} – History
        </h2>

        {formattedDates.length === 0 ? (
          <p className="text-slate-400 text-center">
            No completions yet
          </p>
        ) : (
          <ul className="max-h-60 overflow-y-auto space-y-2">
            {formattedDates.map((date, index) => (
              <li
                key={index}
                className="bg-slate-800 rounded-lg px-3 py-2 text-slate-200 text-sm"
              >
                {date}
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-end mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default HabitHistoryModal;
