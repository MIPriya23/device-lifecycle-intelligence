import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TelemetrySnapshot } from "@/types/device";
import { Signal, Thermometer, Activity, Wifi } from "lucide-react";

interface Props {
  latest: TelemetrySnapshot;
}

/** Build 30-day simulated history anchored to the snapshot. */
function buildHistory(snap: TelemetrySnapshot) {
  const now = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (29 - i));
    const s1 = Math.sin(i * 1.87 + 0.9) * 0.5 + 0.5;
    const s2 = Math.sin(i * 2.43 + 2.1) * 0.5 + 0.5;
    return {
      day: `${d.getMonth() + 1}/${d.getDate()}`,
      errorRate: parseFloat(
        Math.max(0, snap.packet_loss + (s1 - 0.5) * 0.5).toFixed(2),
      ),
      temp: parseFloat((snap.temperature_c + (s2 - 0.5) * 10).toFixed(1)),
    };
  });
}

function snrQuality(snr: number) {
  if (snr >= 35) return { label: "Excellent", color: "#10b981" };
  if (snr >= 28) return { label: "Good", color: "#6366f1" };
  if (snr >= 20) return { label: "Poor", color: "#f59e0b" };
  return { label: "Critical", color: "#ef4444" };
}

function MetricBadge({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: typeof Signal;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-zinc-100 bg-zinc-50 p-2.5 min-w-0">
      <div
        className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-md shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={1.5} style={{ color }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-zinc-500 leading-none truncate">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-bold text-zinc-900 leading-tight">
          {value}
        </p>
        {sub && <p className="text-[10px] text-zinc-400 truncate">{sub}</p>}
      </div>
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-md text-xs">
      <p className="font-semibold text-zinc-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

export default function TelemetryCard({ latest }: Props) {
  const chartData = buildHistory(latest);
  const sig = snrQuality(latest.snr);
  const reboots = latest.reboots_last_30_days ?? 0;
  const wifiLabel =
    latest.packet_loss >= 0.6
      ? "High Interference"
      : latest.packet_loss >= 0.3
        ? "Moderate"
        : "Clear";
  const wifiColor =
    latest.packet_loss >= 0.6
      ? "#ef4444"
      : latest.packet_loss >= 0.3
        ? "#f59e0b"
        : "#10b981";

  return (
    <motion.div
      className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
        Telemetry Snapshot
      </p>

      {/* 3 key metrics */}
      <div className="mb-5 grid grid-cols-3 gap-2">
        <MetricBadge
          icon={Signal}
          label="Signal"
          value={sig.label}
          sub={`SNR ${latest.snr} dB`}
          color={sig.color}
        />
        <MetricBadge
          icon={Activity}
          label="Reboots"
          value={`${reboots}`}
          sub="/ 30 days"
          color={
            reboots >= 10 ? "#ef4444" : reboots >= 5 ? "#f59e0b" : "#10b981"
          }
        />
        <MetricBadge
          icon={Wifi}
          label="WiFi Errors"
          value={wifiLabel}
          sub={`Loss ${(latest.packet_loss * 100).toFixed(0)}%`}
          color={wifiColor}
        />
      </div>

      {/* Area chart — temperature & error rate, 30 days */}
      <div className="flex-1">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-y-1">
          <p className="text-xs font-semibold text-zinc-700">
            Temperature &amp; Error Rate
            <span className="ml-1 font-normal text-zinc-400">— 30 days</span>
          </p>
          <div className="flex items-center gap-3 text-[10px] text-zinc-500">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-orange-400" />
              Temp (°C)
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
              Error Rate
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
          >
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#fb923c" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="errGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 8, fill: "#a1a1aa" }}
              tickLine={false}
              axisLine={false}
              interval={5}
            />
            <YAxis
              tick={{ fontSize: 8, fill: "#a1a1aa" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="temp"
              name="Temp °C"
              stroke="#fb923c"
              strokeWidth={2}
              fill="url(#tempGrad)"
              dot={false}
              animationDuration={1200}
            />
            <Area
              type="monotone"
              dataKey="errorRate"
              name="Error Rate"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#errGrad)"
              dot={false}
              animationDuration={1400}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Temp badge */}
      <div className="mt-3 flex items-center gap-1.5">
        <Thermometer
          className="h-3.5 w-3.5 text-orange-500"
          strokeWidth={1.5}
        />
        <span className="text-xs text-zinc-500">
          Current:{" "}
          <span className="font-semibold text-zinc-900">
            {latest.temperature_c}°C
          </span>
          {latest.temperature_c >= 70 && (
            <span className="ml-1.5 rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
              Critical
            </span>
          )}
        </span>
      </div>
    </motion.div>
  );
}
