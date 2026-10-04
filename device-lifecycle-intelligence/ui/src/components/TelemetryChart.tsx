import type { TelemetrySnapshot } from "@/types/device";
import {
  Wifi,
  Thermometer,
  Cpu,
  HardDrive,
  Activity,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  snapshots: TelemetrySnapshot[];
  latest?: TelemetrySnapshot;
}

function MetricBar({
  label,
  value,
  max,
  unit,
  icon: Icon,
  warnAt,
  critAt,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
  icon: React.ElementType;
  warnAt?: number;
  critAt?: number;
}) {
  const pct = Math.min(100, (value / max) * 100);
  const isCrit = critAt !== undefined && value >= critAt;
  const isWarn = !isCrit && warnAt !== undefined && value >= warnAt;
  const barColor = isCrit
    ? "bg-red-500"
    : isWarn
      ? "bg-amber-500"
      : "bg-emerald-500";
  const textColor = isCrit
    ? "text-red-400"
    : isWarn
      ? "text-amber-400"
      : "text-emerald-400";

  return (
    <div className="rounded-xl bg-p2/5 p-3 ring-1 ring-p2/15">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-p3" strokeWidth={1.5} />
          <span className="text-[11px] text-p3">{label}</span>
        </div>
        <span className={cn("text-sm font-semibold", textColor)}>
          {value}
          <span className="ml-0.5 text-[10px] text-p4">{unit}</span>
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-p2/10">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            barColor,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function TelemetryChart({ snapshots, latest }: Props) {
  const snap = latest ?? snapshots[snapshots.length - 1];
  if (!snap) return null;

  const ts = new Date(snap.timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="card-hover p-6 animate-slide-up">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="label-text">Telemetry Snapshot</span>
          <p className="mt-1 text-xs text-p3">Latest reading — {ts}</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-p2/5 px-3 py-2 ring-1 ring-p2/15">
          <Users className="h-3.5 w-3.5 text-p3" strokeWidth={1.5} />
          <div>
            <p className="text-[10px] text-p3">Connected Clients</p>
            <p className="text-xs font-semibold text-p5">
              {snap.connected_wifi_clients}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <MetricBar
          label="SNR"
          value={snap.snr}
          max={50}
          unit="dB"
          icon={Wifi}
          warnAt={28}
          critAt={20}
        />
        <MetricBar
          label="Latency"
          value={snap.latency_ms}
          max={100}
          unit="ms"
          icon={Activity}
          warnAt={30}
          critAt={60}
        />
        <MetricBar
          label="Temperature"
          value={snap.temperature_c}
          max={90}
          unit="°C"
          icon={Thermometer}
          warnAt={50}
          critAt={65}
        />
        <MetricBar
          label="CPU Usage"
          value={snap.cpu_usage_percent}
          max={100}
          unit="%"
          icon={Cpu}
          warnAt={70}
          critAt={85}
        />
        <MetricBar
          label="Memory"
          value={snap.memory_usage_percent}
          max={100}
          unit="%"
          icon={HardDrive}
          warnAt={70}
          critAt={85}
        />
        <MetricBar
          label="Packet Loss"
          value={+(snap.packet_loss * 100).toFixed(1)}
          max={10}
          unit="%"
          icon={Activity}
          warnAt={1}
          critAt={3}
        />
      </div>

      {snap.reboots_last_30_days !== undefined &&
        snap.reboots_last_30_days > 0 && (
          <p className="mt-3 text-[11px] text-amber-400">
            ⚠️ {snap.reboots_last_30_days} reboot
            {snap.reboots_last_30_days !== 1 ? "s" : ""} in the last 30 days
          </p>
        )}
    </div>
  );
}
