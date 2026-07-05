import { format, isSameDay, startOfDay, subDays } from "date-fns";

const CALORIE_GOAL = 2200;

const NUTRIENT_GOALS = {
  protein_g: 140,
  carbohydrates_g: 275,
  fat_g: 73,
  fiber_g: 30,
  sugar_g: 50,
};

const NUTRIENT_META = [
  { field: "protein_g", name: "Protein", unit: "g", color: "bg-violet-500" },
  { field: "carbohydrates_g", name: "Carbs", unit: "g", color: "bg-amber-400" },
  { field: "fat_g", name: "Fats", unit: "g", color: "bg-rose-400" },
  { field: "fiber_g", name: "Fiber", unit: "g", color: "bg-emerald-500" },
  { field: "sugar_g", name: "Sugar", unit: "g", color: "bg-orange-400" },
];

const MEAL_TONES = [
  "bg-amber-50",
  "bg-emerald-50",
  "bg-rose-50",
  "bg-violet-50",
];

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};


export const calculateKcal = ({ protein_g, carbohydrates_g, fat_g }) =>
    4 * toNumber(protein_g) +
    4 * toNumber(carbohydrates_g) +
    9 * toNumber(fat_g);

export const normalizeAnalysisEntry = (entry) => {
  const createdAt = entry.createdAt ? new Date(entry.createdAt) : new Date();
  const protein_g = toNumber(entry.protein_g);
  const carbohydrates_g = toNumber(entry.carbohydrates_g);
  const fat_g = toNumber(entry.fat_g);

  return {
    id: entry._id ?? entry.id,
    userId: entry.userId,
    imageKey: entry.imageKey,
    food_name: entry.food_name ?? "Unknown food",
    estimated_weight_g: toNumber(entry.estimated_weight_g),
    protein_g,
    carbohydrates_g,
    fat_g,
    fiber_g: toNumber(entry.fiber_g),
    sugar_g: toNumber(entry.sugar_g),
    confidence: toNumber(entry.confidence),
    calories: calculateKcal({ protein_g, carbohydrates_g, fat_g }),
    createdAt,
  };
};

const isEntryOnDate = (entry, date) =>
  isSameDay(startOfDay(entry.createdAt), startOfDay(date));

const sumByDay = (entries, date, field) =>
  entries
    .filter((entry) => isEntryOnDate(entry, date))
    .reduce((total, entry) => total + entry[field], 0);

const formatMealDetails = (entry) =>
  `${entry.estimated_weight_g}g · P ${entry.protein_g}g · C ${entry.carbohydrates_g}g · F ${entry.fat_g}g · Fiber ${entry.fiber_g}g · Sugar ${entry.sugar_g}g`;

export const getAvailableDates = (analysisData = []) => {
  const entries = analysisData.map(normalizeAnalysisEntry);
  const uniqueDates = new Map();

  for (const entry of entries) {
    const day = startOfDay(entry.createdAt);
    uniqueDates.set(day.toISOString(), day);
  }

  return Array.from(uniqueDates.values()).sort((a, b) => b - a);
};

export const buildNutritionDashboard = (
  analysisData = [],
  selectedDate = new Date(),
) => {
  const entries = analysisData.map(normalizeAnalysisEntry);
  const dayEntries = entries.filter((entry) =>
    isEntryOnDate(entry, selectedDate),
  );

  const consumed = sumByDay(entries, selectedDate, "calories");
  const sugar = sumByDay(entries, selectedDate, "sugar_g");

  const nutrients = NUTRIENT_META.map(({ field, name, unit, color }) => ({
    name,
    value: sumByDay(entries, selectedDate, field),
    goal: NUTRIENT_GOALS[field],
    unit,
    color,
  }));

  const meals = dayEntries.map((entry, index) => ({
    id: entry.id,
    name: entry.food_name,
    time: format(entry.createdAt, "h:mm a"),
    calories: entry.calories,
    estimated_weight_g: entry.estimated_weight_g,
    protein_g: entry.protein_g,
    carbohydrates_g: entry.carbohydrates_g,
    fat_g: entry.fat_g,
    fiber_g: entry.fiber_g,
    sugar_g: entry.sugar_g,
    confidence: entry.confidence,
    items: formatMealDetails(entry),
    emoji: "🍽️",
    tone: MEAL_TONES[index % MEAL_TONES.length],
  }));

  const week = Array.from({ length: 7 }, (_, index) => {
    const date = startOfDay(subDays(new Date(), 6 - index));
    const value = sumByDay(entries, date, "calories");

    return {
      day: format(date, "EEE"),
      value,
      date,
    };
  });

  const daysWithData = week.filter((entry) => entry.value > 0);
  const weeklyAverage = daysWithData.length
    ?
    daysWithData.reduce((total, entry) => total + entry.value, 0) /
    daysWithData.length
    : 0;

  const avgConfidence = dayEntries.length
    ? dayEntries.reduce((total, entry) => total + entry.confidence, 0) /
    dayEntries.length
    : 0;

  return {
    consumed,
    goal: CALORIE_GOAL,
    sugar,
    sugarGoal: NUTRIENT_GOALS.sugar_g,
    avgConfidence,
    nutrients,
    meals,
    week,
    weeklyAverage,
    activeDay: format(new Date(), "EEE"),
  };
};

export const EMPTY_NUTRITION_DASHBOARD = buildNutritionDashboard([]);
