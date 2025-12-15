export const isHabitDue = (habit, date) => {
  if (!habit || !habit.freq) return false;

  switch (habit.freq.mode) {
    case "Daily":
      return true;
    case "Weekly":
    case "Custom":
      return habit.freq.days.includes(date.getDay());
    default:
      return false;
  }
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN");
};

export const arePrerequisitesCompleted = (habit, habits, dateStr) => {
  if (!habit.prerequisites || habit.prerequisites.length === 0) return true;

  return habit.prerequisites.every((id) => {
    const prereq = habits.find((h) => h.id === id);
    return prereq?.progress.includes(dateStr);
  });
};

export const markHabitComplete = (habitId, date, habits, setHabits) => {
  const dateStr = formatDate(date);
  const habit = habits.find((h) => h.id === habitId);
  if (!habit) return;

  if (!arePrerequisitesCompleted(habit, habits, dateStr)) return;

  if (!habit.progress.includes(dateStr)) {
    habit.progress.push(dateStr);
    habit.currentStreak += 1;
    habit.highestStreak = Math.max(habit.highestStreak, habit.currentStreak);
    habit.lastCompleted = dateStr;
  }

  setHabits([...habits]);
};
