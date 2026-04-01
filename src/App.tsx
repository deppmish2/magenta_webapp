import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { LiveAnswerPanel } from "./components/LiveAnswerPanel";
import { SectionWrapper } from "./components/SectionWrapper";
import { StickyNav } from "./components/StickyNav";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import {
  modeBackgroundClasses,
  modePanelClasses,
  modeThemes,
  promptById,
} from "./data/demoContent";
import { cn } from "./lib/utils";

const navigationItems = [
  { id: "overview", label: "Overview" },
  { id: "values", label: "Values" },
  { id: "vision", label: "Vision" },
  { id: "portfolio", label: "Portfolio" },
  { id: "demo", label: "AI Demo" },
];

const values = [
  {
    title: "Human-centered",
    description:
      "The experience should feel clear, warm, and usable for real people rather than technical stakeholders only.",
  },
  {
    title: "Trustworthy",
    description:
      "Trust is visible through grounded answers, concise explanations, and a presentation-ready safety posture.",
  },
  {
    title: "Sovereign",
    description:
      "European data control and governed deployment are treated as product qualities, not backend footnotes.",
  },
  {
    title: "Impactful",
    description:
      "The prototype focuses on business value, service quality, and operational relevance instead of AI novelty.",
  },
];

const visionPillars = [
  {
    title: "AI inside real journeys",
    description:
      "T-Systems can place AI directly into service, workplace, and operational journeys instead of offering isolated experiments.",
  },
  {
    title: "Data + governance together",
    description:
      "Reliable AI needs governed data, retrieval, privacy controls, and operational feedback loops working as one stack.",
  },
  {
    title: "From pilot to scale",
    description:
      "The vision is not a demo-only chatbot. It is a repeatable path from a fast prototype to a trusted enterprise capability.",
  },
];

const portfolioCards = [
  {
    title: "Customer Service AI",
    summary:
      "A grounded assistant for support journeys, digital self-service, and seamless escalation.",
    promptId: "secure-ai-customer-service",
  },
  {
    title: "Sovereign AI",
    summary:
      "Answer engines and copilots that respect EU residency, governance, and audit expectations.",
    promptId: "eu-residency-answer-engine",
  },
  {
    title: "Enterprise Workspace",
    summary:
      "Governed productivity flows for employees in regulated or public-sector environments.",
    promptId: "public-sector-workspace",
  },
  {
    title: "AI Operations at Scale",
    summary:
      "A platform posture for rollout controls, evaluation loops, cost, resilience, and platform discipline.",
    promptId: "genai-controls-millions",
  },
];

const walkthroughPoints = [
  "Telekom values expressed in the UX",
  "T-Systems vision for AI + data",
  "A focused AI portfolio story",
  "One believable live AI interaction",
];

export default function App() {
  const [promptId, setPromptId] = useState("secure-ai-customer-service");
  const activePrompt = promptById[promptId] ?? promptById["secure-ai-customer-service"];
  const mode = activePrompt.mode;
  const theme = modeThemes[mode];

  const highlightedValues = useMemo(
    () =>
      [
        "Simple answer-first UX",
        "Source-backed trust",
        "Sovereign enterprise posture",
        "Portfolio-led storytelling",
      ],
    [],
  );

  function scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  }

  function activatePrompt(nextPromptId: string) {
    if (!promptById[nextPromptId]) {
      return;
    }

    setPromptId(nextPromptId);
    scrollToSection("demo");
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-canvas text-white">
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-[760px] opacity-90 transition-all duration-700",
          modeBackgroundClasses[mode],
        )}
      />
      <div className="pointer-events-none absolute inset-0 bg-hero-grid bg-[size:48px_48px] opacity-[0.04]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_28%),linear-gradient(180deg,rgba(5,3,10,0.06),rgba(5,3,10,0.92))]" />

      <StickyNav
        mode={mode}
        theme={theme}
        items={navigationItems}
        onDemoClick={() => scrollToSection("demo")}
        showModeSwitch={false}
        subtitle="Telekom values, T-Systems vision, portfolio, AI demo"
      />

      <main className="app-shell">
        <section id="overview" className="section-shell">
          <div className="section-grid" />
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90",
              modePanelClasses[mode],
            )}
          />
          <div className="relative grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-magenta-400 shadow-[0_0_18px_rgba(255,99,206,0.95)]" />
                <span className="text-xs uppercase tracking-[0.32em] text-white/60">
                  concise prototype aligned to the interview brief
                </span>
              </div>

              <div className="space-y-4">
                <Badge>MagentaAI Experience</Badge>
                <h1 className="max-w-4xl font-display text-5xl leading-tight text-white sm:text-6xl lg:text-[4.1rem]">
                  How T-Systems could present AI to a client.
                </h1>
                <p className="max-w-3xl text-xl leading-8 text-white/72">
                  Telekom values in the experience. T-Systems vision in the story. A focused AI portfolio. One believable live AI demo.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="accent" onClick={() => scrollToSection("demo")}>
                  Open Live Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="secondary" onClick={() => scrollToSection("portfolio")}>
                  View Portfolio Story
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {highlightedValues.map((item) => (
                  <Badge key={item} variant="muted">
                    {item}
                  </Badge>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            >
              <Card className="overflow-hidden border-white/10 bg-black/30">
                <CardContent className="space-y-6 p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-3">
                    <Badge>What this prototype covers</Badge>
                    <Sparkles className="h-5 w-5 text-magenta-100" />
                  </div>
                  <div className="space-y-3">
                    {walkthroughPoints.map((point, index) => (
                      <div
                        key={point}
                        className="flex items-start gap-4 rounded-[22px] border border-white/10 bg-white/[0.04] p-4"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-magenta-300/30 bg-magenta-500/12 text-sm font-semibold text-magenta-50">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-base font-medium text-white">{point}</p>
                          <p className="mt-1 text-sm text-white/58">
                            {index === 0
                              ? "Human, trusted, magenta-forward."
                              : index === 1
                                ? "From data foundation to scale."
                                : index === 2
                                  ? "A tight AI and data proposition set."
                                  : "A live OpenAI-backed answer flow."}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <SectionWrapper
          id="values"
          eyebrow="Telekom Values"
          title="Warm, trustworthy, and clearly Telekom"
          description="The values show up in the interaction, not in long explanations."
          tintClassName={modePanelClasses[mode]}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {values.map((item) => (
              <Card key={item.title} className="border-white/10 bg-black/30">
                <CardContent className="space-y-4 p-5">
                  <Badge>{item.title}</Badge>
                  <p className="font-display text-2xl text-white">{item.title}</p>
                  <p className="text-sm leading-7 text-white/64">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper
          id="vision"
          eyebrow="T-Systems Vision"
          title="A concise vision: bring AI into real journeys, on top of governed data foundations"
          description="T-Systems appears here as the partner that designs, governs, and scales AI for enterprise reality."
          tintClassName={modePanelClasses[mode]}
          aside={
            <Card className="border-white/10 bg-black/30">
              <CardContent className="space-y-4 p-5">
                <Badge>Vision in one line</Badge>
                <p className="font-display text-2xl text-white">
                  Trusted AI. Grounded data. Ready for scale.
                </p>
                <p className="text-sm leading-7 text-white/62">
                  The core message for the client conversation.
                </p>
              </CardContent>
            </Card>
          }
        >
          <div className="grid gap-4 md:grid-cols-3">
            {visionPillars.map((pillar) => (
              <Card key={pillar.title} className="border-white/10 bg-black/30">
                <CardContent className="space-y-4 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-magenta-200/75">
                    Vision pillar
                  </p>
                  <h3 className="font-display text-2xl text-white">{pillar.title}</h3>
                  <p className="text-sm leading-7 text-white/64">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper
          id="portfolio"
          eyebrow="AI & Data Portfolio"
          title="A focused portfolio story"
          description="Each area can open directly into the live demo."
          tintClassName={modePanelClasses[mode]}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {portfolioCards.map((card) => (
              <Card key={card.title} className="border-white/10 bg-black/30">
                <CardContent className="space-y-4 p-5">
                  <div className="space-y-2">
                    <Badge variant="muted">Portfolio area</Badge>
                    <h3 className="font-display text-2xl text-white">{card.title}</h3>
                  </div>
                  <p className="text-sm leading-7 text-white/64">{card.summary}</p>
                  <Button
                    variant="secondary"
                    onClick={() => activatePrompt(card.promptId)}
                  >
                    Open This In The Demo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper
          id="demo"
          eyebrow="Live AI Demo"
          title="One believable AI interaction"
          description="Short prompt in. Clear answer out. Sources and trust cues stay visible."
          tintClassName={modePanelClasses[mode]}
          aside={
            <Card className="border-white/10 bg-black/30">
              <CardContent className="space-y-4 p-5">
                <Badge>Presentation cue</Badge>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-magenta-100" />
                  <p className="font-display text-2xl text-white">Current scenario</p>
                </div>
                <p className="text-sm leading-7 text-white/62">
                  The tone adapts to the scenario, but the demo stays simple.
                </p>
              </CardContent>
            </Card>
          }
        >
          <LiveAnswerPanel promptId={promptId} onPromptChange={setPromptId} />
        </SectionWrapper>

        <section className="section-shell">
          <div className="section-grid" />
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80",
              modePanelClasses[mode],
            )}
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <Badge>Closing idea</Badge>
              <h2 className="font-display text-4xl text-white sm:text-5xl">
                Deliberately simple, so the discussion stays on judgment.
              </h2>
              <p className="text-lg leading-8 text-white/66">
                A Telekom-style experience, a T-Systems AI story, a credible portfolio, and one polished AI demo.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="accent" onClick={() => scrollToSection("demo")}>
                Replay Demo
              </Button>
              <Button variant="secondary" onClick={() => scrollToSection("values")}>
                Back To Values
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
