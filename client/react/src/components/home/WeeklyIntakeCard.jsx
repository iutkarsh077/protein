import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const WeeklyBar = ({ day, value, isActive, calorieGoal }) => {
  const heightPercent = value
    ? Math.min(Math.round((value / calorieGoal) * 100), 100)
    : 8;

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-end gap-2">
      <div className="relative flex h-full w-full items-end justify-center overflow-hidden">
        <div
          className={cn(
            "w-full max-h-full max-w-7 rounded-t-lg transition-colors",
            isActive
              ? "bg-emerald-500"
              : value
                ? "bg-emerald-100"
                : "bg-slate-100",
          )}
          style={{ height: `${heightPercent}%` }}
        />
      </div>
      <span
        className={cn(
          "text-[10px]",
          isActive ? "font-bold text-emerald-600" : "text-slate-400",
        )}
      >
        {day}
      </span>
    </div>
  );
};

const WeeklyIntakeCard = ({
  week,
  weeklyAverage,
  calorieGoal = 2200,
  activeDay,
}) => {
  return (
    <Card>
      <CardContent>
        <CardHeader className="items-start">
          <div>
            <CardTitle>This week</CardTitle>
            <CardDescription>Daily calorie intake</CardDescription>
          </div>
        </CardHeader>

        <div className="mt-7 flex h-44 items-end justify-between gap-2">
          {week.map((entry) => (
            <WeeklyBar
              key={entry.day}
              day={entry.day}
              value={entry.value}
              isActive={entry.day === activeDay}
              calorieGoal={calorieGoal}
            />
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
          <p className="text-xs text-emerald-700">Weekly average</p>
          <p className="mt-1 text-xl font-bold text-emerald-800">
            {weeklyAverage.toLocaleString()}{" "}
            <span className="text-xs font-normal">kcal/day</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyIntakeCard;
