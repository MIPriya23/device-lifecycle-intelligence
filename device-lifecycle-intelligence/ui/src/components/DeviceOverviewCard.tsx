import type { Device } from "@/types/device";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface Props {
  device: Device;
}

const statusLabel: Record<Device["current_status"], string> = {
  active_at_customer: "Active at Customer",
  in_inventory: "In Inventory",
  in_repair: "In Repair",
  retired: "Retired",
  scrapped: "Scrapped",
};

const fitnessConfig: Record<
  Device["fitness_status"],
  { label: string; color: string; dot: string }
> = {
  deploy: {
    label: "Safe to Deploy",
    color: "text-emerald-400",
    dot: "bg-emerald-500",
  },
  deploy_with_caution: {
    label: "Deploy with Caution",
    color: "text-amber-400",
    dot: "bg-amber-500",
  },
  do_not_deploy: {
    label: "Do Not Deploy",
    color: "text-red-400",
    dot: "bg-red-500",
  },
};

function HealthGauge({ score, risk }: { score: number; risk: number }) {
  const size = 130;
  const sw = 9;
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const riskPct = Math.round(risk * 100);
  const offset = circ - (riskPct / 100) * circ;
  const color = riskPct > 70 ? "#f87171" : riskPct > 40 ? "#fbbf24" : "#34d399";

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--p3)"
          strokeWidth={sw}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold text-p5">{riskPct}%</span>
        <span className="text-[10px] text-p3 uppercase tracking-widest">
          risk
        </span>
      </div>
    </div>
  );
}

export default function DeviceOverviewCard({ device }: Props) {
  const fitness = fitnessConfig[device.fitness_status];
  const m = device.ai_health_metrics;

  return (
    <div className="card-hover p-6 animate-slide-up">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <span className="label-text">Device Overview</span>
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1",
            device.fitness_status === "do_not_deploy"
              ? "bg-red-50 ring-red-200"
              : device.fitness_status === "deploy_with_caution"
                ? "bg-amber-50 ring-amber-200"
                : "bg-emerald-50 ring-emerald-200",
            fitness.color,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", fitness.dot)} />
          {fitness.label}
        </span>
      </div>

      <div className="flex items-start gap-6">
        {/* Info */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="label-text mb-0.5">MAC ID</p>
            <p className="text-lg font-semibold text-p5 font-mono">
              {device.mac_id}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <p className="label-text mb-0.5">Model</p>
              <p className="text-sm text-p5">{device.model}</p>
            </div>
            <div>
              <p className="label-text mb-0.5">Manufacturer</p>
              <p className="text-sm text-p5">{device.manufacturer}</p>
            </div>
            <div>
              <p className="label-text mb-0.5">Serial</p>
              <p className="text-sm text-p5 font-mono">
                {device.serial_number}
              </p>
            </div>
            <div>
              <p className="label-text mb-0.5">Status</p>
              <p className="text-sm text-p5">
                {statusLabel[device.current_status]}
              </p>
            </div>
          </div>
        </div>

        {/* Gauge + scores */}
        <div className="flex flex-col items-center gap-2">
          <HealthGauge
            score={m.device_health_score}
            risk={m.failure_risk_score}
          />
          <div className="flex gap-4 text-center">
            <div>
              <p className="label-text">Health</p>
              <p className="text-sm font-medium text-p5">
                {m.device_health_score}
              </p>
            </div>
            <div>
              <p className="label-text">Truck Rolls</p>
              <p className="text-sm font-medium text-p5">
                {m.truck_roll_count}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      {m.recommendation_message && (
        <div className="mt-5 rounded-xl border border-p2/20 bg-p2/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            {m.redeploy_safe ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : m.failure_risk_score >= 0.6 ? (
              <XCircle className="h-4 w-4 text-red-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-amber-400" />
            )}
            <span className="text-xs font-medium text-p3 uppercase tracking-widest">
              AI Assessment
            </span>
          </div>
          <p className="text-xs text-p5 leading-relaxed">
            {m.recommendation_message}
          </p>
          {m.key_concerns.length > 0 &&
            m.key_concerns[0] !== "No significant issues detected" && (
              <ul className="mt-2 space-y-0.5">
                {m.key_concerns.map((c) => (
                  <li key={c} className="text-[11px] text-p3">
                    • {c}
                  </li>
                ))}
              </ul>
            )}
        </div>
      )}
    </div>
  );
}

