import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

function Bone({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-gray-100", className)}
      style={style}
    />
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("card p-6 space-y-4", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Bone className="h-2.5 w-20" />
          <Bone className="h-5 w-36" />
          <Bone className="h-2.5 w-28" />
        </div>
        <Bone className="h-7 w-20 rounded-full" />
      </div>
      <div className="space-y-2 pt-2">
        {[70, 55, 80, 45, 65, 50].map((w, i) => (
          <div key={i} className="flex items-center gap-3">
            <Bone className="h-7 w-7 rounded-lg" />
            <Bone className="h-2.5 flex-1" style={{ maxWidth: `${w}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("card p-6 space-y-4", className)}>
      <Bone className="h-2.5 w-32" />
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Bone key={i} className="h-12 rounded-xl" />
        ))}
      </div>
      <Bone className="h-[140px] rounded-xl" />
    </div>
  );
}

export function TagsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("card p-6 space-y-3", className)}>
      <Bone className="h-2.5 w-28" />
      <div className="flex flex-wrap gap-2">
        {[88, 112, 96, 128, 104].map((w) => (
          <Bone key={w} className="h-7 rounded-lg" style={{ width: w }} />
        ))}
      </div>
      <div className="space-y-2 pt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-2">
            <Bone className="h-2 w-2 rounded-full mt-1.5" />
            <Bone className="h-2.5 flex-1" style={{ maxWidth: "85%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
