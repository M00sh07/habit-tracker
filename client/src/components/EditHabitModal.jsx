import React, { useState, useEffect } from "react";

function EditHabitModal({ habit, onClose, onSave }) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (habit) setTitle(habit.title);
  }, [habit]);

  const handleSave = () => {
    onSave({ ...habit, title });
    onClose();
  };

  if (!habit) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-xl p-6 w-[90%] max-w-md shadow-xl">
        <h2 className="text-xl font-semibold text-sky-300 mb-4">
          Edit Habit
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-slate-800 text-slate-100 rounded-lg px-3 py-2 mb-4"
          placeholder="Habit name"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-sky-500 text-slate-900 hover:bg-sky-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditHabitModal;
