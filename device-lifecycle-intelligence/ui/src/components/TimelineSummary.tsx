import {
  MapPin,
  Truck,
  Wrench,
  RefreshCw,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export interface HistorySummary {
  installed_locations: number;
  truck_rolls: number;
  repair_events: number;
  component_replacements: number;
  returned_issues: number;
}

interface Props {
  summary: HistorySummary;
  deviceId: string;
}

const metrics = [
  {
    key: "installed_locations",
    label: "Installed Locations",
    icon: MapPin,
    color: "#6366f1",
  },
  { key: "truck_rolls", label: "Truck Rolls", icon: Truck, color: "#f59e0b" },
  {
    key: "repair_events",
    label: "Repair Events",
    icon: Wrench,
    color: "#ef4444",
  },
  {
    key: "component_replacements",
    label: "Component Replacements",
    icon: RefreshCw,
    color: "#8048dc",
  },
  {
    key: "returned_issues",
    label: "Returned for Issues",
    icon: AlertCircle,
    color: "#dc2626",
  },
] as const;

export default function TimelineSummary({ summary, deviceId }: Props) {
  return (
    <motion.div
      className="card p-6 flex flex-col gap-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <span className="label-text">Device History Summary</span>

      {/* Router icon placeholder */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-p2/10 to-p3/10 border border-p2/20 shrink-0">
          <svg
            viewBox="0 0 44 30"
            width={40}
            className="text-p3"
            fill="none"
            stroke="currentColor"
          >
            <rect x="2" y="4" width="40" height="22" rx="4" strokeWidth={1.4} />
            <rect
              x="7"
              y="9"
              width="30"
              height="3"
              rx="1.5"
              strokeWidth={1.2}
              strokeOpacity={0.5}
            />
            <rect
              x="7"
              y="15"
              width="20"
              height="2"
              rx="1"
              strokeWidth={1.2}
              strokeOpacity={0.35}
            />
            <circle
              cx="37"
              cy="16"
              r="3.5"
              strokeWidth={1.2}
              strokeOpacity={0.5}
            />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-p5">XB Gateway Device</p>
          <p className="text-xs text-p3 mt-0.5">RDK-B Platform · Xfinity</p>
        </div>
      </div>

      {/* Metric rows */}
      <div className="space-y-0.5">
        {metrics.map(({ key, label, icon: Icon, color }, i) => {
          const val = summary[key as keyof HistorySummary];
          return (
            <motion.div
              key={key}
              className="flex items-center gap-3 py-2.5 border-b border-p2/10 last:border-0"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
            >
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg shrink-0"
                style={{ background: `${color}18` }}
              >
                <Icon
                  className="h-3.5 w-3.5"
                  strokeWidth={1.5}
                  style={{ color }}
                />
              </div>
              <span className="flex-1 text-xs text-p3">{label}</span>
              <span
                className="text-sm font-bold tabular-nums min-w-[1.5rem] text-right"
                style={{ color: val > 0 ? color : "#b325e040" }}
              >
                {val}
              </span>
            </motion.div>
          );
        })}
      </div>

      <Link
        to={`/timeline/${encodeURIComponent(deviceId)}`}
        className="flex items-center justify-center gap-2 btn-ghost text-sm w-full mt-1"
      >
        View Full History
        <ChevronRight className="h-4 w-4" />
      </Link>
    </motion.div>
  );
}
