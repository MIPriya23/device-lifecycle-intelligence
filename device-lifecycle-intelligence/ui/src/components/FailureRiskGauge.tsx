import { motion } from "framer-motion";
import type { DeviceStatus } from "@/types/device";

interface Props {
  risk: number; // 0–1
  score: number; // 0–100
  macId: string;
  model: string;
  status: DeviceStatus;
}

const OUTER_R = 46;
const INNER_R = 32;
const OUTER_C = 2 * Math.PI * OUTER_R;
const INNER_C = 2 * Math.PI * INNER_R;

function riskColor(r: number) {
  if (r >= 0.7) return "#ef4444";
  if (r >= 0.4) return "#f59e0b";
  return "#10b981";
}
function riskLabel(r: number) {
  if (r >= 0.7) return "High";
  if (r >= 0.4) return "Moderate";
  return "Low";
}

const statusLabels: Record<DeviceStatus, string> = {
  active_at_customer: "Active at Customer",
  in_inventory: "In Inventory",
  in_repair: "In Repair",
  retired: "Retired",
  scrapped: "Scrapped",
};

const statusColors: Record<DeviceStatus, { text: string; bg: string }> = {
  active_at_customer: { text: "#10b981", bg: "#10b98115" },
  in_inventory: { text: "#6366f1", bg: "#6366f115" },
  in_repair: { text: "#f59e0b", bg: "#f59e0b15" },
  retired: { text: "#6b7280", bg: "#6b728015" },
  scrapped: { text: "#ef4444", bg: "#ef444415" },
};

export default function FailureRiskGauge({
  risk,
  score,
  macId,
  model,
  status,
}: Props) {
  const riskPct = Math.round(risk * 100);
  const color = riskColor(risk);
  const label = riskLabel(risk);
  const st = statusColors[status];

  // Health score: outer ring (emerald → amber → red by score)
  const healthColor =
    score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444";
  const outerOffset = OUTER_C * (1 - score / 100);
  // Failure risk: inner ring
  const innerOffset = INNER_C * (1 - risk);

  const transition = "stroke-dashoffset 1.3s cubic-bezier(0.22, 1, 0.36, 1)";

  return (
    <motion.div
      className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Device identity */}
      <div className="mb-1 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            MAC ID
          </p>
          <h2 className="mt-1 truncate text-lg font-bold text-zinc-900 font-mono">
            {macId}
          </h2>
          <p className="truncate text-xs text-zinc-500">
            Model: {model} Gateway
          </p>
        </div>
        <span
          className="mt-1 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{ background: st.bg, color: st.text }}
        >
          {statusLabels[status]}
        </span>
      </div>

      {/* Divider */}
      <div className="my-3 h-px bg-zinc-100" />

      {/* Dual concentric ring chart */}
      <div className="flex flex-col items-center">
        <svg
          viewBox="0 0 120 120"
          className="w-full max-w-[160px]"
          aria-label={`Health ${score}/100, Failure risk ${riskPct}%`}
        >
          {/* Outer track — health */}
          <circle
            cx="60"
            cy="60"
            r={OUTER_R}
            fill="none"
            stroke="#e4e4e7"
            strokeWidth="9"
          />
          {/* Outer fill — health */}
          <circle
            cx="60"
            cy="60"
            r={OUTER_R}
            fill="none"
            stroke={healthColor}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={OUTER_C}
            strokeDashoffset={outerOffset}
            transform="rotate(-90 60 60)"
            style={{ transition }}
          />
          {/* Inner track — risk */}
          <circle
            cx="60"
            cy="60"
            r={INNER_R}
            fill="none"
            stroke="#f4f4f5"
            strokeWidth="8"
          />
          {/* Inner fill — risk */}
          <circle
            cx="60"
            cy="60"
            r={INNER_R}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={INNER_C}
            strokeDashoffset={innerOffset}
            transform="rotate(-90 60 60)"
            style={{ transition }}
          />
          {/* Center: risk % */}
          <text
            x="60"
            y="56"
            textAnchor="middle"
            fontSize="18"
            fontWeight="700"
            fill={color}
          >
            {riskPct}%
          </text>
          <text x="60" y="68" textAnchor="middle" fontSize="8" fill="#a1a1aa">
            RISK
          </text>
        </svg>

        {/* Legend */}
        <div className="mt-3 grid w-full grid-cols-2 gap-2">
          <div className="rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2 text-center">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400">
              Risk Level
            </p>
            <p className="mt-0.5 text-sm font-bold" style={{ color }}>
              {label}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2 text-center">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400">
              Health
            </p>
            <p
              className="mt-0.5 text-sm font-bold"
              style={{ color: healthColor }}
            >
              {score}/100
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
