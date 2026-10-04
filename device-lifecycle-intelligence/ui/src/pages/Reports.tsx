import {
  BarChart2,
  TrendingUp,
  Package,
  ShieldOff,
  Activity,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { mockDeviceList, mockOverview } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const kpis = [
  {
    label: "Total Devices",
    value: mockOverview.total_devices,
    icon: Package,
    color: "#b325e0",
    sub: "in fleet",
  },
  {
    label: "Active in Field",
    value: mockOverview.active_in_field,
    icon: TrendingUp,
    color: "#10b981",
    sub: "at customer",
  },
  {
    label: "Do Not Deploy",
    value: mockOverview.do_not_deploy_flagged,
    icon: ShieldOff,
    color: "#ef4444",
    sub: "flagged",
  },
  {
    label: "Open Alerts",
    value: mockOverview.open_alerts,
    icon: BarChart2,
    color: "#f59e0b",
    sub: "require attention",
  },
];

const fleetData = [
  { label: "In Field", value: mockOverview.active_in_field, fill: "#b325e0" },
  { label: "In Inventory", value: mockOverview.in_inventory, fill: "#8048dc" },
  { label: "In Repair", value: mockOverview.in_repair, fill: "#f59e0b" },
  { label: "Retired", value: mockOverview.retired, fill: "#6b7280" },
];

const healthBuckets = [
  {
    label: "80–100",
    count: mockDeviceList.filter(
      (d) => d.ai_health_metrics.device_health_score >= 80,
    ).length,
    fill: "#10b981",
  },
  {
    label: "50–79",
    count: mockDeviceList.filter(
      (d) =>
        d.ai_health_metrics.device_health_score >= 50 &&
        d.ai_health_metrics.device_health_score < 80,
    ).length,
    fill: "#f59e0b",
  },
  {
    label: "0–49",
    count: mockDeviceList.filter(
      (d) => d.ai_health_metrics.device_health_score < 50,
    ).length,
    fill: "#ef4444",
  },
];

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-white border border-p2/20 shadow-card px-3 py-2 text-xs">
      <p className="font-semibold text-p5">{label}</p>
      <p className="text-p3">{payload[0].value} devices</p>
    </div>
  );
}

export default function Reports() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-2xl font-bold text-p5">Reports</h1>
        <p className="mt-1 text-sm text-p3">
          Fleet health summary and lifecycle analytics
        </p>
      </motion.div>

      {/* KPI grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, color, sub }, i) => (
          <motion.div
            key={label}
            className="card p-5 hover:shadow-glow transition-shadow duration-200 cursor-default"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.06 }}
          >
            <div
              className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: `${color}18` }}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} style={{ color }} />
            </div>
            <p className="text-2xl font-bold" style={{ color }}>
              {value}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-p5">{label}</p>
            <p className="text-xs text-p3">{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Fleet status bar chart */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="label-text mb-4">Fleet Status</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={fleetData}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#8048dc18" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#8048dc" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#8048dc" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                animationDuration={1000}
              >
                {fleetData.map((entry) => (
                  <Cell key={entry.label} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Health score distribution */}
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <p className="label-text mb-4">Health Score Distribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={healthBuckets}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#8048dc18" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#8048dc" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: "#8048dc" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar
                dataKey="count"
                radius={[6, 6, 0, 0]}
                animationDuration={1000}
              >
                {healthBuckets.map((entry) => (
                  <Cell key={entry.label} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Fitness status cards */}
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {[
          {
            label: "Ready to Deploy",
            value: mockDeviceList.filter((d) => d.fitness_status === "deploy")
              .length,
            color: "#10b981",
            bg: "bg-emerald-50",
            ring: "ring-emerald-200",
            icon: Activity,
          },
          {
            label: "Deploy with Caution",
            value: mockDeviceList.filter(
              (d) => d.fitness_status === "deploy_with_caution",
            ).length,
            color: "#f59e0b",
            bg: "bg-amber-50",
            ring: "ring-amber-200",
            icon: RefreshCw,
          },
          {
            label: "Do Not Deploy",
            value: mockDeviceList.filter(
              (d) => d.fitness_status === "do_not_deploy",
            ).length,
            color: "#ef4444",
            bg: "bg-red-50",
            ring: "ring-red-200",
            icon: ShieldOff,
          },
        ].map(({ label, value, color, bg, ring, icon: Icon }) => (
          <div key={label} className={`card p-5 ring-1 ${bg} ${ring}`}>
            <div className="flex items-center gap-3 mb-2">
              <Icon className="h-5 w-5" strokeWidth={1.5} style={{ color }} />
              <p className="text-3xl font-bold" style={{ color }}>
                {value}
              </p>
            </div>
            <p className="text-sm font-semibold text-p5">{label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
