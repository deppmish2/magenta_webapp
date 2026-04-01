import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AudioLines,
  Mic,
  Route,
  Search,
  SendHorizontal,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import {
  buildArchitectureTrace,
  buildLocalAnswer,
  featuredDemoPromptIds,
  findBestPrompt,
  getDefaultPromptForMode,
  modePanelClasses,
  modeThemes,
  promptById,
  responseByPromptId,
} from "../data/demoContent";
import { cn } from "../lib/utils";
import type { LiveAnswer } from "../types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface LiveAnswerPanelProps {
  promptId: string;
  onPromptChange: (promptId: string) => void;
}

const traceIcons = {
  retrieval: Search,
  "policy-checks": ShieldCheck,
  orchestration: Workflow,
  "model-gateway": Route,
  monitoring: Activity,
} as const;

export function LiveAnswerPanel({
  promptId,
  onPromptChange,
}: LiveAnswerPanelProps) {
  const [answer, setAnswer] = useState<LiveAnswer>(buildLocalAnswer(promptId));
  const [inputValue, setInputValue] = useState(
    promptById[promptId]?.text ?? getDefaultPromptForMode("enterprise").text,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [typedSummary, setTypedSummary] = useState("");
  const [showTrace, setShowTrace] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const voiceTimerRef = useRef<number | null>(null);

  const displayPrompt =
    promptById[answer.matchedPromptId] ??
    promptById[promptId] ??
    getDefaultPromptForMode("enterprise");
  const mode = answer.mode;
  const displayResponse =
    responseByPromptId[answer.matchedPromptId] ??
    responseByPromptId[getDefaultPromptForMode(mode).id];
  const theme = modeThemes[mode];
  const answerSources = answer.sources;
  const architectureTrace = buildArchitectureTrace(displayResponse, mode);
  const featuredPrompts = featuredDemoPromptIds
    .map((id) => promptById[id])
    .filter(Boolean);

  useEffect(() => {
    setInputValue(promptById[promptId]?.text ?? "");

    if (promptId === answer.matchedPromptId) {
      return;
    }

    const nextPrompt = promptById[promptId];
    if (!nextPrompt) {
      return;
    }

    void requestAnswer(nextPrompt.text, nextPrompt.mode, nextPrompt.id, false);
  }, [answer.matchedPromptId, promptId]);

  useEffect(() => {
    if (isLoading) {
      setTypedSummary("");
      return;
    }

    const summary = answer.summary;
    let index = 0;
    setTypedSummary("");

    const interval = window.setInterval(() => {
      index += 3;
      setTypedSummary(summary.slice(0, index));

      if (index >= summary.length) {
        window.clearInterval(interval);
      }
    }, 16);

    return () => window.clearInterval(interval);
  }, [answer.summary, isLoading]);

  useEffect(() => {
    return () => {
      if (voiceTimerRef.current) {
        window.clearTimeout(voiceTimerRef.current);
      }
    };
  }, []);

  async function requestAnswer(
    query: string,
    requestedMode = mode,
    promptIdHint?: string,
    syncInput = true,
  ) {
    if (syncInput) {
      setInputValue(query);
    }

    setIsLoading(true);
    setShowTrace(false);
    setStatusMessage("");

    const optimisticPrompt = promptIdHint
      ? promptById[promptIdHint]
      : findBestPrompt(query, requestedMode);
    const fallbackAnswer = buildLocalAnswer(
      optimisticPrompt?.id ?? getDefaultPromptForMode(requestedMode).id,
      requestedMode,
    );

    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          mode: requestedMode,
        }),
      });

      if (!response.ok) {
        throw new Error(`Answer request failed with ${response.status}`);
      }

      const payload = (await response.json()) as LiveAnswer;
      setAnswer(payload);

      if (payload.matchedPromptId !== promptId) {
        onPromptChange(payload.matchedPromptId);
      }

      setStatusMessage(
        payload.engine === "openai"
          ? "Live response generated with OpenAI."
          : "OpenAI unavailable. Showing the scripted fallback.",
      );
    } catch (error) {
      console.error(error);
      setAnswer(fallbackAnswer);

      if (fallbackAnswer.matchedPromptId !== promptId) {
        onPromptChange(fallbackAnswer.matchedPromptId);
      }

      setStatusMessage("Live request unavailable. Showing the scripted fallback.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const query = inputValue.trim();

    if (!query) {
      return;
    }

    void requestAnswer(query, mode);
  }

  function handleVoiceDemo() {
    if (isVoiceMode) {
      return;
    }

    setShowTrace(false);
    setIsVoiceMode(true);

    const query = inputValue.trim() || displayPrompt.text;

    voiceTimerRef.current = window.setTimeout(() => {
      const bestPrompt = findBestPrompt(query, mode);
      setInputValue(bestPrompt.text);
      setIsVoiceMode(false);
      void requestAnswer(bestPrompt.text, bestPrompt.mode, bestPrompt.id, false);
    }, 1600);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
      <Card className="overflow-hidden border-white/10 bg-black/30">
        <CardContent className="space-y-6 p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge>Step 1</Badge>
            <p className="text-sm text-white/50">{theme.label} lens active</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-3xl text-white">Choose a scenario</h3>
            <p className="text-sm text-white/55">Client-facing demo prompts</p>
          </div>

          <div className="grid gap-3">
            {featuredPrompts.map((prompt) => {
              const active = prompt.id === promptId;

              return (
                <button
                  key={prompt.id}
                  type="button"
                  onClick={() => {
                    setInputValue(prompt.text);
                    onPromptChange(prompt.id);
                  }}
                  className={cn(
                    "rounded-[24px] border p-4 text-left transition-all duration-300",
                    active
                      ? "border-white/25 bg-white/[0.1]"
                      : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]",
                  )}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-magenta-200/75">
                    {prompt.category}
                  </p>
                  <p className="mt-2 text-base text-white">{prompt.text}</p>
                </button>
              );
            })}
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold uppercase tracking-[0.3em] text-white/45">
              Ask in your own words
            </label>
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-3">
              <textarea
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                rows={4}
                className="w-full resize-none bg-transparent text-base leading-7 text-white outline-none placeholder:text-white/28"
                placeholder="Ask a client question"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                <div className="flex items-center gap-3 text-sm text-white/50">
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-magenta-400/30 bg-magenta-500/12">
                      {isVoiceMode ? (
                        <>
                          <span className="absolute h-full w-full animate-pulse-ring rounded-full border border-magenta-300/60" />
                          <AudioLines className="h-4 w-4 text-magenta-100" />
                        </>
                      ) : (
                        <Mic className="h-4 w-4 text-magenta-100" />
                      )}
                    </div>
                    <div>
                      <p className="text-white/70">Voice</p>
                      <p className="text-xs text-white/45">
                        {isVoiceMode ? "Listening..." : "Optional demo cue"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleVoiceDemo}
                    disabled={isVoiceMode}
                  >
                    Voice
                  </Button>
                  <Button type="submit" variant="accent" disabled={isLoading || isVoiceMode}>
                    Generate
                    <SendHorizontal className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </form>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/45">
                Model
              </p>
              <Badge variant={answer.engine === "openai" ? "success" : "muted"}>
                {answer.engine === "openai" ? "OpenAI live" : "Fallback"}
              </Badge>
            </div>
            <p className="mt-3 text-sm text-white/62">
              {statusMessage ||
                "Questions use the OpenAI-backed route when configured, with a scripted fallback for demo reliability."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-white/10 bg-black/30">
        <CardContent className="space-y-6 p-6 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <Badge>{theme.heroBadge}</Badge>
              <div className="space-y-2">
                <h3 className="font-display text-3xl text-white">
                  {answer.title}
                </h3>
                <p className="text-sm leading-6 text-white/55">
                  Scenario: {displayPrompt.text}
                </p>
              </div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                Confidence
              </p>
              <p className="mt-2 font-display text-2xl text-white">
                {answer.confidence}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${answer.matchedPromptId}-${answer.engine}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-6"
            >
              <div
                className={cn(
                  "rounded-[28px] border bg-gradient-to-br p-6",
                  modePanelClasses[mode],
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/55">
                    Executive summary
                  </p>
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-sm text-white/55">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-magenta-300" />
                      Generating response
                    </div>
                  ) : null}
                </div>
                <p className="mt-4 text-lg leading-8 text-white/84 sm:text-[1.08rem]">
                  {typedSummary}
                  {isLoading ? "..." : null}
                </p>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.04fr_0.96fr]">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                      Core answer
                    </p>
                    <div className="mt-4 space-y-4">
                    {answer.answer.map((paragraph) => (
                      <p key={paragraph} className="text-base leading-8 text-white/72">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <div className="mt-6 rounded-[22px] border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-magenta-200/75">
                      Recommendation
                    </p>
                    <div className="mt-3 space-y-3">
                      {answer.takeaways.map((takeaway) => (
                        <p key={takeaway} className="text-sm leading-7 text-white/68">
                          {takeaway}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
                        Trust cues
                      </p>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setShowTrace((current) => !current)}
                      >
                        {showTrace ? "Hide architectural trace" : "Show architectural trace"}
                      </Button>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-white/62">{answer.trustReason}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {answer.trustBadges.map((badge) => (
                        <Badge key={badge}>{badge}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
                        Source citations
                      </p>
                      <p className="text-sm text-white/45">
                        {answerSources.length} sources
                      </p>
                    </div>
                    <div className="mt-4 space-y-3">
                      {answerSources.map((source) => (
                        <a
                          key={source.id}
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block rounded-[22px] border border-white/10 bg-black/20 p-4 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-white">{source.title}</p>
                              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/40">
                                {source.kind}
                              </p>
                            </div>
                            <Badge variant="muted">{source.freshness}</Badge>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-white/60">
                            {source.snippet}
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
                      Next questions
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {answer.followUps.map((followUp) => (
                        <button
                          key={followUp}
                          type="button"
                          onClick={() => {
                            setInputValue(followUp);
                            void requestAnswer(followUp, mode);
                          }}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/20 hover:text-white"
                        >
                          {followUp}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {showTrace ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  {architectureTrace.map((stage) => {
                    const Icon =
                      traceIcons[stage.id as keyof typeof traceIcons] ?? Workflow;

                    return (
                      <div
                        key={stage.id}
                        className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5">
                            <Icon className="h-4 w-4 text-magenta-100" />
                          </div>
                          <p className="text-xs uppercase tracking-[0.24em] text-white/40">
                            {stage.signal}
                          </p>
                        </div>
                        <h4 className="mt-4 font-display text-lg text-white">
                          {stage.label}
                        </h4>
                        <p className="mt-3 text-sm leading-6 text-white/62">
                          {stage.detail}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
