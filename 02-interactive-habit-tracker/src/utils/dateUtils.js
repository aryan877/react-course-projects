export const getTodayString = () => {
  return new Date().toISOString().split("T")[0];
};

export const getDateString = (date) => {
  return date.toISOString().split("T")[0];
};

export const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const startOfWeek = new Date(today);

  // Set to the beginning of the current week (Sunday)
  startOfWeek.setDate(today.getDate() - currentDay);

  const weekDates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(getDateString(date));
  }

  return weekDates;
};

export const calculateStreak = (completedDays) => {
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);

  // Start from today and go backwards
  while (true) {
    const dateString = getDateString(currentDate);

    if (completedDays[dateString]) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // If today is not completed yet, check yesterday
      if (streak === 0 && dateString === getTodayString()) {
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      }
      break;
    }
  }

  return streak;
};

export const getWeekProgress = (completedDays, weekDates) => {
  const completed = weekDates.filter((date) => completedDays[date]).length;
  return Math.round((completed / 7) * 100);
};
