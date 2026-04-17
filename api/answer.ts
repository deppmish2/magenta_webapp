import { createRequire } from "node:module";
import type {
  DemoMode,
  LiveAnswer,
  PromptRecord,
  ResponseRecord,
  SourceRecord,
} from "../src/types";

const require = createRequire(import.meta.url);
const prompts = require("../src/data/prompts.json") as PromptRecord[];
const responses = require("../src/data/responses.json") as ResponseRecord[];
const sources = require("../src/data/sources.json") as SourceRecord[];

const promptById = Object.fromEntries(
  prompts.map((prompt: PromptRecord) => [prompt.id, prompt]),
) as Record<string, PromptRecord>;
const responseByPromptId = Object.fromEntries(
  responses.map((response: ResponseRecord) => [response.promptId, response]),
) as Record<string, ResponseRecord>;
const sourceById = Object.fromEntries(
  sources.map((source: SourceRecord) => [source.id, source]),
) as Record<string, SourceRecord>;

function cleanEnvValue(value: string | undefined) {
  return (value ?? "").trim().replace(/^["']|["']$/g, "");
}

function firstUsableEnv(...values: Array<string | undefined>) {
  return values
    .map((value) => cleanEnvValue(value))
    .find((value) => value && !value.startsWith("replace-with")) ?? "";
}

function getConfig() {
  return {
    apiKey: firstUsableEnv(process.env.OPENAI_API_KEY, process.env.OPEN_API_KEY),
    model: firstUsableEnv(process.env.OPENAI_MODEL) || "gpt-4o-mini",
  };
}

function tokenize(text: string) {
  return text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

function findBestPrompt(query: string, preferredMode?: DemoMode) {
  const normalizedQuery = query.toLowerCase();
  const tokens = tokenize(query);

  const ranked = prompts.map((prompt: PromptRecord) => {
    let score = 0;

    if (preferredMode && prompt.mode === preferredMode) {
      score += 3;
    }

    if (normalizedQuery.includes(prompt.text.toLowerCase())) {
      score += 10;
    }

    for (const token of tokens) {
      if (prompt.keywords.some((keyword: string) => keyword.includes(token))) {
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

  const bestMatch = ranked.sort(
    (left: { score: number }, right: { score: number }) => right.score - left.score,
  )[0];
  return bestMatch?.score > 0
    ? bestMatch.prompt
    : prompts.find((prompt: PromptRecord) => prompt.mode === preferredMode) ?? prompts[0];
}

function selectSources(query: string, fallback: ResponseRecord) {
  const tokens = tokenize(query);
  const ranked = sources
    .map((source: SourceRecord) => {
      let score = fallback.sources.includes(source.id) ? 8 : 0;

      for (const token of tokens) {
        if (
          source.title.toLowerCase().includes(token) ||
          source.domain.toLowerCase().includes(token)
        ) {
          score += 4;
        }

        if (
          source.snippet.toLowerCase().includes(token) ||
          source.kind.toLowerCase().includes(token)
        ) {
          score += 2;
        }
      }

      return { source, score };
    })
    .sort(
      (left: { score: number }, right: { score: number }) => right.score - left.score,
    )
    .slice(0, 4)
    .map((entry: { source: SourceRecord }) => entry.source);

  const orderedIds = [...fallback.sources, ...ranked.map((source) => source.id)];
  const uniqueIds = [...new Set(orderedIds)].slice(0, 4);

  return uniqueIds
    .map((sourceId: string) => sourceById[sourceId])
    .filter(Boolean) as SourceRecord[];
}

function cleanStringList(value: unknown, limit: number, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback.slice(0, limit);
  }

  const cleaned = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
    .slice(0, limit);

  return cleaned.length > 0 ? cleaned : fallback.slice(0, limit);
}

function extractStructuredAnswer(text: string) {
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}

function createFallbackAnswer(
  query: string,
  mode: DemoMode | undefined,
  matchedPrompt: PromptRecord,
  fallback: ResponseRecord,
  selectedSources: SourceRecord[],
  backendLabel: string,
): LiveAnswer {
  return {
    title: fallback.title,
    summary: fallback.executiveSummary,
    answer: fallback.detailedAnswer,
    takeaways: fallback.takeaways,
    followUps: fallback.followUps,
    sources: selectedSources,
    trustBadges: fallback.trustBadges,
    confidence: fallback.confidence,
    trustReason: fallback.trustReason,
    trace: fallback.trace,
    matchedPromptId: matchedPrompt.id,
    mode: mode ?? matchedPrompt.mode,
    providerLabel: "T-Systems AI advisory experience",
    backendLabel,
    engine: "fallback",
  };
}

function json(payload: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      ...(init.headers ? Object.fromEntries(new Headers(init.headers).entries()) : {}),
    },
  });
}

async function generateAnswer(
  { query, mode }: { query?: string; mode?: DemoMode },
  config: { apiKey: string; model: string },
): Promise<LiveAnswer> {
  const safeQuery = query?.trim() || promptById["roaming-business-eu"].text;
  const matchedPrompt = findBestPrompt(safeQuery, mode);
  const fallback = responseByPromptId[matchedPrompt.id] ?? responses[0];
  const selectedSources = selectSources(safeQuery, fallback);

  if (!config.apiKey) {
    return createFallbackAnswer(
      safeQuery,
      mode,
      matchedPrompt,
      fallback,
      selectedSources,
      "No OpenAI key available on Vercel",
    );
  }

  const sourceContext = selectedSources
    .map(
      (source) =>
        `[${source.id}] ${source.title}\nType: ${source.kind}\nDomain: ${source.domain}\nFreshness: ${source.freshness}\nSnippet: ${source.snippet}`,
    )
    .join("\n\n");

  const systemPrompt =
    "You are MagentAI Experience, a concise T-Systems advisory assistant. " +
    "Write as T-Systems presenting to a client. Use 'we recommend' and 'T-Systems would approach this by'. " +
    "Reply with strict JSON only. " +
    "Keys: title, summary, answer, takeaways, followUps, citations, trustReason. " +
    "answer must be an array of 2 short paragraphs. " +
    "takeaways must be an array of 3 short sentences. " +
    "followUps must be an array of 3 short questions. " +
    "citations must contain only provided source IDs.";

  const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.3,
      max_tokens: 800,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content:
            `Question: ${safeQuery}\n` +
            `Mode: ${mode ?? matchedPrompt.mode}\n` +
            `Matched prompt: ${matchedPrompt.text}\n` +
            `Sources:\n${sourceContext}`,
        },
      ],
    }),
  });

  const openAiPayload = await openAiResponse.json().catch(() => ({}));

  if (!openAiResponse.ok) {
    const errorMessage =
      openAiPayload?.error?.message ||
      `OpenAI request failed with ${openAiResponse.status}`;

    throw new Error(errorMessage);
  }

  const parsed = extractStructuredAnswer(
    openAiPayload?.choices?.[0]?.message?.content ?? "",
  );

  if (!parsed) {
    return createFallbackAnswer(
      safeQuery,
      mode,
      matchedPrompt,
      fallback,
      selectedSources,
      `OpenAI response could not be parsed (${config.model})`,
    );
  }

  const citedIds = cleanStringList(
    parsed.citations,
    4,
    selectedSources.map((source) => source.id),
  );
  const citedSources = citedIds
    .map((sourceId: string) => sourceById[sourceId])
    .filter(Boolean) as SourceRecord[];

  return {
    title: parsed.title?.trim() || fallback.title,
    summary: parsed.summary?.trim() || fallback.executiveSummary,
    answer: cleanStringList(parsed.answer, 3, fallback.detailedAnswer),
    takeaways: cleanStringList(parsed.takeaways, 3, fallback.takeaways),
    followUps: cleanStringList(parsed.followUps, 3, fallback.followUps),
    sources: citedSources.length > 0 ? citedSources : selectedSources,
    trustBadges: fallback.trustBadges,
    confidence: fallback.confidence,
    trustReason: parsed.trustReason?.trim() || fallback.trustReason,
    trace: fallback.trace,
    matchedPromptId: matchedPrompt.id,
    mode: mode ?? matchedPrompt.mode,
    providerLabel: "T-Systems AI advisory experience",
    backendLabel: `OpenAI live model (${config.model})`,
    engine: "openai",
  };
}

export default {
  async fetch(request: Request) {
    const config = getConfig();

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Cache-Control": "no-store",
        },
      });
    }

    if (request.method === "GET") {
      return json({
        ok: true,
        route: "/api/answer",
        keySet: Boolean(config.apiKey),
        model: config.model || null,
      });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, { status: 405 });
    }

    try {
      const body = await request.json().catch(() => ({}));
      const answer = await generateAnswer(
        {
          query: body?.query ?? "",
          mode: body?.mode,
        },
        config,
      );

      return json(answer, {
        status: 200,
        headers: {
          "X-Magenta-Engine": answer.engine ?? "unknown",
          "X-Magenta-Key-Set": config.apiKey ? "yes" : "no",
          "X-Magenta-Model": config.model || "unset",
        },
      });
    } catch (error) {
      console.error("[magenta] error:", error);

      const message =
        error instanceof Error ? error.message : "Unknown server error";

      return json(
        {
          error: "Internal server error",
          detail: message,
          keySet: Boolean(config.apiKey),
          model: config.model || null,
        },
        { status: 500 },
      );
    }
  },
};
