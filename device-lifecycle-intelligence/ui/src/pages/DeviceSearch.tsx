import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { mockDeviceList } from "@/lib/mock-data";
import type { Device } from "@/types/device";
import { cn } from "@/lib/utils";

const fitnessStyle: Record<
  Device["fitness_status"],
  { label: string; color: string; bg: string; ring: string }
> = {
  deploy: {
    label: "Deploy",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
  },
  deploy_with_caution: {
    label: "Caution",
    color: "text-amber-700",
    bg: "bg-amber-50",
    ring: "ring-amber-200",
  },
  do_not_deploy: {
    label: "Do Not Deploy",
    color: "text-red-700",
    bg: "bg-red-50",
    ring: "ring-red-200",
  },
};

const statusLabel: Record<Device["current_status"], string> = {
  active_at_customer: "Active",
  in_inventory: "In Inventory",
  in_repair: "In Repair",
  retired: "Retired",
  scrapped: "Scrapped",
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "deploy", label: "Ready" },
  { key: "deploy_with_caution", label: "Caution" },
  { key: "do_not_deploy", label: "Do Not Deploy" },
] as const;

export default function DeviceSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = mockDeviceList.filter((d) => {
    const matchQuery =
      d.mac_id.toLowerCase().includes(query.toLowerCase()) ||
      d.model.toLowerCase().includes(query.toLowerCase()) ||
      d.manufacturer.toLowerCase().includes(query.toLowerCase()) ||
      d.serial_number.toLowerCase().includes(query.toLowerCase());
    const matchFilter = filter === "all" || d.fitness_status === filter;
    return matchQuery && matchFilter;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-2xl font-bold text-p5">Device Search</h1>
        <p className="mt-1 text-sm text-p3">
          Search and filter the device inventory
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        className="mb-6 flex flex-wrap gap-3 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative flex-1 min-w-60">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-p3"
            strokeWidth={1.5}
          />
          <input
            type="text"
            placeholder="Search by MAC ID, model, manufacturer, or serial…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-p2/40 bg-p2/5 py-2.5 pl-9 pr-4
                       text-sm text-p5 placeholder:text-p3/60 outline-none
                       transition focus:border-p2/70 focus:bg-p2/8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-p3" strokeWidth={1.5} />
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150",
                filter === key
                  ? "bg-p2 text-white"
                  : "border border-p2/30 text-p3 hover:bg-p2/5 hover:text-p2",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        className="card overflow-hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-p2/20 bg-p2/3">
              {[
                "MAC ID / Serial",
                "Model",
                "Manufacturer",
                "Status",
                "Health Score",
                "Fitness",
                "Tags",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-p3"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-p2/10">
            {filtered.map((d, i) => {
              const health = d.ai_health_metrics.device_health_score;
              const fit = fitnessStyle[d.fitness_status];
              return (
                <motion.tr
                  key={d.mac_id}
                  className="hover:bg-p2/[0.03] transition-colors cursor-pointer"
                  onClick={() =>
                    navigate(`/overview/${encodeURIComponent(d.mac_id)}`)
                  }
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18 + i * 0.04 }}
                >
                  <td className="px-5 py-3.5">
                    <p className="font-mono text-xs font-semibold text-p5">
                      {d.mac_id}
                    </p>
                    <p className="text-[10px] text-p3 mt-0.5">
                      {d.serial_number}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-p5">{d.model}</td>
                  <td className="px-5 py-3.5 text-p3">{d.manufacturer}</td>
                  <td className="px-5 py-3.5 text-p3">
                    {statusLabel[d.current_status]}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-700",
                            health > 80
                              ? "bg-emerald-500"
                              : health > 50
                                ? "bg-amber-500"
                                : "bg-red-500",
                          )}
                          style={{ width: `${health}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-p5 tabular-nums w-7">
                        {health}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1",
                        fit.bg,
                        fit.color,
                        fit.ring,
                      )}
                    >
                      {fit.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {d.device_tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-p2/8 px-2 py-0.5 text-[10px] text-p3"
                          style={{
                            background:
                              "color-mix(in srgb, var(--p2) 8%, transparent)",
                          }}
                        >
                          {t.replace(/_/g, " ")}
                        </span>
                      ))}
                      {d.device_tags.length > 2 && (
                        <span className="text-[10px] text-p4">
                          +{d.device_tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <ExternalLink
                      className="h-3.5 w-3.5 text-p3"
                      strokeWidth={1.5}
                    />
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-p3">
            No devices match your search.
          </p>
        )}
      </motion.div>

      {/* Footer count */}
      <p className="mt-3 text-xs text-p3">
        Showing <span className="font-semibold text-p5">{filtered.length}</span>{" "}
        of{" "}
        <span className="font-semibold text-p5">{mockDeviceList.length}</span>{" "}
        devices
      </p>
    </div>
  );
}

const fitnessColor: Record<Device["fitness_status"], string> = {
  deploy: "text-emerald-400 bg-emerald-950/30 ring-emerald-900/40",
  deploy_with_caution: "text-amber-400 bg-amber-950/30 ring-amber-900/40",
  do_not_deploy: "text-red-400 bg-red-950/30 ring-red-900/40",
};

const fitnessLabel: Record<Device["fitness_status"], string> = {
  deploy: "Deploy",
  deploy_with_caution: "Caution",
  do_not_deploy: "Do Not Deploy",
};
