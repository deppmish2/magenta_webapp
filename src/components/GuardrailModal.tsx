import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Shield, ShieldAlert, X } from "lucide-react";
import type { GuardrailViolation } from "../lib/guardrails";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface GuardrailModalProps {
  violation: GuardrailViolation | null;
  onDismiss: () => void;
  onContinue: () => void;
}

const PIPELINE_STAGES = [
  { label: "Input received", status: "pass" },
  { label: "Guardrail scan", status: "blocked" },
  { label: "Policy check", status: "skipped" },
  { label: "Model gateway", status: "skipped" },
  { label: "Response", status: "skipped" },
];

export function GuardrailModal({
  violation,
  onDismiss,
  onContinue,
}: GuardrailModalProps) {
  return (
    <AnimatePresence>
      {violation ? (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onDismiss}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-2xl overflow-hidden rounded-[32px] border border-red-400/20 bg-[#0e080f] shadow-[0_0_80px_rgba(220,38,38,0.18)]"
          >
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />

            <div className="space-y-6 p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-400/25 bg-red-500/12">
                    <ShieldAlert className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="muted" className="border-red-400/25 bg-red-500/10 text-red-300">
                        Guardrail triggered
                      </Badge>
                      <Badge variant="muted">
                        {violation.category}
                      </Badge>
                      {violation.severity === "high" && (
                        <Badge variant="muted" className="border-orange-400/20 bg-orange-500/10 text-orange-300">
                          High severity
                        </Badge>
                      )}
                    </div>
                    <h2 className="mt-2 font-display text-2xl text-white">
                      {violation.rule}
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onDismiss}
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-white/50 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Detected fragment */}
              <div className="rounded-[20px] border border-red-400/15 bg-red-500/6 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-300/70">
                  Detected fragment
                </p>
                <p className="mt-3 font-mono text-sm leading-6 text-red-200/80">
                  &ldquo;{violation.fragment}&rdquo;
                </p>
              </div>

              {/* Explanation */}
              <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-magenta-200/70" />
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                    Why this was blocked
                  </p>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/72">
                  {violation.explanation}
                </p>
              </div>

              {/* Pipeline trace */}
              <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                  Request pipeline
                </p>
                <div className="mt-4 flex items-center gap-0">
                  {PIPELINE_STAGES.map((stage, index) => (
                    <div key={stage.label} className="flex min-w-0 flex-1 items-center">
                      <div className="flex min-w-0 flex-col items-center gap-2">
                        <div
                          className={
                            stage.status === "pass"
                              ? "flex h-8 w-8 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/15 text-xs font-bold text-emerald-300"
                              : stage.status === "blocked"
                                ? "flex h-8 w-8 items-center justify-center rounded-full border border-red-400/35 bg-red-500/18 text-xs font-bold text-red-300"
                                : "flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-bold text-white/25"
                          }
                        >
                          {stage.status === "pass" ? "✓" : stage.status === "blocked" ? "✕" : "–"}
                        </div>
                        <p
                          className={
                            stage.status === "blocked"
                              ? "text-center text-[10px] leading-4 text-red-300/80"
                              : stage.status === "pass"
                                ? "text-center text-[10px] leading-4 text-emerald-300/70"
                                : "text-center text-[10px] leading-4 text-white/25"
                          }
                        >
                          {stage.label}
                        </p>
                      </div>
                      {index < PIPELINE_STAGES.length - 1 && (
                        <div
                          className={
                            index === 0
                              ? "mx-1 h-px flex-1 bg-emerald-400/25"
                              : "mx-1 h-px flex-1 bg-white/8"
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2">
                <Badge>Input validation active</Badge>
                <Badge>Injection pattern match</Badge>
                <Badge>Request terminated</Badge>
                <Badge variant="muted">No data sent to model</Badge>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-2">
                <div className="flex items-center gap-2 text-sm text-white/45">
                  <AlertTriangle className="h-4 w-4" />
                  <span>The original query was not forwarded to the model.</span>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={onDismiss}>
                    Edit query
                  </Button>
                  <Button variant="accent" onClick={onContinue}>
                    Continue with safe query
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
