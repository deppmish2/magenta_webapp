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

export interface AnswerEngineConfig {
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
    providerLabel: "T-Systems AI advisory experience",
    backendLabel,
    engine,
  };
}

export async function generateAnswer(
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

  const systemPrompt =
    "You are MagentAI Experience, a concise T-Systems advisory assistant. " +
    "Write as T-Systems presenting to a client. Use 'we recommend' and 'T-Systems would approach this by'. " +
    "Reply with strict JSON only — no markdown, no prose outside JSON. " +
    "Keys: title (string), summary (string, 1 sentence), answer (array of 2 short paragraphs), " +
    "takeaways (array of 3 bullet sentences), followUps (array of 3 questions), " +
    "citations (array of source IDs from provided sources), trustReason (string).";

  const userMessage =
    `Question: ${query}\n` +
    `Mode: ${mode ?? matchedPrompt.mode}\n` +
    `Sources:\n${sourceContext}`;

  try {
    const response = await client.chat.completions.create({
      model: config.model,
      temperature: 0.3,
      max_tokens: 800,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    const parsed = extractStructuredAnswer(response.choices[0]?.message?.content ?? "");
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
      providerLabel: "T-Systems AI advisory experience",
      backendLabel: `OpenAI live model (${config.model})`,
      engine: "openai",
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[magenta-answer-engine]", msg);

    return createFallbackAnswer(
      query,
      mode,
      matchedPrompt,
      fallback,
      selectedSources,
      `API error: ${msg.slice(0, 120)}`,
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
