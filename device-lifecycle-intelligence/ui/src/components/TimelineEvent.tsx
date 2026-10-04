import { motion } from "framer-motion";
import {
  MapPin,
  Wrench,
  Truck,
  AlertCircle,
  Zap,
  Package,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineEventData {
  id: string;
  date: string;
  title: string;
  description: string;
  type:
    | "install"
    | "repair"
    | "truck_roll"
    | "failure"
    | "activation"
    | "deactivation"
    | "warehouse"
    | "return";
}

const typeConfig: Record<
  TimelineEventData["type"],
  { icon: typeof MapPin; color: string; bg: string; label: string }
> = {
  install: {
    icon: MapPin,
    color: "#6366f1",
    bg: "#6366f118",
    label: "Installation",
  },
  repair: { icon: Wrench, color: "#f59e0b", bg: "#f59e0b18", label: "Repair" },
  truck_roll: {
    icon: Truck,
    color: "#8048dc",
    bg: "#8048dc18",
    label: "Truck Roll",
  },
  failure: {
    icon: AlertCircle,
    color: "#ef4444",
    bg: "#ef444418",
    label: "Failure",
  },
  activation: {
    icon: Zap,
    color: "#10b981",
    bg: "#10b98118",
    label: "Activation",
  },
  deactivation: {
    icon: RotateCcw,
    color: "#6b7280",
    bg: "#6b728018",
    label: "Deactivation",
  },
  warehouse: {
    icon: Package,
    color: "#b325e0",
    bg: "#b325e018",
    label: "Warehouse",
  },
  return: {
    icon: AlertCircle,
    color: "#dc2626",
    bg: "#dc262618",
    label: "Return",
  },
};

interface Props {
  event: TimelineEventData;
  isLast: boolean;
  index: number;
}

export default function TimelineEvent({ event, isLast, index }: Props) {
  const cfg = typeConfig[event.type];
  const Icon = cfg.icon;

  return (
    <motion.div
      className="flex gap-4"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.055 }}
    >
      {/* Track column */}
      <div className="flex flex-col items-center">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full shrink-0 ring-4 ring-p1"
          style={{ background: cfg.bg, border: `1.5px solid ${cfg.color}40` }}
        >
          <Icon
            className="h-4 w-4"
            strokeWidth={1.5}
            style={{ color: cfg.color }}
          />
        </div>
        {!isLast && (
          <div className="mt-1 w-px bg-gradient-to-b from-p2/20 to-transparent min-h-[2.5rem] flex-1" />
        )}
      </div>

      {/* Content */}
      <div className={cn("pb-6 flex-1 min-w-0", isLast && "pb-0")}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-p5 truncate">
              {event.title}
            </p>
            <p className="text-xs text-p3 mt-0.5 leading-relaxed">
              {event.description}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-semibold text-p5">{event.date}</p>
            <span
              className="mt-1 inline-block text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: cfg.bg, color: cfg.color }}
            >
              {cfg.label}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
