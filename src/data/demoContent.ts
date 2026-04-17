import architectureLayersData from "./architectureLayers.json";
import discoverTopicsData from "./discoverTopics.json";
import opsMetricsData from "./opsMetrics.json";
import promptsData from "./prompts.json";
import responsesData from "./responses.json";
import sourcesData from "./sources.json";
import transformationJourneyData from "./transformationJourney.json";
import trustControlsData from "./trustControls.json";
import useCasesData from "./useCases.json";
import type {
  ArchitectureLayer,
  ArchitectureTraceStage,
  DemoMode,
  DiscoverTopic,
  LiveAnswer,
  ModeTheme,
  OpsMetric,
  PromptRecord,
  RegionalStatus,
  ResponseRecord,
  RolloutPlay,
  SourceRecord,
  TransformationStage,
  TrustControl,
  UseCase,
} from "../types";

export const prompts = promptsData as PromptRecord[];
export const responses = responsesData as ResponseRecord[];
export const sources = sourcesData as SourceRecord[];
export const discoverTopics = discoverTopicsData as DiscoverTopic[];
export const trustControls = trustControlsData as TrustControl[];
export const architectureLayers = architectureLayersData as ArchitectureLayer[];
export const opsMetrics = opsMetricsData as OpsMetric[];
export const useCases = useCasesData as UseCase[];
export const transformationJourney =
  transformationJourneyData as TransformationStage[];

export const promptById = Object.fromEntries(
  prompts.map((prompt) => [prompt.id, prompt]),
) as Record<string, PromptRecord>;

export const responseByPromptId = Object.fromEntries(
  responses.map((response) => [response.promptId, response]),
) as Record<string, ResponseRecord>;

export const sourceById = Object.fromEntries(
  sources.map((source) => [source.id, source]),
) as Record<string, SourceRecord>;

export const modeThemes: Record<DemoMode, ModeTheme> = {
  consumer: {
    label: "Consumer",
    audience: "Digital customer journey",
    heroBadge: "Magenta answer engine",
    heroTitle: "Direct answers that feel ready on the first tap.",
    heroDescription:
      "The consumer lens keeps the story simple: curated prompts, voice-ready input, short executive copy, and citations that feel native instead of compliance-heavy.",
    demoCallout:
      "Show the answer first. Reveal trust without making the customer study the platform.",
    trustHeadline: "Trust feels embedded, not bureaucratic.",
    architectureHeadline:
      "Architecture stays backstage until the audience asks for more.",
    operationsHeadline:
      "Operations stay mostly invisible to customers, but the quality signal is still unmistakable.",
    policyDetail:
      "Safety, privacy, and product rules are checked with a low-friction customer-safe posture before an answer appears.",
    gatewayPolicy:
      "The gateway keeps low-latency customer models in the preferred path and fails over only if speed or policy posture drifts.",
    stats: [
      {
        label: "Time to first answer",
        value: "1.6s",
        footnote: "Scripted flows tuned for crisp demo pacing",
      },
      {
        label: "Source coverage",
        value: "100%",
        footnote: "Every featured answer carries citation cards",
      },
      {
        label: "Voice-ready journeys",
        value: "8",
        footnote: "Prompt flows prepared for a 10-minute walkthrough",
      },
    ],
    storyBeats: [
      {
        title: "Answer first",
        description:
          "The page opens on a high-confidence answer surface rather than a blank chat box.",
      },
      {
        title: "Trust in context",
        description:
          "Sources, badges, and confidence cues stay close to the answer without cluttering it.",
      },
      {
        title: "Executive clarity",
        description:
          "Copy stays concise enough for a fast interview demo and believable enough for telecom stakeholders.",
      },
    ],
  },
  enterprise: {
    label: "Enterprise",
    audience: "Governed operating model",
    heroBadge: "Enterprise-grade assistant posture",
    heroTitle: "The same answer flow, now visibly governed and rollout-ready.",
    heroDescription:
      "Enterprise mode keeps the polished answer UX, but turns up the operating signals: trust controls, audit posture, data residency, and rollout discipline.",
    demoCallout:
      "Make governance visible exactly where executives expect it, while keeping the interaction smooth.",
    trustHeadline: "Controls are presentable enough for leaders and concrete enough for risk teams.",
    architectureHeadline:
      "The architecture view becomes a boardroom-friendly explanation of how the assistant stays reliable.",
    operationsHeadline:
      "The cockpit focuses on what a rollout team would actually watch in the first production wave.",
    policyDetail:
      "Residency, privacy, escalation, and audit evidence are attached before the answer is accepted as enterprise-safe.",
    gatewayPolicy:
      "The gateway routes only through approved regional models, applies cost envelopes, and preserves tenant boundaries during failover.",
    stats: [
      {
        label: "Policy gates",
        value: "6",
        footnote: "Visible trust controls tied to the active scenario",
      },
      {
        label: "Grounded answers",
        value: "94.6%",
        footnote: "Representative evaluation signal from the cockpit",
      },
      {
        label: "Rollout posture",
        value: "Canary",
        footnote: "Premium staged release story for the demo",
      },
    ],
    storyBeats: [
      {
        title: "Governed by default",
        description:
          "Trust controls sit alongside the answer instead of appearing as an afterthought.",
      },
      {
        title: "Operationally credible",
        description:
          "Latency, groundedness, escalations, and cost are framed as leadership signals, not raw dashboard noise.",
      },
      {
        title: "Easy to narrate",
        description:
          "Each section supports a clean executive talk track without forcing architecture deep-dives too early.",
      },
    ],
  },
  architect: {
    label: "Architect",
    audience: "Platform design and scale",
    heroBadge: "Platform and scale lens",
    heroTitle: "Reveal the platform logic behind a premium AI answer experience.",
    heroDescription:
      "Architect mode turns the same one-page story into a platform walkthrough: orchestration, retrieval, gateway design, monitoring, and the scale controls behind the experience.",
    demoCallout:
      "Expose the moving parts only when the audience is ready, then make every layer clickable.",
    trustHeadline: "Trust becomes traceable, inspectable, and ready for architecture discussion.",
    architectureHeadline:
      "This is the presentable architecture section you can click through live in the interview.",
    operationsHeadline:
      "The cockpit emphasizes resilience, model routing, canaries, and evidence loops instead of generic admin charts.",
    policyDetail:
      "The active answer is packaged with traceability, escalation readiness, and enforceable controls across every platform stage.",
    gatewayPolicy:
      "The gateway chooses between approved models by latency, residency, and cost policy while keeping fallback and logging consistent.",
    stats: [
      {
        label: "Platform layers",
        value: "9",
        footnote: "Clickable view from channels to infrastructure",
      },
      {
        label: "Fallback events",
        value: "0.8%",
        footnote: "Operating signal framed for production credibility",
      },
      {
        label: "Scale narrative",
        value: "5 stages",
        footnote: "Transformation journey from discovery to enterprise scale",
      },
    ],
    storyBeats: [
      {
        title: "Traceable answers",
        description:
          "The live answer can expand into a platform trace through retrieval, policy, orchestration, gateway, and monitoring.",
      },
      {
        title: "Clickable layers",
        description:
          "The architecture explorer makes the stack easy to narrate instead of dumping a static diagram.",
      },
      {
        title: "Operating discipline",
        description:
          "The cockpit shows how the platform is steered once the pilot becomes a scaled capability.",
      },
    ],
  },
};

export const modeBackgroundClasses: Record<DemoMode, string> = {
  consumer:
    "bg-[radial-gradient(circle_at_14%_18%,rgba(226,0,116,0.32),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(96,165,250,0.16),transparent_26%),radial-gradient(circle_at_56%_42%,rgba(255,255,255,0.08),transparent_22%)]",
  enterprise:
    "bg-[radial-gradient(circle_at_16%_18%,rgba(226,0,116,0.3),transparent_30%),radial-gradient(circle_at_82%_16%,rgba(45,212,191,0.14),transparent_28%),radial-gradient(circle_at_54%_42%,rgba(255,255,255,0.08),transparent_22%)]",
  architect:
    "bg-[radial-gradient(circle_at_14%_18%,rgba(226,0,116,0.3),transparent_30%),radial-gradient(circle_at_82%_16%,rgba(99,102,241,0.16),transparent_28%),radial-gradient(circle_at_56%_42%,rgba(251,191,36,0.14),transparent_22%)]",
};

export const modePanelClasses: Record<DemoMode, string> = {
  consumer: "from-magenta-500/18 via-fuchsia-500/10 to-sky-400/8",
  enterprise: "from-magenta-500/18 via-emerald-400/10 to-cyan-400/8",
  architect: "from-magenta-500/18 via-indigo-400/10 to-amber-300/10",
};

export const modeHighlightClasses: Record<DemoMode, string> = {
  consumer: "border-magenta-300/30 bg-magenta-500/10 text-magenta-50",
  enterprise: "border-emerald-300/25 bg-emerald-500/10 text-emerald-50",
  architect: "border-indigo-300/25 bg-indigo-500/10 text-indigo-50",
};

export const navigationItems = [
  { id: "overview", label: "Overview" },
  { id: "values", label: "Values" },
  { id: "vision", label: "Vision" },
  { id: "portfolio", label: "Portfolio" },
  { id: "demo", label: "Live Demo" },
  { id: "trust-architecture", label: "Trust" },
  { id: "operations", label: "Scale" },
  { id: "journey", label: "Journey" },
];

export const featuredDemoPromptIds = [
  "roaming-business-eu",
  "secure-ai-customer-service",
  "eu-residency-answer-engine",
  "genai-controls-millions",
];

export const rolloutPlays: RolloutPlay[] = [
  {
    title: "Canary release",
    status: "10% traffic",
    note: "New prompt packs are exposed to a constrained tenant slice before wide release.",
  },
  {
    title: "Traffic shaping",
    status: "Adaptive",
    note: "High-cost or high-latency flows are redirected before service posture degrades.",
  },
  {
    title: "Model failover",
    status: "Warm",
    note: "Gateway policies reroute to approved fallback models without losing trace continuity.",
  },
  {
    title: "Evaluation loop",
    status: "Hourly",
    note: "Groundedness, escalation quality, and citation usefulness are reviewed continuously.",
  },
];

export const regionalStatus: RegionalStatus[] = [
  {
    region: "Berlin",
    status: "Primary",
    posture: "Serving enterprise traffic with residency lock enabled",
  },
  {
    region: "Frankfurt",
    status: "Canary",
    posture: "Running the newest orchestration package for 10% of sessions",
  },
  {
    region: "Warsaw",
    status: "Warm standby",
    posture: "Ready for regional failover while preserving approved policy boundaries",
  },
];

export const priorityMetricIdsByMode: Record<DemoMode, string[]> = {
  consumer: ["latency", "sessions", "retrieval-success", "groundedness"],
  enterprise: ["groundedness", "escalation", "cost", "retrieval-success"],
  architect: ["latency", "fallback", "cache", "cost"],
};

export const useCaseHighlights: Record<DemoMode, string[]> = {
  consumer: ["customer-service-copilot", "employee-knowledge-assistant"],
  enterprise: ["customer-service-copilot", "regulated-workspace"],
  architect: ["network-operations-assistant", "regulated-workspace"],
};

export const journeyFocusByMode: Record<DemoMode, string> = {
  consumer: "Pilot",
  enterprise: "Govern",
  architect: "Scale",
};

export function buildLocalAnswer(
  promptId: string,
  preferredMode?: DemoMode,
): LiveAnswer {
  const prompt = promptById[promptId] ?? prompts[0];
  const response = responseByPromptId[prompt.id] ?? responses[0];

  return {
    title: response.title,
    summary: response.executiveSummary,
    answer: response.detailedAnswer,
    takeaways: response.takeaways,
    followUps: response.followUps,
    sources: response.sources
      .map((sourceId) => sourceById[sourceId])
      .filter(Boolean) as SourceRecord[],
    trustBadges: response.trustBadges,
    confidence: response.confidence,
    trustReason: response.trustReason,
    trace: response.trace,
    matchedPromptId: prompt.id,
    mode: preferredMode ?? prompt.mode,
    providerLabel: "T-Systems AI advisory experience",
    backendLabel: "Local scripted fallback",
    engine: "fallback",
  };
}

export function getDefaultPromptForMode(mode: DemoMode) {
  return prompts.find((prompt) => prompt.mode === mode) ?? prompts[0];
}

export function findBestPrompt(query: string, preferredMode: DemoMode) {
  const normalizedQuery = query.toLowerCase();
  const tokens = normalizedQuery.match(/[a-z0-9]+/g) ?? [];

  const ranked = prompts.map((prompt) => {
    let score = 0;

    if (prompt.mode === preferredMode) {
      score += 4;
    }

    if (normalizedQuery.includes(prompt.text.toLowerCase())) {
      score += 10;
    }

    for (const token of tokens) {
      if (prompt.keywords.some((keyword) => keyword.includes(token))) {
        score += 5;
      }

      if (
        prompt.text.toLowerCase().includes(token) ||
        prompt.preview.toLowerCase().includes(token) ||
        prompt.category.toLowerCase().includes(token)
      ) {
        score += 2;
      }
    }

    return { prompt, score };
  });

  const bestMatch = ranked.sort((left, right) => right.score - left.score)[0];

  if (!bestMatch || bestMatch.score <= 0) {
    return getDefaultPromptForMode(preferredMode);
  }

  return bestMatch.prompt;
}

export function buildArchitectureTrace(
  response: ResponseRecord,
  mode: DemoMode,
): ArchitectureTraceStage[] {
  const prompt = promptById[response.promptId] ?? prompts[0];
  const theme = modeThemes[mode];

  return [
    {
      id: "retrieval",
      label: "Retrieval",
      signal: `${response.sources.length} approved sources`,
      detail: `The platform retrieves current material for the ${prompt.category.toLowerCase()} scenario and checks freshness before anything is shown.`,
    },
    {
      id: "policy-checks",
      label: "Policy checks",
      signal: "Privacy + safety",
      detail: theme.policyDetail,
    },
    {
      id: "orchestration",
      label: "Orchestration",
      signal: "Mode-aware shaping",
      detail: response.modeGuidance[mode],
    },
    {
      id: "model-gateway",
      label: "Model gateway",
      signal: "Approved model route",
      detail: theme.gatewayPolicy,
    },
    {
      id: "monitoring",
      label: "Monitoring",
      signal: response.confidence,
      detail:
        "The answer, citations, and trust posture are logged as an operating signal so groundedness, drift, and escalation quality can be reviewed after the demo.",
    },
  ];
}
