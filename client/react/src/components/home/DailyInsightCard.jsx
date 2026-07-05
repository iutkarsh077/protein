import { LuCandy, LuScanEye } from "react-icons/lu";

import { Card, CardContent } from "@/components/ui/card";

const DailyInsightCard = ({ sugar, sugarGoal, avgConfidence }) => {
  const sugarPercent =
    sugarGoal > 0 ? Math.round((sugar / sugarGoal) * 100) : 0;
  const confidencePercent = Math.round(avgConfidence * 100);

  return (
    <Card className="border-transparent bg-slate-900 text-white">
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Sugar intake</p>
            <p className="mt-2 text-3xl font-bold">
              {sugar}{" "}
              <span className="text-sm font-normal text-slate-400">
                / {sugarGoal}g
              </span>
            </p>
          </div>
          <div className="grid size-12 place-items-center rounded-2xl bg-orange-400/15 text-orange-300">
            <LuCandy className="size-6" aria-hidden="true" />
          </div>
        </div>

        <p className="mt-6 flex items-center gap-2 text-xs text-slate-400">
          <span className="size-2 rounded-full bg-orange-400" aria-hidden="true" />
          {sugarPercent}% of daily sugar goal
        </p>

        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
          <div className="grid size-9 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300">
            <LuScanEye className="size-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Avg. analysis confidence</p>
            <p className="text-sm font-semibold">{confidencePercent}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyInsightCard;
