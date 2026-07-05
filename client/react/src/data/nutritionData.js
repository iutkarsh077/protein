export const dailyNutrition = {
  consumed: 1840,
  goal: 2200,
  burned: 320,
  nutrients: [
    { name: 'Protein', value: 112, goal: 140, unit: 'g', color: 'bg-violet-500' },
    { name: 'Carbs', value: 218, goal: 275, unit: 'g', color: 'bg-amber-400' },
    { name: 'Fats', value: 58, goal: 73, unit: 'g', color: 'bg-rose-400' },
    { name: 'Fiber', value: 24, goal: 30, unit: 'g', color: 'bg-emerald-500' },
  ],
  meals: [
    { name: 'Breakfast', time: '8:20 AM', calories: 460, items: 'Greek yogurt, berries & granola', emoji: '🥣', tone: 'bg-amber-50' },
    { name: 'Lunch', time: '1:10 PM', calories: 680, items: 'Grilled chicken harvest bowl', emoji: '🥗', tone: 'bg-emerald-50' },
    { name: 'Afternoon snack', time: '4:30 PM', calories: 210, items: 'Apple & almond butter', emoji: '🍎', tone: 'bg-rose-50' },
    { name: 'Dinner', time: '7:45 PM', calories: 490, items: 'Salmon, greens & roasted potato', emoji: '🍲', tone: 'bg-violet-50' },
  ],
  week: [
    { day: 'Mon', value: 1680 }, { day: 'Tue', value: 1940 },
    { day: 'Wed', value: 1750 }, { day: 'Thu', value: 2080 },
    { day: 'Fri', value: 1840 }, { day: 'Sat', value: 0 },
    { day: 'Sun', value: 0 },
  ],
}
