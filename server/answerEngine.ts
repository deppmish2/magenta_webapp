import type { IncomingMessage, ServerResponse } from "node:http";
import OpenAI from "openai";
import promptsData from "../src/data/prompts.json";
import responsesData from "../src/data/responses.json";
import sourcesData from "../src/data/sources.json";
import type {
  DemoMode,
  LiveAnswer,
  PromptRecord,
  ResponseRecord,
  SourceRecord,
} from "../src/types";

const prompts = promptsData as PromptRecord[];
const responses = responsesData as ResponseRecord[];
const sources = sourcesData as SourceRecord[];

const promptById = Object.fromEntries(prompts.map((prompt) => [prompt.id, prompt]));
const responseByPromptId = Object.fromEntries(
  responses.map((response) => [response.promptId, response]),
);
const sourceById = Object.fromEntries(sources.map((source) => [source.id, source]));

interface AnswerEngineConfig {
  apiKey: string;
  model: string;
}

interface AnswerRequest {
  query?: string;
  mode?: DemoMode;
}

interface StructuredAnswer {
  title?: string;
  summary?: string;
  answer?: string[];
  takeaways?: string[];
  followUps?: string[];
  citations?: string[];
  trustReason?: string;
}

function tokenize(text: string) {
  return text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

function findBestPrompt(query: string, preferredMode?: DemoMode) {
  const normalizedQuery = query.toLowerCase();
  const tokens = tokenize(query);

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
  return bestMatch?.score > 0
    ? bestMatch.prompt
    : prompts.find((prompt) => prompt.mode === preferredMode) ?? prompts[0];
}

function selectSources(query: string, fallback: ResponseRecord) {
  const tokens = tokenize(query);
  const ranked = sources
    .map((source) => {
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
    .sort((left, right) => right.score - left.score)
    .slice(0, 4)
    .map((entry) => entry.source);

  const orderedIds = [...fallback.sources, ...ranked.map((source) => source.id)];
  const uniqueIds = [...new Set(orderedIds)].slice(0, 4);

  return uniqueIds
    .map((sourceId) => sourceById[sourceId])
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

function extractStructuredAnswer(text: string): StructuredAnswer | null {
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    return JSON.parse(cleaned.slice(start, end + 1)) as StructuredAnswer;
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
  engine: "openai" | "fallback",
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
    providerLabel: "Perplexity-style answer experience",
    backendLabel,
    engine,
  };
}

async function generateAnswer(
  request: AnswerRequest,
  config: AnswerEngineConfig,
): Promise<LiveAnswer> {
  const apiKey = config.apiKey.trim().startsWith("replace-with")
    ? ""
    : config.apiKey.trim();
  const query = request.query?.trim() || promptById["roaming-business-eu"].text;
  const mode = request.mode;
  const matchedPrompt = findBestPrompt(query, mode);
  const fallback = responseByPromptId[matchedPrompt.id] ?? responses[0];
  const selectedSources = selectSources(query, fallback);

  if (!apiKey) {
    return createFallbackAnswer(
      query,
      mode,
      matchedPrompt,
      fallback,
      selectedSources,
      "Local scripted demo",
      "fallback",
    );
  }

  const client = new OpenAI({ apiKey });
  const sourceContext = selectedSources
    .map(
      (source) =>
        `[${source.id}] ${source.title}\nType: ${source.kind}\nDomain: ${source.domain}\nFreshness: ${source.freshness}\nSnippet: ${source.snippet}`,
    )
    .join("\n\n");

  const instructions = [
    "You are MagentaAI Experience, a concise enterprise answer engine for a local demo app.",
    "Behave like a Perplexity-style answer experience on the surface, but never claim Perplexity powers the backend.",
    "Use only the provided source context and matched prompt notes.",
    "Keep the answer straightforward, helpful, and executive-friendly.",
    "Return strict JSON only with keys: title, summary, answer, takeaways, followUps, citations, trustReason.",
    "answer must be an array of 2 or 3 short paragraphs.",
    "takeaways must be an array of exactly 3 short bullet-style sentences.",
    "followUps must be an array of exactly 3 useful follow-up questions.",
    "citations must be an array of source IDs taken only from the provided sources.",
  ].join(" ");

  const input = [
    `User question: ${query}`,
    `Requested mode: ${mode ?? matchedPrompt.mode}`,
    `Matched prompt: ${matchedPrompt.text}`,
    `Matched prompt preview: ${matchedPrompt.preview}`,
    `Reference answer summary: ${fallback.executiveSummary}`,
    `Reference answer details: ${fallback.detailedAnswer.join(" ")}`,
    `Reference trust reason: ${fallback.trustReason}`,
    `Available sources:\n${sourceContext}`,
  ].join("\n\n");

  try {
    const response = await client.responses.create({
      model: config.model,
      instructions,
      input,
    });

    const parsed = extractStructuredAnswer(response.output_text ?? "");
    if (!parsed) {
      return createFallbackAnswer(
        query,
        mode,
        matchedPrompt,
        fallback,
        selectedSources,
        `GPT mini fallback (${config.model})`,
        "fallback",
      );
    }

    const citedIds = cleanStringList(
      parsed.citations,
      4,
      selectedSources.map((source) => source.id),
    );
    const citedSources = citedIds
      .map((sourceId) => sourceById[sourceId])
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
      providerLabel: "Perplexity-style answer experience",
      backendLabel: `GPT mini backend (${config.model})`,
      engine: "openai",
    };
  } catch (error) {
    console.error("[magenta-answer-engine]", error);

    return createFallbackAnswer(
      query,
      mode,
      matchedPrompt,
      fallback,
      selectedSources,
      "Local fallback after API error",
      "fallback",
    );
  }
}

async function readRequestBody(req: IncomingMessage) {
  let body = "";

  for await (const chunk of req) {
    body += chunk;
  }

  if (!body) {
    return {};
  }

  try {
    return JSON.parse(body) as AnswerRequest;
  } catch {
    return {};
  }
}

function sendJson(res: ServerResponse, statusCode: number, payload: unknown) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

export function createAnswerHandler(config: AnswerEngineConfig) {
  return async (
    req: IncomingMessage,
    res: ServerResponse,
    next: (err?: unknown) => void,
  ) => {
    if (req.method !== "POST") {
      sendJson(res, 405, { error: "Method not allowed" });
      return;
    }

    try {
      const body = await readRequestBody(req);
      const answer = await generateAnswer(body, config);
      sendJson(res, 200, answer);
    } catch (error) {
      next(error);
    }
  };
}
