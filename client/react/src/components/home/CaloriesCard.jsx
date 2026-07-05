import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ProgressBar from "./ProgressBar";

const CaloriesCard = ({ consumed, goal }) => {
  const remaining = goal - consumed;
  const percentage = Math.round((consumed / goal) * 100);

  return (
    <Card>
      <CardContent>
        <CardHeader>
          <div>
            <CardDescription className="text-sm font-semibold text-slate-500">
              Calories consumed
            </CardDescription>
            <p className="mt-1 text-[11px] text-slate-400">
              kcal = (4 × carbs) + (4 × protein) + (9 × fat)
            </p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-4xl font-bold tracking-tight">
                {consumed.toLocaleString()}
              </span>
              <span className="mb-1 text-sm text-slate-400">
                / {goal.toLocaleString()} kcal
              </span>
            </div>
          </div>
          <span className="rounded-xl bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-600">
            {percentage}% of goal
          </span>
        </CardHeader>

        <ProgressBar
          value={percentage}
          indicatorClassName="bg-gradient-to-r from-emerald-400 to-emerald-600"
          className="mt-7"
        />

        <dl className="mt-6 grid grid-cols-3 divide-x divide-slate-100">
          <div>
            <dt className="text-xs text-slate-400">Goal</dt>
            <dd className="mt-1 font-semibold">{goal.toLocaleString()}</dd>
          </div>
          <div className="pl-5">
            <dt className="text-xs text-slate-400">Food</dt>
            <dd className="mt-1 font-semibold">{consumed.toLocaleString()}</dd>
          </div>
          <div className="pl-5">
            <dt className="text-xs text-slate-400">Remaining</dt>
            <dd className="mt-1 font-semibold text-emerald-600">{remaining}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};

export default CaloriesCard;
