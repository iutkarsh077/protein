import { cn } from "@/lib/utils";

const ProgressBar = ({
  value,
  size = "md",
  className,
  trackClassName,
  indicatorClassName,
}) => {
  const height = size === "sm" ? "h-2" : "h-3";

  return (
    <div
      className={cn("overflow-hidden rounded-full bg-slate-100", height, className, trackClassName)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full transition-all", indicatorClassName)}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
};

export default ProgressBar;
