import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Cpu,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Activity,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mockDeviceList } from "@/lib/mock-data";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Health Analysis",
    desc: "LLM-powered device scoring with contextual insights",
  },
  {
    icon: ShieldCheck,
    title: "Risk Assessment",
    desc: "Predictive failure detection and redeployment safety",
  },
  {
    icon: Activity,
    title: "Live Telemetry",
    desc: "Signal, temperature, and reboot monitoring in real time",
  },
  {
    icon: TrendingUp,
    title: "Lifecycle Tracking",
    desc: "Full history from first activation to retirement",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof mockDeviceList>([]);

  const handleChange = (v: string) => {
    setQuery(v);
    if (v.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const q = v.toLowerCase();
    setSuggestions(
      mockDeviceList
        .filter(
          (d) =>
            d.mac_id.toLowerCase().includes(q) ||
            d.serial_number.toLowerCase().includes(q) ||
            d.model.toLowerCase().includes(q),
        )
        .slice(0, 5),
    );
  };

  const submit = (id?: string) => {
    const target = id ?? query.trim();
    if (!target) return;
    setSuggestions([]);
    // Try to match to a known device
    const found = mockDeviceList.find(
      (d) =>
        d.mac_id.toLowerCase() === target.toLowerCase() ||
        d.mac_id.toLowerCase().replace(/:/g, "") ===
          target.toLowerCase().replace(/:/g, "") ||
        d.serial_number.toLowerCase() === target.toLowerCase(),
    );
    navigate(`/overview/${encodeURIComponent(found ? found.mac_id : target)}`);
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-16 overflow-hidden">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full opacity-10 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, #b325e0 0%, #7250DC 60%, transparent 100%)",
        }}
      />

      {/* Hero */}
      <motion.div
        className="relative z-10 flex max-w-2xl w-full flex-col items-center text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ring-2 ring-p2/25"
          style={{
            background: "linear-gradient(135deg, #b325e020, #7250DC30)",
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Cpu className="h-8 w-8 text-p2" strokeWidth={1.5} />
        </motion.div>

        <h1 className="text-4xl font-extrabold tracking-tight text-p5 sm:text-5xl">
          Device Lifecycle
        </h1>
        <h1
          className="text-4xl font-extrabold tracking-tight sm:text-5xl"
          style={{
            background: "linear-gradient(135deg, #b325e0, #7250DC)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Intelligence
        </h1>

        <p className="mt-5 max-w-lg text-base text-p3 leading-relaxed">
          AI-powered health monitoring and redeployment decision engine for
          network gateways.
        </p>

        {/* Search box */}
        <div className="relative mt-8 w-full">
          <div
            className="flex items-center rounded-2xl border border-p2/35 bg-white transition-all
                       duration-200 focus-within:border-p2/70 focus-within:shadow-glow"
            style={{
              boxShadow:
                "0 0 0 1px rgba(179,37,224,0.15), 0 4px 24px rgba(114,80,220,0.1)",
            }}
          >
            <Search
              className="ml-4 h-5 w-5 shrink-0 text-p3"
              strokeWidth={1.5}
            />
            <input
              type="text"
              placeholder="Search by MAC ID, Serial Number, or Model…"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="flex-1 bg-transparent px-3 py-3.5 text-sm text-p5 placeholder:text-p3/60 outline-none"
              autoFocus
            />
            <button
              onClick={() => submit()}
              disabled={!query.trim()}
              className="mr-2 flex items-center gap-1.5 rounded-xl px-4 py-2
                         text-sm font-semibold text-white transition-all hover:opacity-90
                         active:scale-[0.97] disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #b325e0, #7250DC)",
              }}
            >
              Search <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl
                           border border-p2/20 bg-white z-20"
                style={{ boxShadow: "0 4px 24px rgba(114,80,220,0.15)" }}
              >
                {suggestions.map((d) => (
                  <li key={d.mac_id}>
                    <button
                      onClick={() => submit(d.mac_id)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left
                                 text-sm transition hover:bg-p2/5"
                    >
                      <Cpu
                        className="h-4 w-4 text-p3 shrink-0"
                        strokeWidth={1.5}
                      />
                      <span className="font-semibold text-p5 font-mono">
                        {d.mac_id}
                      </span>
                      <span className="text-p3">— {d.serial_number}</span>
                      <span className="ml-auto text-xs text-p4">{d.model}</span>
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Quick-access pills */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {mockDeviceList.slice(0, 4).map((d) => (
            <button
              key={d.mac_id}
              onClick={() => submit(d.mac_id)}
              className="rounded-lg border border-p2/25 bg-p2/5 px-3 py-1.5 text-xs
                         font-mono text-p3 transition hover:border-p2/50 hover:text-p2"
            >
              {d.mac_id}
            </button>
          ))}
          <button
            onClick={() => navigate("/devices")}
            className="rounded-lg border border-p2/25 bg-p2/5 px-3 py-1.5 text-xs
                       text-p3 transition hover:border-p2/50 hover:text-p2"
          >
            View All →
          </button>
        </div>
      </motion.div>

      {/* Feature cards */}
      <motion.div
        className="relative z-10 mt-16 grid max-w-4xl w-full grid-cols-2 gap-4 sm:grid-cols-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {FEATURES.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            className="card p-4 text-center hover:shadow-glow transition-shadow duration-200 cursor-default"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.07 }}
          >
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-p2/10">
              <Icon className="h-5 w-5 text-p2" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-semibold text-p5">{title}</p>
            <p className="mt-1 text-xs text-p3 leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
