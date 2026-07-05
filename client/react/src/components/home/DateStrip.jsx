import { format, isSameDay, isToday, isYesterday } from "date-fns";

import { cn } from "@/lib/utils";

const getDateLabel = (date) => {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE");
};

const DateStrip = ({ dates = [], selectedDate, onDateSelect }) => {
  if (dates.length === 0) {
    return null;
  }

  return (
    <section className="scrollbar-hide mt-8 overflow-x-auto">
      <div className="flex min-w-max gap-2">
        {dates.map((date) => {
          const isSelected = isSameDay(date, selectedDate);

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => onDateSelect(date)}
              className={cn(
                "flex w-28 items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors",
                isSelected
                  ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-100"
                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200",
              )}
            >
              <div
                className={cn(
                  "grid size-9 place-items-center rounded-xl text-sm font-bold",
                  isSelected ? "bg-white/20" : "bg-slate-50 text-slate-800",
                )}
              >
                {format(date, "d")}
              </div>
              <div>
                <p className="text-xs font-semibold">{getDateLabel(date)}</p>
                <p
                  className={cn(
                    "text-[11px]",
                    isSelected ? "text-emerald-100" : "text-slate-400",
                  )}
                >
                  {format(date, "MMM")}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default DateStrip;
