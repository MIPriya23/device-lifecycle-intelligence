import { useAlerts } from "@/hooks/useAlerts";
import { cn } from "@/lib/utils";
import type { Alert } from "@/types/alert";
import { AlertTriangle, AlertCircle, Info, Zap, Bell } from "lucide-react";
import { motion } from "framer-motion";

const severityConfig: Record<
  Alert["severity"],
  {
    label: string;
    color: string;
    bg: string;
    ring: string;
    icon: typeof AlertTriangle;
  }
> = {
  critical: {
    label: "Critical",
    color: "text-red-700",
    bg: "bg-red-50",
    ring: "ring-red-200",
    icon: Zap,
  },
  high: {
    label: "High",
    color: "text-orange-700",
    bg: "bg-orange-50",
    ring: "ring-orange-200",
    icon: AlertTriangle,
  },
  medium: {
    label: "Medium",
    color: "text-amber-700",
    bg: "bg-amber-50",
    ring: "ring-amber-200",
    icon: AlertCircle,
  },
  low: {
    label: "Low",
    color: "text-blue-700",
    bg: "bg-blue-50",
    ring: "ring-blue-200",
    icon: Info,
  },
};

export default function Alerts() {
  const { alerts, loading } = useAlerts();
  const open = alerts.filter((a) => !a.resolved_at);
  const resolved = alerts.filter((a) => a.resolved_at);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <motion.div
        className="mb-8 flex items-center justify-between"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-p5">Alerts</h1>
          <p className="mt-1 text-sm text-p3">
            Active and resolved device alerts
          </p>
        </div>
        <div className="flex items-center gap-3">
          {open.length > 0 && (
            <span
              className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1
                             text-sm font-semibold text-red-700 ring-1 ring-red-200"
            >
              <Bell className="h-3.5 w-3.5" />
              {open.length} open
            </span>
          )}
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card h-20 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <AlertSection title="Open" alerts={open} startDelay={0.1} />
          <AlertSection title="Resolved" alerts={resolved} startDelay={0.2} />
        </div>
      )}
    </div>
  );
}

function AlertSection({
  title,
  alerts,
  startDelay,
}: {
  title: string;
  alerts: Alert[];
  startDelay: number;
}) {
  if (!alerts.length) return null;
  return (
    <div>
      <p className="label-text mb-3">{title}</p>
      <div className="space-y-3">
        {alerts.map((alert, i) => {
          const cfg = severityConfig[alert.severity];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={alert.id}
              className="card flex items-start gap-4 p-4 hover:shadow-glow transition-all duration-200"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: startDelay + i * 0.06 }}
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1",
                  cfg.bg,
                  cfg.ring,
                )}
              >
                <Icon className={cn("h-4 w-4", cfg.color)} strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1",
                      cfg.bg,
                      cfg.color,
                      cfg.ring,
                    )}
                  >
                    {cfg.label}
                  </span>
                  <span className="text-xs font-mono text-p3">
                    {alert.mac_id}
                  </span>
                  <span className="text-xs text-p4">
                    {new Date(alert.triggered_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-p5 leading-relaxed">
                  {alert.message}
                </p>
                <p className="mt-0.5 text-xs text-p3 capitalize">
                  {alert.alert_type.replace(/_/g, " ")}
                </p>
              </div>
              {alert.resolved_at && (
                <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                  Resolved {new Date(alert.resolved_at).toLocaleDateString()}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
