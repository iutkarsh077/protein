import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ProgressBar from "./ProgressBar";

const MacroNutrientItem = ({ name, value, goal, unit, color }) => {
  const percent = goal > 0 ? Math.round((value / goal) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">{name}</span>
        <span className="text-xs text-slate-400">{percent}%</span>
      </div>
      <p className="mt-3 text-2xl font-bold">
        {value}
        <span className="ml-1 text-xs font-normal text-slate-400">
          / {goal}
          {unit}
        </span>
      </p>
      <ProgressBar
        value={percent}
        size="sm"
        indicatorClassName={color}
        className="mt-3"
      />
    </div>
  );
};

const MacroNutrientsCard = ({ nutrients }) => {
  return (
    <Card className="mt-5">
      <CardContent>
        <CardHeader>
          <div>
            <CardTitle>Macro nutrients</CardTitle>
            <CardDescription>Your daily nutritional balance</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-emerald-600">
            View details
          </Button>
        </CardHeader>

        <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {nutrients.map((nutrient) => (
            <MacroNutrientItem key={nutrient.name} {...nutrient} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MacroNutrientsCard;
