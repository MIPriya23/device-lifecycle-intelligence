import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronDown, Download, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TimelineEvent, {
  type TimelineEventData,
} from "@/components/TimelineEvent";
import { cn } from "@/lib/utils";
import { mockDeviceList } from "@/lib/mock-data";

const MOCK_EVENTS: TimelineEventData[] = [
  {
    id: "1",
    date: "Jun 15, 2023",
    title: "Returned Due to Overheating",
    description:
      "Customer reported thermal shutdowns — device flagged for thermal issue",
    type: "return",
  },
  {
    id: "2",
    date: "Jun 02, 2023",
    title: "Repair Event",
    description: "Wi-Fi module replaced at regional service center",
    type: "repair",
  },
  {
    id: "3",
    date: "May 28, 2023",
    title: "Truck Roll",
    description:
      "Technician dispatched — frequent disconnects reported by customer",
    type: "truck_roll",
  },
  {
    id: "4",
    date: "Apr 12, 2023",
    title: "Installed at Location #3",
    description: "Activated at new customer service address",
    type: "install",
  },
  {
    id: "5",
    date: "Mar 05, 2023",
    title: "Power Supply Replaced",
    description: "Warehouse diagnostics identified power supply fault",
    type: "warehouse",
  },
  {
    id: "6",
    date: "Feb 10, 2023",
    title: "Truck Roll",
    description: "No signal — technician dispatched for on-site investigation",
    type: "truck_roll",
  },
  {
    id: "7",
    date: "Dec 18, 2022",
    title: "Installed at Location #2",
    description: "Redeployed after refurbishment at second customer address",
    type: "install",
  },
  {
    id: "8",
    date: "Nov 03, 2022",
    title: "Customer Deactivation",
    description: "Service canceled by customer — device returned to inventory",
    type: "deactivation",
  },
  {
    id: "9",
    date: "Jul 15, 2022",
    title: "Initial Activation",
    description: "Device provisioned and activated at first customer location",
    type: "activation",
  },
  {
    id: "10",
    date: "Jun 01, 2022",
    title: "Installed at Location #1",
    description: "First customer deployment shipped from warehouse",
    type: "install",
  },
];

const FILTER_OPTIONS = [
  { key: "all", label: "All" },
  { key: "failure", label: "Failures" },
  { key: "repair", label: "Repairs" },
  { key: "install", label: "Locations" },
  { key: "truck_roll", label: "Truck Rolls" },
  { key: "warehouse", label: "Warehouse" },
] as const;

type FilterKey = (typeof FILTER_OPTIONS)[number]["key"];

export default function Timeline() {
  const { deviceId } = useParams();
  const id = deviceId ?? mockDeviceList[0].mac_id;

  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<"desc" | "asc">("desc");

  const visible = useMemo(() => {
    let list = MOCK_EVENTS;
    if (filter !== "all") {
      list = list.filter(
        (e) =>
          e.type === filter || (filter === "failure" && e.type === "return"),
      );
    }
    return sort === "asc" ? [...list].reverse() : list;
  }, [filter, sort]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      {/* Header */}
      <motion.div
        className="mb-8 flex items-center gap-4"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Link
          to={`/overview/${encodeURIComponent(id)}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-p2/30
                     text-p3 hover:bg-p2/5 hover:text-p2 transition-colors shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-p5">Device History</h1>
          <p className="text-sm text-p3 mt-0.5 font-mono truncate">{id}</p>
        </div>
        <button className="btn-ghost flex items-center gap-2 shrink-0">
          <Download className="h-4 w-4" />
          Export
        </button>
      </motion.div>

      {/* Event count */}
      <motion.div
        className="mb-5 grid grid-cols-3 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { label: "Total Events", value: MOCK_EVENTS.length },
          {
            label: "Truck Rolls",
            value: MOCK_EVENTS.filter((e) => e.type === "truck_roll").length,
          },
          {
            label: "Repair Events",
            value: MOCK_EVENTS.filter((e) => e.type === "repair").length,
          },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4 text-center">
            <p className="text-xl font-bold text-p5">{value}</p>
            <p className="text-xs text-p3 mt-0.5">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Filter & sort controls */}
      <motion.div
        className="mb-6 flex flex-wrap items-center justify-between gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex gap-2 flex-wrap">
          {FILTER_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150",
                filter === key
                  ? "bg-p2 text-white shadow-sm"
                  : "border border-p2/30 text-p3 hover:bg-p2/5 hover:text-p2",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "desc" | "asc")}
            className="appearance-none rounded-xl border border-p2/30 bg-white py-1.5 pl-3 pr-8
                       text-xs text-p3 outline-none hover:border-p2/50 cursor-pointer"
          >
            <option value="desc">Most Recent First</option>
            <option value="asc">Oldest First</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-p3" />
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="card p-6">
        <AnimatePresence mode="wait">
          {visible.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-p3 text-center py-8"
            >
              No events match this filter.
            </motion.p>
          ) : (
            <motion.div
              key={`${filter}-${sort}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {visible.map((event, i) => (
                <TimelineEvent
                  key={event.id}
                  event={event}
                  isLast={i === visible.length - 1}
                  index={i}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
