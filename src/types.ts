export type DemoMode = "consumer" | "enterprise" | "architect";
export type InputMode = "text" | "voice";
export type DemoView = "experience" | "trust" | "architecture";

export interface PromptRecord {
  id: string;
  text: string;
  mode: DemoMode;
  category: string;
  preview: string;
  recentTopic: string;
  keywords: string[];
}

export interface SourceRecord {
  id: string;
  title: string;
  kind: string;
  domain: string;
  url: string;
  snippet: string;
  freshness: string;
}

export interface ResponseTraceStep {
  step: string;
  component: string;
  detail: string;
}

export interface LiveAnswer {
  title: string;
  summary: string;
  answer: string[];
  takeaways: string[];
  followUps: string[];
  sources: SourceRecord[];
  trustBadges: string[];
  confidence: string;
  trustReason: string;
  trace: ResponseTraceStep[];
  matchedPromptId: string;
  mode: DemoMode;
  providerLabel: string;
  backendLabel: string;
  engine: "openai" | "fallback";
}

export interface ResponseRecord {
  id: string;
  promptId: string;
  title: string;
  executiveSummary: string;
  detailedAnswer: string[];
  takeaways: string[];
  sources: string[];
  trustBadges: string[];
  confidence: string;
  trustReason: string;
  followUps: string[];
  modeGuidance: Record<DemoMode, string>;
  trace: ResponseTraceStep[];
}

export interface DiscoverTopic {
  id: string;
  title: string;
  description: string;
  promptId: string;
  tags: string[];
}

export interface TrustControl {
  id: string;
  label: string;
  status: string;
  description: string;
  evidence: string;
  modes: DemoMode[];
}

export interface ArchitectureLayer {
  id: string;
  title: string;
  subtitle: string;
  whatItDoes: string;
  whyItMatters: string;
  howItScales: string;
  architectFocus: string;
  controls: Array<{
    label: string;
    hint: string;
  }>;
}

export interface OpsMetric {
  id: string;
  label: string;
  value: string;
  delta: string;
  description: string;
}

export interface UseCase {
  id: string;
  title: string;
  businessProblem: string;
  workflow: string;
  trustRequirements: string;
  scalingConsiderations: string[];
  outcome: string;
}

export interface TransformationStage {
  stage: string;
  clientConcern: string;
  architecturalFocus: string;
  deliverable: string;
  successMetric: string;
}
