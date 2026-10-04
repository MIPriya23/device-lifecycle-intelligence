import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { Device } from "@/types/device";
import { analyzeDevice } from "@/lib/api";

interface Props {
  current: Device;
}

interface AnalysisResult {
  device_health_score: number;
  failure_risk_score: number;
  redeploy_safe: boolean;
  recommendation: string;
  key_concerns: string[];
  source: string;
  last_evaluated?: string;
}

export default function ReplacementRecommendation({ current }: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await analyzeDevice(current.mac_id);
      setAnalysisResult(res.data);
    } catch {
      setError("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const recommendation =
    analysisResult?.recommendation ??
    current.ai_health_metrics.recommendation_message;
  const healthScore =
    analysisResult?.device_health_score ??
    current.ai_health_metrics.device_health_score;
  const keyConcerns =
    analysisResult?.key_concerns ?? current.ai_health_metrics.key_concerns;

  return (
    <motion.div
      className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
          AI Assessment
        </p>
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              Analyze
            </>
          )}
        </button>
      </div>

      {/* Loader while analyzing */}
      {isAnalyzing && (
        <div className="mt-2 flex items-center justify-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-6">
          <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
          <p className="text-sm font-medium text-zinc-500">
            Running AI analysis…
          </p>
        </div>
      )}

      {/* Error state */}
      {!isAnalyzing && error && (
        <div className="mt-2 rounded-xl border border-red-200 bg-red-50 p-3">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* AI Assessment */}
      {!isAnalyzing && (
        <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-3">
          <div className="mb-2 flex min-w-0 items-center justify-between gap-2">
            <p className="min-w-0 truncate text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              AI Assessment · {current.serial_number}
            </p>
            {analysisResult && (
              <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[9px] font-semibold uppercase text-zinc-500">
                {analysisResult.source === "llm" ? "LLM" : "Rule-based"}
              </span>
            )}
          </div>
          <p className="mb-3 text-xs leading-relaxed text-zinc-600">
            {recommendation}
          </p>
          {keyConcerns.length > 0 && (
            <ul className="space-y-1">
              {keyConcerns.map((c, i) => (
                <li
                  key={i}
                  className="flex items-start gap-1.5 text-[11px] text-zinc-500"
                >
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                  {c}
                </li>
              ))}
            </ul>
          )}
          {analysisResult && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-[10px] font-bold text-zinc-700">
                Health: {healthScore}/100
              </span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                  analysisResult.redeploy_safe
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {analysisResult.redeploy_safe
                  ? "Safe to Redeploy"
                  : "Do Not Redeploy"}
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
