import { cn } from "@/lib/utils";
import { AlertTriangle, Wrench } from "lucide-react";

interface Props {
  tags: string[];
  predictiveFailure?: "High" | "Moderate" | "Low";
  recentRepair?: string;
}

const tagStyles: Record<string, string> = {
  // healthy
  healthy_device: "border-emerald-200 bg-emerald-50 text-emerald-700",
  stable_performance: "border-emerald-200 bg-emerald-50 text-emerald-700",
  // thermal / heat
  overheating_issue: "border-red-200 bg-red-50 text-red-700",
  thermal_events: "border-red-200 bg-red-50 text-red-700",
  unstable_device: "border-red-200 bg-red-50 text-red-700",
  // connectivity
  frequent_disconnects: "border-orange-200 bg-orange-50 text-orange-700",
  wifi_performance_issue: "border-amber-200 bg-amber-50 text-amber-700",
  wifi_module_replaced: "border-amber-200 bg-amber-50 text-amber-700",
  // repairs / history
  multiple_truck_rolls: "border-orange-200 bg-orange-50 text-orange-700",
  was_repaired: "border-purple-200 bg-purple-50 text-purple-700",
  multiple_failures: "border-red-200 bg-red-50 text-red-700",
  refurbished: "border-purple-200 bg-purple-50 text-purple-700",
  // memory / performance
  memory_pressure: "border-orange-200 bg-orange-50 text-orange-700",
  frequent_reboots: "border-amber-200 bg-amber-50 text-amber-700",
  customer_complaint_linked: "border-pink-200 bg-pink-50 text-pink-700",
  // legacy #-prefixed
  "#overheating": "border-red-200 bg-red-50 text-red-700",
  "#multiple_failures": "border-red-200 bg-red-50 text-red-700",
  "#high_error_rate": "border-orange-200 bg-orange-50 text-orange-700",
  "#multiple_truck_rolls": "border-orange-200 bg-orange-50 text-orange-700",
  "#wifi_radio_weak": "border-amber-200 bg-amber-50 text-amber-700",
  "#was_repaired": "border-purple-200 bg-purple-50 text-purple-700",
};

const defaultTagStyle = "border-zinc-200 bg-zinc-50 text-zinc-600";

const predictiveColors: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  High: { text: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
  Moderate: { text: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
  Low: { text: "#059669", bg: "#f0fdf4", border: "#86efac" },
};

export default function InsightTags({
  tags,
  predictiveFailure,
  recentRepair,
}: Props) {
  const pf = predictiveFailure ? predictiveColors[predictiveFailure] : null;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-card">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
        Insights &amp; Tags
      </p>

      {/* Predictive Failure banner */}
      {pf && (
        <div
          className="mb-4 flex items-center gap-2.5 rounded-xl border px-3 py-2.5"
          style={{ background: pf.bg, borderColor: pf.border }}
        >
          <AlertTriangle
            className="h-4 w-4 shrink-0"
            style={{ color: pf.text }}
            strokeWidth={2}
          />
          <div>
            <p className="text-[10px] font-medium" style={{ color: pf.text }}>
              Predictive Failure
            </p>
            <p className="text-sm font-bold" style={{ color: pf.text }}>
              {predictiveFailure} Risk
            </p>
          </div>
        </div>
      )}

      {/* Recent Repair */}
      {recentRepair && (
        <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-purple-200 bg-purple-50 px-3 py-2.5">
          <Wrench
            className="h-4 w-4 text-purple-600 shrink-0"
            strokeWidth={1.5}
          />
          <div>
            <p className="text-[10px] font-medium text-purple-600">
              Recent Repair
            </p>
            <p className="text-sm font-bold text-purple-800">{recentRepair}</p>
          </div>
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-zinc-400">
            Auto-Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "rounded-lg border px-2.5 py-1 text-xs font-medium transition-all hover:brightness-95",
                  tagStyles[tag] ?? defaultTagStyle,
                )}
              >
                #{tag.replace(/_/g, " ").replace(/^#/, "")}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
