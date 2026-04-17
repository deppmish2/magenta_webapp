import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Braces,
  Eye,
  FileCheck,
  Globe,
  Link,
  Lock,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { SectionWrapper } from "./SectionWrapper";
import { modePanelClasses } from "../data/demoContent";

interface GovernanceControl {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  status: string;
  description: string;
  tier: "critical" | "standard";
}

const GOVERNANCE_CONTROLS: GovernanceControl[] = [
  {
    id: "eu-residency",
    icon: Globe,
    label: "EU Data Residency",
    status: "Enforced",
    description: "All data processing and model inference routes through approved EU infrastructure. Residency is a runtime constraint, not a deployment note.",
    tier: "critical",
  },
  {
    id: "auditability",
    icon: FileCheck,
    label: "Auditability",
    status: "Active",
    description: "Every prompt, model route, and response is logged with structured evidence suitable for internal audit and regulatory review.",
    tier: "critical",
  },
  {
    id: "explainability",
    icon: Braces,
    label: "Explainability",
    status: "On",
    description: "Responses include source citations and confidence indicators. Trace views expose retrieval, policy, and orchestration logic.",
    tier: "critical",
  },
  {
    id: "human-review",
    icon: UserCheck,
    label: "Human Review",
    status: "Policy-backed",
    description: "Low-confidence or high-risk responses are routed to human specialists before delivery. Escalation paths are defined and tested.",
    tier: "critical",
  },
  {
    id: "rbac",
    icon: Lock,
    label: "Role-Based Access",
    status: "Configured",
    description: "Access to data sources, model capabilities, and governance controls is enforced by role. Least-privilege is the default posture.",
    tier: "standard",
  },
  {
    id: "policy-enforcement",
    icon: ShieldCheck,
    label: "Policy Enforcement",
    status: "Runtime",
    description: "Deployment policies — content safety, residency, cost caps, and escalation thresholds — are enforced at the orchestration gateway, not configured per-use-case.",
    tier: "standard",
  },
  {
    id: "observability",
    icon: Eye,
    label: "Observability",
    status: "Live",
    description: "Latency, groundedness, fallback events, and cost signals are captured continuously. Anomalies surface before they become incidents.",
    tier: "standard",
  },
  {
    id: "fallback-controls",
    icon: AlertTriangle,
    label: "Fallback Controls",
    status: "Warm standby",
    description: "Approved fallback models and degraded-mode responses are configured before go-live. The platform degrades gracefully rather than failing silently.",
    tier: "standard",
  },
  {
    id: "model-monitoring",
    icon: Activity,
    label: "Model Monitoring",
    status: "Continuous",
    description: "Groundedness, drift, and evaluation quality are reviewed on an ongoing basis. Evaluation loops inform prompt pack updates and model selection decisions.",
    tier: "standard",
  },
  {
    id: "secure-integration",
    icon: Link,
    label: "Secure Integration",
    status: "Enforced",
    description: "Enterprise data source connections use approved authentication, network policies, and secrets management. No data leaves the approved integration boundary.",
    tier: "critical",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function GovernanceSection() {
  const critical = GOVERNANCE_CONTROLS.filter((c) => c.tier === "critical");
  const standard = GOVERNANCE_CONTROLS.filter((c) => c.tier === "standard");

  return (
    <SectionWrapper
      id="governance"
      eyebrow="Trust & Governance"
      title="Trusted AI by Design"
      description="Governance is not a final checklist. Every control below is active at the platform layer — enforced by architecture, not documented as a future intention."
      tintClassName={modePanelClasses.enterprise}
    >
      {/* Critical tier header */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-magenta-200/60">
          Critical controls
        </p>

        <motion.div
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {critical.map((control) => (
            <GovernanceCard key={control.id} control={control} isCritical />
          ))}
        </motion.div>
      </motion.div>

      {/* Standard tier header */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-4"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
          Operational controls
        </p>

        <motion.div
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {standard.map((control) => (
            <GovernanceCard key={control.id} control={control} isCritical={false} />
          ))}
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}

function GovernanceCard({
  control,
  isCritical,
}: {
  control: GovernanceControl;
  isCritical: boolean;
}) {
  const Icon = control.icon;
  return (
    <motion.div variants={cardVariants}>
      <div
        className={`group h-full rounded-[24px] border p-5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] ${
          isCritical
            ? "border-magenta-400/20 bg-magenta-500/[0.07]"
            : "border-white/10 bg-black/30"
        }`}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className={`rounded-xl border p-2.5 ${
              isCritical
                ? "border-magenta-300/25 bg-magenta-500/15 text-magenta-200"
                : "border-white/10 bg-white/5 text-white/55"
            }`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] ${
              isCritical
                ? "border-magenta-400/25 bg-magenta-500/10 text-magenta-200/80"
                : "border-white/10 bg-white/[0.04] text-white/40"
            }`}
          >
            {control.status}
          </span>
        </div>

        <p className="font-display text-base text-white mb-2">{control.label}</p>
        <p className="text-sm leading-6 text-white/55">{control.description}</p>
      </div>
    </motion.div>
  );
}
