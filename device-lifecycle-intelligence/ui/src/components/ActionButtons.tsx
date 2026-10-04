import { CheckCircle, Wrench, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { performDeviceAction } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Props {
  deviceId: string;
  onAction?: (action: string) => void;
}

type ActionKey = "approve_shipment" | "send_for_refurbishment" | "retire";

const actions: {
  key: ActionKey;
  label: string;
  icon: typeof CheckCircle;
  className: string;
}[] = [
  {
    key: "approve_shipment",
    label: "Approve Shipment",
    icon: CheckCircle,
    className: "bg-zinc-900 text-white hover:bg-zinc-700 active:scale-[0.98]",
  },
  {
    key: "send_for_refurbishment",
    label: "Send for Refurbishment",
    icon: Wrench,
    className:
      "border border-zinc-300 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 active:scale-[0.98]",
  },
  {
    key: "retire",
    label: "Retire Device",
    icon: Trash2,
    className:
      "border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 active:scale-[0.98]",
  },
];

export default function ActionButtons({ deviceId, onAction }: Props) {
  const [loading, setLoading] = useState<ActionKey | null>(null);
  const [done, setDone] = useState<ActionKey | null>(null);

  const handleAction = async (key: ActionKey) => {
    setLoading(key);
    try {
      await performDeviceAction(deviceId, key);
      setDone(key);
      onAction?.(key);
    } catch {
      setDone(key);
    } finally {
      setLoading(null);
      setTimeout(() => setDone(null), 2500);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-card">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
        Actions
      </p>
      <div className="flex flex-wrap gap-3">
        {actions.map(({ key, label, icon: Icon, className }) => {
          const isLoading = loading === key;
          const isDone = done === key;
          return (
            <button
              key={key}
              onClick={() => handleAction(key)}
              disabled={!!loading}
              className={cn(
                "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-150",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className,
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isDone ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              )}
              {isDone ? "Done" : label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
