import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Wrench,
  Truck,
  AlertCircle,
  Zap,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineEventData } from "@/components/TimelineEvent";

interface Props {
  open: boolean;
  onClose: () => void;
  deviceId: string;
  events: TimelineEventData[];
}

type FilterKey = "all" | "failures" | "repairs" | "locations";

const filterDefs: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "failures", label: "Failures" },
  { key: "repairs", label: "Repairs" },
  { key: "locations", label: "Locations" },
];

const typeConfig: Record<
  TimelineEventData["type"],
  { icon: typeof MapPin; color: string; bg: string; badge: string }
> = {
  install: {
    icon: MapPin,
    color: "#6366f1",
    bg: "#6366f115",
    badge: "Installation",
  },
  repair: { icon: Wrench, color: "#f59e0b", bg: "#f59e0b15", badge: "Repair" },
  truck_roll: {
    icon: Truck,
    color: "#8b5cf6",
    bg: "#8b5cf615",
    badge: "Truck Roll",
  },
  failure: {
    icon: AlertCircle,
    color: "#ef4444",
    bg: "#ef444415",
    badge: "Failure",
  },
  activation: {
    icon: Zap,
    color: "#10b981",
    bg: "#10b98115",
    badge: "Activation",
  },
  deactivation: {
    icon: Package,
    color: "#6b7280",
    bg: "#6b728015",
    badge: "Deactivation",
  },
  warehouse: {
    icon: Package,
    color: "#8b5cf6",
    bg: "#8b5cf615",
    badge: "Warehouse",
  },
  return: {
    icon: AlertCircle,
    color: "#dc2626",
    bg: "#dc262615",
    badge: "Return",
  },
};

function matchesFilter(event: TimelineEventData, filter: FilterKey): boolean {
  if (filter === "all") return true;
  if (filter === "failures")
    return event.type === "failure" || event.type === "return";
  if (filter === "repairs")
    return event.type === "repair" || event.type === "warehouse";
  if (filter === "locations")
    return event.type === "install" || event.type === "activation";
  return true;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function TimelineModal({
  open,
  onClose,
  deviceId,
  events,
}: Props) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const filtered = events
    .filter((e) => matchesFilter(e, filter))
    .sort((a, b) => {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
      return sort === "newest" ? diff : -diff;
    });

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div
              className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
                <div>
                  <h2 className="text-base font-bold text-zinc-900">
                    Device Timeline
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">{deviceId}</p>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>

              {/* Filters + Sort */}
              <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-6 py-3">
                {/* Filter tabs */}
                <div className="flex items-center gap-1">
                  {filterDefs.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                        filter === key
                          ? "bg-zinc-900 text-white"
                          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Sort */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-zinc-400 mr-1">Sort:</span>
                  {(["newest", "oldest"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSort(s)}
                      className={cn(
                        "rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors capitalize",
                        sort === s
                          ? "bg-zinc-100 text-zinc-900"
                          : "text-zinc-400 hover:text-zinc-700",
                      )}
                    >
                      {s === "newest" ? "Most Recent" : "Oldest First"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Events list */}
              <div className="overflow-y-auto px-6 py-4 flex-1">
                {filtered.length === 0 ? (
                  <div className="py-12 text-center text-sm text-zinc-400">
                    No events match this filter.
                  </div>
                ) : (
                  <ol className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-[19px] top-2 bottom-2 w-px bg-zinc-100" />

                    {filtered.map((event, idx) => {
                      const cfg = typeConfig[event.type];
                      const Icon = cfg.icon;
                      const isLast = idx === filtered.length - 1;
                      return (
                        <motion.li
                          key={event.id}
                          className={cn(
                            "relative flex gap-4",
                            !isLast && "pb-5",
                          )}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 }}
                        >
                          {/* Icon dot */}
                          <div
                            className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white ring-1 ring-zinc-100"
                            style={{ background: cfg.bg }}
                          >
                            <Icon
                              className="h-4 w-4"
                              strokeWidth={1.5}
                              style={{ color: cfg.color }}
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 hover:bg-white hover:border-zinc-200 transition-colors">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold text-zinc-900">
                                  {event.title}
                                </p>
                                <p className="mt-0.5 text-xs text-zinc-500 leading-snug">
                                  {event.description}
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-1.5 shrink-0">
                                <span
                                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                                  style={{
                                    background: cfg.bg,
                                    color: cfg.color,
                                  }}
                                >
                                  {cfg.badge}
                                </span>
                                <time className="text-[10px] font-mono text-zinc-400">
                                  {formatDate(event.date)}
                                </time>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </ol>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-zinc-100 px-6 py-3 flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  {filtered.length} event{filtered.length !== 1 ? "s" : ""}{" "}
                  shown
                </span>
                <button
                  onClick={onClose}
                  className="rounded-lg px-4 py-1.5 text-sm font-medium text-zinc-600 border border-zinc-200
                             hover:bg-zinc-50 hover:text-zinc-900 transition-colors active:scale-[0.98]"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
