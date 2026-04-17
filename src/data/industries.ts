export interface IndustryUseCase {
  id: string;
  name: string;
  summary: string;
  businessImpact: string;
  governanceTags: string[];
}

export interface Industry {
  id: string;
  label: string;
  description: string;
  useCases: IndustryUseCase[];
}

export const industries: Industry[] = [
  {
    id: "telecom",
    label: "Telecom",
    description: "Accelerate network ops, reduce churn, and elevate customer service with AI that understands telecom complexity.",
    useCases: [
      {
        id: "telecom-csc",
        name: "Customer Support Copilot",
        summary: "AI assistant for front-line agents providing real-time guidance, knowledge retrieval, and resolution suggestions during customer interactions.",
        businessImpact: "30–40% reduction in average handle time; improved first-call resolution rates.",
        governanceTags: ["PII protection", "Audit logging", "Human escalation"],
      },
      {
        id: "telecom-nis",
        name: "Network Incident Summarization",
        summary: "Automatically condenses incident logs, alarm streams, and runbook steps into executive-ready summaries for NOC and leadership teams.",
        businessImpact: "Faster MTTR; reduced analyst fatigue during major outages.",
        governanceTags: ["Source grounding", "Traceability", "Role-based access"],
      },
      {
        id: "telecom-cia",
        name: "Churn Insight Assistant",
        summary: "Synthesizes CRM, usage, and support data to surface churn risk signals and recommend targeted retention actions for account managers.",
        businessImpact: "5–8% improvement in enterprise churn prevention; prioritized retention spend.",
        governanceTags: ["EU data residency", "Explainability", "Privacy mode"],
      },
      {
        id: "telecom-fsa",
        name: "Field Service Assistant",
        summary: "Mobile-first copilot for field engineers providing equipment manuals, fault diagnostics, and spare parts guidance on-site.",
        businessImpact: "Reduced repeat dispatches; faster fault resolution at the edge.",
        governanceTags: ["Offline capability", "Source grounding", "Safety filters"],
      },
      {
        id: "telecom-pra",
        name: "Product & Pricing Advisor",
        summary: "Assists sales teams and channel partners with accurate, policy-compliant product and pricing recommendations tailored to customer segments.",
        businessImpact: "Reduced mis-selling risk; improved deal velocity for enterprise accounts.",
        governanceTags: ["Policy enforcement", "Audit logging", "Human review"],
      },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    description: "Deploy governed AI across regulated financial workflows — from compliance to fraud operations — with full auditability.",
    useCases: [
      {
        id: "finance-rka",
        name: "Regulatory Knowledge Assistant",
        summary: "Answers complex regulatory queries by retrieving and synthesizing up-to-date policy documents, circulars, and compliance frameworks.",
        businessImpact: "Faster compliance responses; reduced reliance on specialist escalations for standard queries.",
        governanceTags: ["Source grounding", "Audit logging", "EU data residency"],
      },
      {
        id: "finance-foc",
        name: "Fraud Operations Copilot",
        summary: "Surfaces case context, detection signals, and recommended actions to fraud analysts in a single governed workspace.",
        businessImpact: "20–35% faster fraud investigation cycle; improved analyst throughput.",
        governanceTags: ["Human review", "Traceability", "Role-based access"],
      },
      {
        id: "finance-dic",
        name: "Document Intelligence for Compliance",
        summary: "Extracts, classifies, and summarizes key obligations from contracts, KYC documents, and regulatory filings.",
        businessImpact: "Reduction in manual document review hours; audit-ready evidence packs.",
        governanceTags: ["PII protection", "Explainability", "Policy enforcement"],
      },
      {
        id: "finance-ipa",
        name: "Internal Policy Assistant",
        summary: "Answers employee queries about internal policies, procedures, and code of conduct with grounded, auditable responses.",
        businessImpact: "Reduction in HR and compliance ticket volume; consistent policy interpretation.",
        governanceTags: ["Source grounding", "Audit logging", "Safety filters"],
      },
    ],
  },
  {
    id: "public-sector",
    label: "Public Sector",
    description: "Citizen-centric AI with sovereign deployment, full auditability, and compliance with public-sector data requirements.",
    useCases: [
      {
        id: "ps-csa",
        name: "Citizen Support Assistant",
        summary: "Answers citizen queries about government services, entitlements, and procedures — available 24/7 across digital channels.",
        businessImpact: "Reduced call center volume; improved citizen satisfaction scores.",
        governanceTags: ["EU data residency", "Accessibility", "Human escalation"],
      },
      {
        id: "ps-cas",
        name: "Case Summarization",
        summary: "Automatically generates concise summaries of complex case files, enabling faster review and decision-making by caseworkers.",
        businessImpact: "30% reduction in time to decision; more consistent case handling.",
        governanceTags: ["Audit logging", "PII protection", "Traceability"],
      },
      {
        id: "ps-dsr",
        name: "Document Search and Retrieval",
        summary: "Enterprise search across government document repositories — legislation, policy documents, and internal guidance — with cited answers.",
        businessImpact: "Faster policy alignment; reduced duplication of research across departments.",
        governanceTags: ["Source grounding", "Role-based access", "EU data residency"],
      },
      {
        id: "ps-swg",
        name: "Service Workflow Guidance",
        summary: "Guides public servants through complex multi-step service workflows with contextual prompts and compliance checkpoints.",
        businessImpact: "Reduced process errors; improved staff onboarding speed.",
        governanceTags: ["Policy enforcement", "Audit logging", "Human review"],
      },
    ],
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    description: "Operational AI for predictive maintenance, quality assurance, and knowledge capture on the shop floor.",
    useCases: [
      {
        id: "mfg-mka",
        name: "Maintenance Knowledge Assistant",
        summary: "Provides engineers with instant access to equipment manuals, fault histories, and maintenance procedures through natural language queries.",
        businessImpact: "Reduced mean time to repair; preserved institutional knowledge across workforce transitions.",
        governanceTags: ["Source grounding", "Offline capability", "Role-based access"],
      },
      {
        id: "mfg-aie",
        name: "Anomaly Insight Engine",
        summary: "Synthesizes sensor data and operational logs to surface anomaly patterns and probable root causes before critical failures occur.",
        businessImpact: "Early warning capability; reduced unplanned downtime costs.",
        governanceTags: ["Explainability", "Traceability", "Human review"],
      },
      {
        id: "mfg-qoc",
        name: "Quality Operations Copilot",
        summary: "Supports quality assurance teams with defect classification, root cause analysis, and corrective action recommendations.",
        businessImpact: "Improved defect detection rates; faster corrective action cycles.",
        governanceTags: ["Audit logging", "Policy enforcement", "Source grounding"],
      },
    ],
  },
  {
    id: "healthcare",
    label: "Healthcare",
    description: "Compliant, human-centered AI for clinical administration, document workflows, and patient service — with strict data governance.",
    useCases: [
      {
        id: "hc-awa",
        name: "Admin Workflow Assistant",
        summary: "Automates and streamlines administrative tasks — scheduling, referrals, coding support — freeing clinicians for patient care.",
        businessImpact: "Reduced administrative burden per clinician; improved throughput for routine workflows.",
        governanceTags: ["GDPR compliance", "Audit logging", "Human review"],
      },
      {
        id: "hc-cds",
        name: "Clinical Document Summarization",
        summary: "Condenses lengthy clinical notes, discharge summaries, and patient histories into structured, reviewable briefs for care teams.",
        businessImpact: "Faster clinical reviews; reduced documentation time for attending physicians.",
        governanceTags: ["PII protection", "EU data residency", "Traceability"],
      },
      {
        id: "hc-psg",
        name: "Patient Service Guidance Assistant",
        summary: "Answers patient queries about services, pathways, and appointments through a safe, governed conversational interface.",
        businessImpact: "Reduced inbound call volume; improved patient experience scores.",
        governanceTags: ["Human escalation", "Safety filters", "Accessibility"],
      },
    ],
  },
];
