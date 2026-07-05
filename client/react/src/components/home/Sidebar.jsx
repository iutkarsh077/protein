import {
  LuBookOpen,
  LuLayoutGrid,
  LuLeaf,
  LuSettings,
  LuTrendingUp,
} from "react-icons/lu";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", icon: LuLayoutGrid, active: true }
];

const Sidebar = () => {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200/80 bg-white px-5 py-7 lg:flex lg:flex-col">
      <div className="flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-200">
          <LuLeaf className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-lg font-bold tracking-tight">Nourish</p>
          <p className="text-xs text-slate-400">Eat well. Feel good.</p>
        </div>
      </div>

      <nav className="mt-12 space-y-2 text-sm font-medium">
        {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
          <a
            key={label}
            href="#"
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 transition-colors",
              active
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
            )}
          >
            <Icon className="size-5 shrink-0" aria-hidden="true" />
            {label}
          </a>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl bg-slate-900 p-4 text-white">
        <p className="text-sm font-semibold">Daily tip</p>
        <p className="mt-2 text-xs leading-5 text-slate-300">
          A colorful plate is usually a nutrient-dense plate.
        </p>
        <button
          type="button"
          className="mt-4 text-xs font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
        >
          Read more →
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
