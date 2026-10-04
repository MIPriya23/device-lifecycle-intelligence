import {
  Truck,
  Wrench,
  MapPin,
  Package,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

interface DeviceHistorySummary {
  installed_locations: number;
  truck_rolls: number;
  repair_events: number;
  component_replacements: number;
  returned_issues: number;
}

interface Props {
  summary: DeviceHistorySummary;
  onViewHistory?: () => void;
}

const metricDefs = [
  {
    key: "installed_locations",
    label: "Installed Locations",
    icon: MapPin,
    note: "3 locations",
  },
  {
    key: "truck_rolls",
    label: "Truck Rolls",
    icon: Truck,
    note: "4 dispatches",
  },
  {
    key: "repair_events",
    label: "Repair Events",
    icon: Wrench,
    note: "2 at depot",
  },
  {
    key: "component_replacements",
    label: "Part Replacements",
    icon: Package,
    note: "WiFi module",
  },
  {
    key: "returned_issues",
    label: "Returned for Issues",
    icon: AlertTriangle,
    note: "Overheating",
  },
] as const;

const iconColors: Record<string, string> = {
  installed_locations: "#6366f1",
  truck_rolls: "#f59e0b",
  repair_events: "#ef4444",
  component_replacements: "#8b5cf6",
  returned_issues: "#dc2626",
};

export default function DeviceHistoryCard({ summary, onViewHistory }: Props) {
  return (
    <motion.div
      className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
          History Summary
        </p>
      </div>

      {/* Metric rows */}
      <div className="flex-1 space-y-1">
        {metricDefs.map(({ key, label, icon: Icon, note }, i) => {
          const val = summary[key as keyof DeviceHistorySummary];
          const color = iconColors[key];
          return (
            <motion.div
              key={key}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-zinc-50"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0"
                style={{ background: `${color}15` }}
              >
                <Icon
                  className="h-3.5 w-3.5"
                  strokeWidth={1.5}
                  style={{ color }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-500">{label}</p>
                {note && (
                  <p className="text-[10px] text-zinc-400 font-medium">
                    {note}
                  </p>
                )}
              </div>
              <span className="text-lg font-bold text-zinc-900 tabular-nums">
                {val}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* View History Button */}
      <button
        onClick={onViewHistory}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200
                   py-2.5 text-sm font-medium text-zinc-600 transition-all
                   hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 active:scale-[0.98]"
      >
        View Full History
        <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </motion.div>
  );
}
