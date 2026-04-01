import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  ChevronRight,
  Globe2,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { MagentaDemoPanel } from "./components/MagentaDemoPanel";
import { SectionHeading } from "./components/SectionHeading";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";
import architectureLayersData from "./data/architectureLayers.json";
import discoverTopicsData from "./data/discoverTopics.json";
import opsMetricsData from "./data/opsMetrics.json";
import transformationJourneyData from "./data/transformationJourney.json";
import trustControlsData from "./data/trustControls.json";
import useCasesData from "./data/useCases.json";
import type {
  ArchitectureLayer,
  DiscoverTopic,
  OpsMetric,
  TransformationStage,
  TrustControl,
  UseCase,
} from "./types";

const discoverTopics = discoverTopicsData as DiscoverTopic[];
const trustControls = trustControlsData as TrustControl[];
const architectureLayers = architectureLayersData as ArchitectureLayer[];
const opsMetrics = opsMetricsData as OpsMetric[];
const useCases = useCasesData as UseCase[];
const transformationJourney = transformationJourneyData as TransformationStage[];

const navigation = [
  { id: "hero", label: "Overview" },
  { id: "demo", label: "Live Demo" },
  { id: "enterprise", label: "Enterprise" },
  { id: "use-cases", label: "Use Cases" },
];

const rolloutControls = [
  "Canary rollout",
  "Traffic shaping",
  "Model failover",
  "Tenant isolation",
  "Evaluation loop",
];

export default function App() {
  const [selectedPromptId, setSelectedPromptId] = useState("roaming-business-eu");

  function scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  }

  function preloadPrompt(promptId: string) {
    setSelectedPromptId(promptId);
    scrollToSection("demo");
  }

  return (
    <TooltipProvider delayDuration={80}>
      <div className="relative min-h-screen overflow-x-hidden bg-canvas text-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(circle_at_18%_18%,rgba(226,0,116,0.24),transparent_26%),radial-gradient(circle_at_82%_10%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_60%_44%,rgba(111,0,255,0.14),transparent_24%)]" />
        <div className="pointer-events-none absolute inset-0 bg-hero-grid bg-[size:46px_46px] opacity-[0.03]" />

        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06040a]/80 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
            <a href="#hero" className="flex items-center gap-3">
              <div className="rounded-2xl border border-magenta-400/40 bg-magenta-500/15 p-2">
                <Sparkles className="h-5 w-5 text-magenta-100" />
              </div>
              <div>
                <p className="font-display text-lg text-white">MagentaAI Experience</p>
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                  T-Systems demo prototype
                </p>
              </div>
            </a>
            <nav className="hidden items-center gap-5 lg:flex">
              {navigation.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <Button variant="secondary" size="sm" onClick={() => scrollToSection("demo")}>
              Open Demo
            </Button>
          </div>
        </header>

        <main className="relative z-10 mx-auto flex max-w-[1280px] flex-col gap-8 px-4 pb-20 pt-8 sm:px-6 lg:px-8">
          <section id="hero" className="section-shell section-noise">
            <div className="section-grid" />
            <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-magenta-400 shadow-[0_0_18px_rgba(255,99,206,0.9)]" />
                  <span className="text-xs uppercase tracking-[0.32em] text-white/65">
                    Perplexity-style answer UX, GPT mini backend
                  </span>
                </div>
                <div className="space-y-4">
                  <h1 className="max-w-4xl font-display text-5xl leading-tight text-white sm:text-6xl">
                    MagentaAI Experience
                  </h1>
                  <p className="max-w-2xl text-xl leading-8 text-white/72">
                    A simpler, clearer demo: direct answers up front, enterprise trust
                    underneath, and just enough architecture to show how it scales.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="accent" onClick={() => scrollToSection("demo")}>
                    Try Live Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => scrollToSection("enterprise")}
                  >
                    View Enterprise Layer
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Real answers",
                    "Source-backed",
                    "Voice + text",
                    "Trust visible",
                    "Easy to navigate",
                  ].map((item) => (
                    <Badge key={item}>{item}</Badge>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="grid gap-4"
              >
                <Card className="border-magenta-400/20 bg-black/30">
                  <CardContent className="space-y-5 p-6">
                    <div className="flex items-center justify-between gap-3">
                      <Badge>Quick start</Badge>
                      <Bot className="h-5 w-5 text-magenta-100" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="font-display text-2xl text-white">
                        Start from a curated prompt
                      </h2>
                      <p className="text-sm leading-7 text-white/65">
                        The user does not need to understand the architecture first.
                        They can begin with a single question and get a polished answer
                        immediately.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {discoverTopics.slice(0, 4).map((topic) => (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => preloadPrompt(topic.promptId)}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/72 transition-colors hover:border-magenta-400/30 hover:text-white"
                        >
                          {topic.title}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4 sm:grid-cols-3">
                  <SummaryTile
                    icon={<ShieldCheck className="h-5 w-5 text-magenta-100" />}
                    label="Trust"
                    value="Grounding, privacy, escalation"
                  />
                  <SummaryTile
                    icon={<Layers3 className="h-5 w-5 text-magenta-100" />}
                    label="Platform"
                    value="Orchestration, retrieval, gateway"
                  />
                  <SummaryTile
                    icon={<BarChart3 className="h-5 w-5 text-magenta-100" />}
                    label="Operations"
                    value="Latency, groundedness, failover"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          <section id="demo" className="section-shell section-noise">
            <div className="section-grid" />
            <div className="relative space-y-8">
              <SectionHeading
                eyebrow="Live Demo"
                title="One clean interaction instead of a crowded control room"
                description="The demo now centers on a single answer flow. Pick a mode, ask a question, and see the answer, sources, trust rationale, and architecture trace without jumping between sidebars."
              />
              <MagentaDemoPanel externalPromptId={selectedPromptId} />
            </div>
          </section>

          <section id="enterprise" className="section-shell section-noise">
            <div className="section-grid" />
            <div className="relative space-y-8">
              <SectionHeading
                eyebrow="Enterprise Snapshot"
                title="The architecture story is still there, but it supports the demo instead of overwhelming it"
                description="This section compresses the enterprise view into three straightforward lenses: trust controls, the platform layers behind the answer engine, and the operations cockpit needed for production scale."
              />

              <div className="grid gap-5 xl:grid-cols-3">
                <Card className="bg-white/[0.03]">
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-magenta-100" />
                      <h3 className="font-display text-2xl text-white">Trusted AI</h3>
                    </div>
                    {trustControls.slice(0, 4).map((control) => (
                      <div
                        key={control.id}
                        className="rounded-[20px] border border-white/10 bg-black/20 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-white">{control.label}</p>
                          <Badge variant="success">{control.status}</Badge>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-white/62">
                          {control.description}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-white/[0.03]">
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-center gap-3">
                      <Layers3 className="h-5 w-5 text-magenta-100" />
                      <h3 className="font-display text-2xl text-white">Platform layers</h3>
                    </div>
                    {architectureLayers.slice(0, 5).map((layer) => (
                      <div
                        key={layer.id}
                        className="rounded-[20px] border border-white/10 bg-black/20 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium text-white">{layer.title}</p>
                          <ChevronRight className="h-4 w-4 text-white/35" />
                        </div>
                        <p className="mt-2 text-sm leading-6 text-white/62">
                          {layer.subtitle}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-white/52">
                          {layer.whyItMatters}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-white/[0.03]">
                  <CardContent className="space-y-5 p-6">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-magenta-100" />
                      <h3 className="font-display text-2xl text-white">Operations cockpit</h3>
                    </div>
                    <div className="space-y-3">
                      {opsMetrics.slice(0, 4).map((metric) => (
                        <div
                          key={metric.id}
                          className="rounded-[20px] border border-white/10 bg-black/20 p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm text-white/60">{metric.label}</p>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className="rounded-full border border-white/10 bg-white/[0.03] p-2 text-white/55 transition-colors hover:border-magenta-400/40 hover:text-white"
                                >
                                  <Globe2 className="h-4 w-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>{metric.description}</TooltipContent>
                            </Tooltip>
                          </div>
                          <p className="mt-3 font-display text-3xl text-white">
                            {metric.value}
                          </p>
                          <p className="mt-2 text-sm text-white/52">{metric.delta}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {rolloutControls.map((control) => (
                        <Badge key={control} variant="muted">
                          {control}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section id="use-cases" className="section-shell section-noise">
            <div className="section-grid" />
            <div className="relative space-y-8">
              <SectionHeading
                eyebrow="Use Cases & Journey"
                title="Still strategic, but much easier to scan"
                description="The business story is now compact: four use cases on one side and the consulting transformation journey on the other, so the panel can focus on the live product experience."
              />

              <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="grid gap-4 md:grid-cols-2">
                  {useCases.map((useCase) => (
                    <Card key={useCase.id} className="bg-white/[0.03]">
                      <CardContent className="space-y-4 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-2">
                            <Badge>{useCase.title}</Badge>
                            <h3 className="font-display text-2xl text-white">
                              {useCase.title}
                            </h3>
                          </div>
                          <Building2 className="h-5 w-5 text-magenta-100" />
                        </div>
                        <p className="text-sm leading-7 text-white/66">
                          {useCase.businessProblem}
                        </p>
                        <p className="text-sm leading-7 text-white/52">
                          {useCase.outcome}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-white/[0.03]">
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-magenta-100" />
                      <h3 className="font-display text-2xl text-white">
                        Transformation journey
                      </h3>
                    </div>
                    {transformationJourney.map((stage) => (
                      <div
                        key={stage.stage}
                        className="rounded-[20px] border border-white/10 bg-black/20 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <Badge>{stage.stage}</Badge>
                          <ChevronRight className="h-4 w-4 text-white/35" />
                        </div>
                        <p className="mt-3 text-sm leading-6 text-white/66">
                          {stage.clientConcern}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-white/52">
                          {stage.deliverable}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section id="cta" className="section-shell section-noise">
            <div className="section-grid" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <Badge>Executive close</Badge>
                <h2 className="font-display text-4xl text-white sm:text-5xl">
                  From direct AI answers to governed AI platforms at scale.
                </h2>
                <p className="text-lg leading-8 text-white/68">
                  The experience stays approachable, while the enterprise story is
                  still visible enough to show product judgment, architecture depth,
                  and consulting value.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="accent" onClick={() => preloadPrompt("roaming-business-eu")}>
                  Replay Demo
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => scrollToSection("enterprise")}
                >
                  Enterprise View
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </TooltipProvider>
  );
}

function SummaryTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.28em] text-magenta-200/75">
          {label}
        </p>
        {icon}
      </div>
      <p className="mt-3 text-sm leading-7 text-white/68">{value}</p>
    </div>
  );
}
