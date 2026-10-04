import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import FailureRiskGauge from "@/components/FailureRiskGauge";
import DeviceHistoryCard from "@/components/DeviceHistoryCard";
import TelemetryCard from "@/components/TelemetryCard";
import InsightTags from "@/components/InsightTags";
import ReplacementRecommendation from "@/components/ReplacementRecommendation";
import ActionButtons from "@/components/ActionButtons";
import TimelineModal from "@/components/TimelineModal";
import { CardSkeleton } from "@/components/Skeleton";

import { featuredDevice, featuredTimeline } from "@/lib/mock-data";
import { fetchDevice, fetchLifecycleEvents } from "@/lib/api";
import type { Device } from "@/types/device";
import type { TimelineEventData } from "@/components/TimelineEvent";

function riskLevel(r: number): "High" | "Moderate" | "Low" {
  if (r >= 0.7) return "High";
  if (r >= 0.4) return "Moderate";
  return "Low";
}

function deriveHistorySummary(device: Device) {
  const tags = device.device_tags ?? [];
  return {
    truck_rolls: device.ai_health_metrics.truck_roll_count ?? 0,
    repair_events: tags.some((t) =>
      ["was_repaired", "refurbished", "repair"].some((k) => t.includes(k)),
    )
      ? 1
      : 0,
    component_replacements: tags.some((t) =>
      ["replaced", "module"].some((k) => t.includes(k)),
    )
      ? 1
      : 0,
    returned_issues: tags.some((t) =>
      ["overheating", "disconnect", "returned"].some((k) => t.includes(k)),
    )
      ? 1
      : 0,
    installed_locations: 1,
  };
}

function mapApiEvents(raw: unknown[]): TimelineEventData[] {
  const typeMap: Record<string, TimelineEventData["type"]> = {
    thermal_reboot: "failure",
    device_crash: "failure",
    repair: "repair",
    return: "return",
    truck_roll: "truck_roll",
    install: "install",
    activation: "activation",
    deactivation: "deactivation",
    firmware_update: "warehouse",
    depot_arrival: "warehouse",
    depot_departure: "warehouse",
  };
  return raw.map((ev: unknown, idx) => {
    const e = ev as Record<string, unknown>;
    const dateStr = e.timestamp
      ? new Date(String(e.timestamp)).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";
    const rawType = String(e.event_type ?? "install");
    const type = typeMap[rawType] ?? "install";
    const title = rawType
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const component = e.component ? `Component: ${String(e.component)}` : "";
    const category = e.event_category ? String(e.event_category) : "";
    return {
      id: String(idx + 1),
      date: dateStr,
      title,
      description: component || category,
      type,
    };
  });
}

function recentRepairNote(tags: string[]): string | undefined {
  if (tags.some((t) => t.includes("wifi_module")))
    return "WiFi Module Replacement";
  if (tags.some((t) => t.includes("repaired") || t.includes("refurbished")))
    return "Repair Event";
  return undefined;
}

export default function Overview() {
  const { deviceId } = useParams<{ deviceId?: string }>();
  const [timelineOpen, setTimelineOpen] = useState(false);

  const [device, setDevice] = useState<Device>(featuredDevice);
  const [timeline, setTimeline] =
    useState<TimelineEventData[]>(featuredTimeline);
  const [loading, setLoading] = useState(!!deviceId);

  useEffect(() => {
    if (!deviceId) {
      setDevice(featuredDevice);
      setTimeline(featuredTimeline);
      setLoading(false);
      return;
    }
    const decoded = decodeURIComponent(deviceId);
    setLoading(true);
    Promise.all([
      fetchDevice(decoded)
        .then((r) => r.data)
        .catch(() => null),
      fetchLifecycleEvents(decoded)
        .then((r) => r.data)
        .catch(() => []),
    ])
      .then(([dev, events]) => {
        if (dev) setDevice(dev);
        const mapped =
          Array.isArray(events) && events.length > 0
            ? mapApiEvents(events)
            : [];
        setTimeline(mapped);
      })
      .finally(() => setLoading(false));
  }, [deviceId]);

  const historySummary = deriveHistorySummary(device);
  const predictiveFailure = riskLevel(
    device.ai_health_metrics.failure_risk_score,
  );
  const repairNote = recentRepairNote(device.device_tags ?? []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 space-y-2">
          <div className="h-8 w-48 animate-pulse rounded-xl bg-zinc-100" />
          <div className="h-4 w-72 animate-pulse rounded-lg bg-zinc-100" />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* ── Page header ── */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-zinc-900">Device Overview</h1>
        <p className="mt-1 text-sm text-zinc-500">
          AI-powered health analysis, telemetry &amp; lifecycle intelligence
        </p>
      </motion.div>

      {/* ── 3-column responsive grid ── */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 — Device Header + Failure Risk Gauge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0 }}
        >
          <FailureRiskGauge
            risk={device.ai_health_metrics.failure_risk_score}
            score={device.ai_health_metrics.device_health_score}
            macId={device.mac_id}
            model={device.model}
            status={device.current_status}
          />
        </motion.div>

        {/* Card 2 — History Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <DeviceHistoryCard
            summary={historySummary}
            onViewHistory={() => setTimelineOpen(true)}
          />
        </motion.div>

        {/* Card 3 — Telemetry + Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="md:col-span-2 lg:col-span-1"
        >
          <TelemetryCard latest={device.latest_telemetry_snapshot} />
        </motion.div>

        {/* Card 4 — Insight Tags */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          <InsightTags
            tags={device.device_tags ?? []}
            predictiveFailure={predictiveFailure}
            recentRepair={repairNote}
          />
        </motion.div>

        {/* Card 5 — AI Assessment (spans 2 cols on lg) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <ReplacementRecommendation current={device} />
        </motion.div>

        {/* Card 6 — Actions (full width) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          className="md:col-span-2 lg:col-span-3"
        >
          <ActionButtons deviceId={device.mac_id} />
        </motion.div>
      </div>

      {/* Timeline Modal */}
      <TimelineModal
        open={timelineOpen}
        onClose={() => setTimelineOpen(false)}
        deviceId={device.serial_number}
        events={timeline}
      />
    </div>
  );
}
