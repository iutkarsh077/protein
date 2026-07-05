import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const MealItem = ({
  name,
  time,
  calories,
  items,
  estimated_weight_g,
  confidence,
  emoji,
  tone,
}) => (
  <div className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
    <div
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-2xl text-xl",
        tone,
      )}
      aria-hidden="true"
    >
      {emoji}
    </div>

    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <p className="truncate text-sm font-semibold">{name}</p>
        <span className="text-[10px] text-slate-400">{time}</span>
        {confidence > 0 && (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
            {Math.round(confidence * 100)}% confidence
          </span>
        )}
      </div>
      <p className="mt-1 text-xs leading-5 text-slate-500">{items}</p>
      <p className="mt-1 text-[11px] text-slate-400">
        Weight: {estimated_weight_g}g
      </p>
    </div>

    <p className="shrink-0 text-sm font-bold">
      {calories}
      <span className="ml-1 text-[10px] font-normal text-slate-400">kcal</span>
    </p>
  </div>
);

const TodaysMealsCard = ({ meals }) => {
  return (
    <Card>
      <CardContent>
        <CardHeader>
          <div>
            <CardTitle>Today&apos;s meals</CardTitle>
            <CardDescription>{meals.length} meals logged</CardDescription>
          </div>
          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
            + Add food
          </Button>
        </CardHeader>

        <div className="mt-5 divide-y divide-slate-100">
          {meals.length > 0 ? (
            meals.map((meal) => (
              <MealItem key={meal.id ?? `${meal.name}-${meal.time}`} {...meal} />
            ))
          ) : (
            <p className="py-6 text-center text-sm text-slate-400">
              No meals logged for this day. Upload a food photo to get started.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysMealsCard;
