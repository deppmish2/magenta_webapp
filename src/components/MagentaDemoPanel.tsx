import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AudioLines,
  LoaderCircle,
  Mic,
  SendHorizontal,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import promptsData from "../data/prompts.json";
import responsesData from "../data/responses.json";
import sourcesData from "../data/sources.json";
import type {
  DemoMode,
  LiveAnswer,
  PromptRecord,
  ResponseRecord,
  SourceRecord,
} from "../types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";

const prompts = promptsData as PromptRecord[];
const responses = responsesData as ResponseRecord[];
const sources = sourcesData as SourceRecord[];

const promptById = Object.fromEntries(prompts.map((prompt) => [prompt.id, prompt]));
const responseByPromptId = Object.fromEntries(
  responses.map((response) => [response.promptId, response]),
);
const sourceById = Object.fromEntries(sources.map((source) => [source.id, source]));

const modeLabels: Record<DemoMode, string> = {
  consumer: "Consumer",
  enterprise: "Enterprise",
  architect: "Architect",
};

const initialPrompt = promptById["roaming-business-eu"];

interface MagentaDemoPanelProps {
  externalPromptId?: string;
}

function findBestPrompt(query: string, preferredMode?: DemoMode) {
  const normalizedQuery = query.toLowerCase();
  const tokens = normalizedQuery.match(/[a-z0-9]+/g) ?? [];

  const ranked = prompts.map((prompt) => {
    let score = 0;

    if (preferredMode && prompt.mode === preferredMode) {
      score += 3;
    }

    if (normalizedQuery.includes(prompt.text.toLowerCase())) {
      score += 10;
    }

    for (const token of tokens) {
      if (prompt.keywords.some((keyword) => keyword.includes(token))) {
        score += 4;
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
    return prompts.find((prompt) => prompt.mode === preferredMode) ?? initialPrompt;
  }

  return bestMatch.prompt;
}

function buildLocalAnswer(promptId: string, mode: DemoMode): LiveAnswer {
  const prompt = promptById[promptId] ?? initialPrompt;
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
    mode,
    providerLabel: "Perplexity-style answer experience",
    backendLabel: "Local scripted demo",
    engine: "fallback",
  };
}

export function MagentaDemoPanel({
  externalPromptId = initialPrompt.id,
}: MagentaDemoPanelProps) {
  const [mode, setMode] = useState<DemoMode>(
    promptById[externalPromptId]?.mode ?? initialPrompt.mode,
  );
  const [activePromptId, setActivePromptId] = useState<string>(externalPromptId);
  const [inputValue, setInputValue] = useState<string>(
    promptById[externalPromptId]?.text ?? initialPrompt.text,
  );
  const [answer, setAnswer] = useState<LiveAnswer>(
    buildLocalAnswer(externalPromptId, promptById[externalPromptId]?.mode ?? initialPrompt.mode),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string>("");
  const previousExternalPromptRef = useRef<string>(externalPromptId);

  const modePrompts = prompts.filter((prompt) => prompt.mode === mode);

  useEffect(() => {
    if (previousExternalPromptRef.current === externalPromptId) {
      return;
    }

    previousExternalPromptRef.current = externalPromptId;
    const nextPrompt = promptById[externalPromptId];

    if (!nextPrompt) {
      return;
    }

    setMode(nextPrompt.mode);
    setActivePromptId(nextPrompt.id);
    setInputValue(nextPrompt.text);
    void requestAnswer(nextPrompt.text, nextPrompt.mode, nextPrompt.id);
  }, [externalPromptId]);

  async function requestAnswer(
    query: string,
    requestedMode: DemoMode = mode,
    promptIdHint?: string,
  ) {
    const optimisticPrompt = promptIdHint
      ? promptById[promptIdHint]
      : findBestPrompt(query, requestedMode);

    setIsLoading(true);
    setError("");
    setMode(requestedMode);
    setActivePromptId(optimisticPrompt.id);

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
      setMode(payload.mode);
      setActivePromptId(payload.matchedPromptId);
    } catch (requestError) {
      console.error(requestError);
      setAnswer(buildLocalAnswer(optimisticPrompt.id, requestedMode));
      setError("Live model unavailable. Showing the local demo answer instead.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const query = inputValue.trim();

    if (!query) {
      return;
    }

    await requestAnswer(query, mode);
  }

  async function handleModeChange(nextMode: DemoMode) {
    const nextPrompt = prompts.find((prompt) => prompt.mode === nextMode) ?? initialPrompt;
    setMode(nextMode);
    setInputValue(nextPrompt.text);
    await requestAnswer(nextPrompt.text, nextMode, nextPrompt.id);
  }

  function handlePromptClick(prompt: PromptRecord) {
    setInputValue(prompt.text);
    void requestAnswer(prompt.text, prompt.mode, prompt.id);
  }

  function handleVoiceClick() {
    const speechWindow = window as Window & {
      webkitSpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        onstart: (() => void) | null;
        onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
        onerror: (() => void) | null;
        onend: (() => void) | null;
        start: () => void;
      };
      SpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        onstart: (() => void) | null;
        onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
        onerror: (() => void) | null;
        onend: (() => void) | null;
        start: () => void;
      };
    };

    const Recognition =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setError("Voice input is not available in this browser. Type the question instead.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setError("");
      setIsListening(true);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (!transcript) {
        return;
      }

      setInputValue(transcript);
      void requestAnswer(transcript, mode);
    };
    recognition.onerror = () => {
      setError("Voice input could not start. Please try again or use text.");
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.start();
  }

  return (
    <Card className="overflow-hidden border-magenta-400/20 bg-gradient-to-br from-magenta-500/10 via-black/25 to-white/[0.03]">
      <CardContent className="space-y-6 p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge>{answer.providerLabel}</Badge>
              <Badge variant={answer.engine === "openai" ? "success" : "muted"}>
                {answer.backendLabel}
              </Badge>
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-3xl text-white">
                Ask once, get a direct answer
              </h3>
              <p className="max-w-3xl text-base leading-7 text-white/68">
                The demo is now intentionally simple: pick a mode, choose a prompt
                or type your own, and the answer appears with sources, trust
                rationale, and an enterprise trace right underneath.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["consumer", "enterprise", "architect"] as DemoMode[]).map((modeOption) => (
              <Button
                key={modeOption}
                variant={mode === modeOption ? "default" : "secondary"}
                size="sm"
                onClick={() => void handleModeChange(modeOption)}
              >
                {modeLabels[modeOption]}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {modePrompts.map((prompt) => (
            <button
              key={prompt.id}
              type="button"
              onClick={() => handlePromptClick(prompt)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                activePromptId === prompt.id
                  ? "border-magenta-400/40 bg-magenta-500/15 text-white"
                  : "border-white/10 bg-white/[0.03] text-white/68 hover:border-white/20 hover:text-white"
              }`}
            >
              {prompt.text}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-white/10 bg-black/20 p-4"
        >
          <div className="flex flex-col gap-3 lg:flex-row">
            <Input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Ask about roaming, AI sovereignty, rollout controls, or enterprise architecture"
              className="flex-1"
            />
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleVoiceClick}
                className="min-w-[126px]"
              >
                {isListening ? (
                  <AudioLines className="mr-2 h-4 w-4" />
                ) : (
                  <Mic className="mr-2 h-4 w-4" />
                )}
                {isListening ? "Listening" : "Voice"}
              </Button>
              <Button type="submit" variant="accent" disabled={isLoading}>
                {isLoading ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <SendHorizontal className="mr-2 h-4 w-4" />
                )}
                Ask
              </Button>
            </div>
          </div>
        </form>

        {error ? (
          <div className="rounded-[22px] border border-amber-300/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
            {error}
          </div>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_360px]">
          <div className="space-y-5">
            <div className="rounded-[28px] border border-white/10 bg-black/25 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-magenta-200/75">
                    {modeLabels[mode]} answer
                  </p>
                  <h4 className="font-display text-2xl text-white">{answer.title}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {answer.trustBadges.map((badge) => (
                    <Badge key={badge} variant="success">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${answer.title}-${isLoading ? "loading" : "ready"}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="mt-6"
                >
                  {isLoading ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-white/70">
                        <LoaderCircle className="h-5 w-5 animate-spin text-magenta-200" />
                        <span>Composing a grounded answer with GPT mini...</span>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 w-4/5 rounded-full bg-white/10" />
                        <div className="h-4 w-full rounded-full bg-white/10" />
                        <div className="h-4 w-3/4 rounded-full bg-white/10" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <p className="text-lg leading-8 text-white/88">{answer.summary}</p>
                      <div className="space-y-4">
                        {answer.answer.map((paragraph) => (
                          <p
                            key={paragraph}
                            className="text-sm leading-7 text-white/68 sm:text-base"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {answer.takeaways.map((takeaway) => (
                          <div
                            key={takeaway}
                            className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4"
                          >
                            <p className="text-sm leading-6 text-white/74">{takeaway}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-xl text-white">Suggested next questions</p>
                <Badge variant="muted">{answer.confidence}</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {answer.followUps.map((followUp) => (
                  <button
                    key={followUp}
                    type="button"
                    onClick={() => {
                      setInputValue(followUp);
                      void requestAnswer(followUp, mode);
                    }}
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/72 transition-colors hover:border-magenta-400/30 hover:text-white"
                  >
                    {followUp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-magenta-100" />
                <p className="font-display text-xl text-white">Sources</p>
              </div>
              <div className="mt-4 space-y-3">
                {answer.sources.map((source) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-[22px] border border-white/10 bg-black/20 p-4 transition-colors hover:border-magenta-400/30"
                  >
                    <p className="font-medium text-white">{source.title}</p>
                    <p className="mt-1 text-sm text-white/48">
                      {source.kind} / {source.domain}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-white/62">
                      {source.snippet}
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-[0.24em] text-white/35">
                      {source.freshness}
                    </p>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-magenta-100" />
                <p className="font-display text-xl text-white">Why this is trustworthy</p>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/67">{answer.trustReason}</p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <p className="font-display text-xl text-white">Enterprise trace</p>
              <div className="mt-4 space-y-3">
                {answer.trace.slice(0, 3).map((step) => (
                  <div
                    key={step.step}
                    className="rounded-[20px] border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-white">{step.step}</p>
                      <Badge variant="muted">{step.component}</Badge>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white/62">
                      {step.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
