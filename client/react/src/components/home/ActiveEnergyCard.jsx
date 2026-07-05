import { LuFlame } from "react-icons/lu";

import { Card, CardContent } from "@/components/ui/card";

const ActiveEnergyCard = ({ burned, moveGoalPercent = 64 }) => {
  return (
    <Card className="border-transparent bg-slate-900 text-white">
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Active energy</p>
            <p className="mt-2 text-3xl font-bold">
              {burned}{" "}
              <span className="text-sm font-normal text-slate-400">kcal</span>
            </p>
          </div>
          <div className="grid size-12 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-300">
            <LuFlame className="size-6" aria-hidden="true" />
          </div>
        </div>

        <p className="mt-6 flex items-center gap-2 text-xs text-slate-400">
          <span className="size-2 rounded-full bg-emerald-400" aria-hidden="true" />
          Great work — {moveGoalPercent}% of your move goal
        </p>
      </CardContent>
    </Card>
  );
};

export default ActiveEnergyCard;
