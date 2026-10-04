import type { Device } from "@/types/device";
import { motion } from "framer-motion";
import {
  Server,
  Wifi,
  MapPin,
  Calendar,
  Tag,
  Monitor,
  Shield,
} from "lucide-react";

interface Props {
  device: Device;
}

const statusConfig: Record<
  Device["current_status"],
  { label: string; color: string; bg: string }
> = {
  active_at_customer: {
    label: "Active at Customer",
    color: "#10b981",
    bg: "#10b98118",
  },
  in_inventory: { label: "In Inventory", color: "#6366f1", bg: "#6366f118" },
  in_repair: { label: "In Repair", color: "#f59e0b", bg: "#f59e0b18" },
  retired: { label: "Retired", color: "#6b7280", bg: "#6b728018" },
  scrapped: { label: "Scrapped", color: "#ef4444", bg: "#ef444418" },
};

const fitnessConfig: Record<
  Device["fitness_status"],
  { label: string; color: string; bg: string }
> = {
  deploy: { label: "Safe to Deploy", color: "#10b981", bg: "#10b98118" },
  deploy_with_caution: {
    label: "Deploy with Caution",
    color: "#f59e0b",
    bg: "#f59e0b18",
  },
  do_not_deploy: { label: "Do Not Deploy", color: "#ef4444", bg: "#ef444418" },
};

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Server;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-p2/10 last:border-0">
      <div
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-p2/8 text-p3 shrink-0"
        style={{ background: "color-mix(in srgb, var(--p2) 8%, transparent)" }}
      >
        <Icon className="h-3.5 w-3.5 text-p3" strokeWidth={1.5} />
      </div>
      <span className="text-xs text-p3 w-28 shrink-0">{label}</span>
      <span className="text-xs font-medium text-p5 truncate">
        {value || "—"}
      </span>
    </div>
  );
}

export default function DeviceSummaryCard({ device }: Props) {
  const status = statusConfig[device.current_status];
  const fitness = fitnessConfig[device.fitness_status];

  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <span className="label-text block mb-1">Device Details</span>
          <h2 className="text-lg font-bold text-p5 font-mono">
            {device.mac_id}
          </h2>
          <p className="text-xs text-p3 mt-0.5">
            Serial: {device.serial_number}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: status.bg, color: status.color }}
          >
            {status.label}
          </span>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: fitness.bg, color: fitness.color }}
          >
            {fitness.label}
          </span>
        </div>
      </div>

      {/* Info rows */}
      <div>
        <InfoRow
          icon={Monitor}
          label="Model"
          value={`${device.model} Gateway`}
        />
        <InfoRow
          icon={Server}
          label="Manufacturer"
          value={device.manufacturer}
        />
        <InfoRow icon={Wifi} label="Platform" value={device.platform} />
        <InfoRow
          icon={Tag}
          label="Device Type"
          value={device.device_type.replace(/_/g, " ")}
        />
        <InfoRow
          icon={Calendar}
          label="Manufactured"
          value={device.manufacture_date}
        />
        <InfoRow
          icon={MapPin}
          label="Warehouse"
          value={device.warehouse_id ?? "—"}
        />
      </div>

      {/* Customer association */}
      {device.customer_association?.customer_id && (
        <div className="mt-4 rounded-xl bg-p2/5 border border-p2/15 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-3.5 w-3.5 text-p3" strokeWidth={1.5} />
            <p className="text-[10px] text-p3 uppercase tracking-widest">
              Customer Association
            </p>
          </div>
          <p className="text-xs text-p5 font-medium">
            {device.customer_association.customer_account_number}
          </p>
          <p className="text-xs text-p3 mt-0.5">
            {device.customer_association.activation_platform} ·{" "}
            {device.customer_association.current_service_location.replace(
              /_/g,
              " ",
            )}
          </p>
        </div>
      )}
    </motion.div>
  );
}
