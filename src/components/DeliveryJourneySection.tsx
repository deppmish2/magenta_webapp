import { motion } from "framer-motion";
import { SectionWrapper } from "./SectionWrapper";
import { modePanelClasses } from "../data/demoContent";

interface JourneyStage {
  id: string;
  label: string;
  deliverable: string;
  technicalMaturity: string;
  governanceMaturity: string;
  outcome: string;
}

const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: "strategy",
    label: "Strategy",
    deliverable: "Use case shortlist, data readiness assessment, risk and value map, executive alignment brief.",
    technicalMaturity: "Baseline inventory of data sources, system integrations, and infrastructure posture.",
    governanceMaturity: "Risk classification, data residency requirements, and initial stakeholder accountability defined.",
    outcome: "Organisation has a prioritised AI investment plan with clear criteria for the first pilot.",
  },
  {
    id: "prototype",
    label: "Prototype",
    deliverable: "Working demo of selected use cases, validated UX patterns, and initial prompt architecture.",
    technicalMaturity: "Proof-of-concept stack with orchestration, retrieval, and model gateway wired together.",
    governanceMaturity: "Guardrails applied to demo flows; initial trust controls and escalation paths tested.",
    outcome: "Stakeholders can see and interact with the AI; business relevance is confirmed before deeper investment.",
  },
  {
    id: "pilot",
    label: "Pilot",
    deliverable: "Limited production deployment with real users, connected to approved enterprise data sources.",
    technicalMaturity: "Observability, evaluation loops, and model monitoring active; canary release controls in place.",
    governanceMaturity: "Full audit logging, RBAC, and policy enforcement enforced end-to-end on pilot scope.",
    outcome: "Usage metrics, groundedness data, and user feedback provide the evidence base for production business case.",
  },
  {
    id: "production",
    label: "Production",
    deliverable: "Fully governed deployment with monitoring, incident response, and human oversight established.",
    technicalMaturity: "Platform hardening, SLA targets set, failover tested, cost envelopes enforced.",
    governanceMaturity: "Regular evaluation cycles, model change management, and compliance evidence packs available.",
    outcome: "AI capability operating reliably in production, measurable against agreed business KPIs.",
  },
  {
    id: "scale",
    label: "Scale",
    deliverable: "Multi-use-case rollout using shared platform components, with cost and performance optimisation.",
    technicalMaturity: "Platform reuse across use cases; shared retrieval, orchestration, and gateway infrastructure.",
    governanceMaturity: "Governance framework extended to all deployed use cases; continuous improvement cycles established.",
    outcome: "Enterprise AI moves from project to platform — generating compounding value with decreasing marginal cost.",
  },
];

export function DeliveryJourneySection() {
  return (
    <SectionWrapper
      id="journey"
      eyebrow="Delivery Journey"
      title="From Strategy to Scale"
      description="A structured five-stage approach that takes organisations from initial AI opportunity to governed, multi-use-case platform deployment."
      tintClassName={modePanelClasses.enterprise}
    >
      {/* Horizontal stage indicator */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="hidden xl:flex items-center gap-0"
      >
        {JOURNEY_STAGES.map((stage, index) => (
          <div key={stage.id} className="flex flex-1 items-center">
            <div className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-magenta-400/35 bg-magenta-500/15 text-xs font-bold text-magenta-200">
                {index + 1}
              </div>
              <p className="font-display text-sm text-white/70">{stage.label}</p>
            </div>
            {index < JOURNEY_STAGES.length - 1 && (
              <div className="h-px flex-1 bg-gradient-to-r from-magenta-400/30 to-white/10" />
            )}
          </div>
        ))}
      </motion.div>

      {/* Stage cards */}
      <div className="grid gap-4 xl:grid-cols-5">
        {JOURNEY_STAGES.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <div className="flex h-full flex-col rounded-[24px] border border-white/10 bg-black/30 p-5 space-y-4">
              {/* Stage header — visible on mobile/tablet, hidden on xl (shown in row above) */}
              <div className="flex items-center gap-3 xl:hidden">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-magenta-400/35 bg-magenta-500/15 text-xs font-bold text-magenta-200">
                  {index + 1}
                </div>
                <p className="font-display text-lg text-white">{stage.label}</p>
              </div>
              {/* On xl screens, show just title */}
              <p className="hidden xl:block font-display text-lg text-white">{stage.label}</p>

              {/* Deliverable */}
              <div className="flex-1 space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/38">
                  Deliverable
                </p>
                <p className="text-sm leading-6 text-white/62">{stage.deliverable}</p>
              </div>

              {/* Tech maturity */}
              <div className="rounded-[18px] border border-white/8 bg-white/[0.03] p-3 space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/35">
                  Technical
                </p>
                <p className="text-xs leading-5 text-white/55">{stage.technicalMaturity}</p>
              </div>

              {/* Governance maturity */}
              <div className="rounded-[18px] border border-magenta-400/12 bg-magenta-500/[0.05] p-3 space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-magenta-200/55">
                  Governance
                </p>
                <p className="text-xs leading-5 text-white/55">{stage.governanceMaturity}</p>
              </div>

              {/* Outcome */}
              <div className="rounded-[18px] border border-emerald-400/12 bg-emerald-500/[0.05] p-3 space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-emerald-300/55">
                  Outcome
                </p>
                <p className="text-xs leading-5 text-white/55">{stage.outcome}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
