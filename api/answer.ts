import { readFileSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import type {
  DemoMode,
  LiveAnswer,
  PromptRecord,
  ResponseRecord,
  SourceRecord,
} from "../src/types";

interface LoadedData {
  prompts: PromptRecord[];
  responses: ResponseRecord[];
  sources: SourceRecord[];
  promptById: Record<string, PromptRecord>;
  responseByPromptId: Record<string, ResponseRecord>;
  sourceById: Record<string, SourceRecord>;
}

interface AnswerRequestBody {
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

interface ResponseShape {
  status: number;
  payload: unknown;
  headers?: Record<string, string>;
}

let cachedData: LoadedData | null = null;

function cleanEnvValue(value: string | undefined) {
  return (value ?? "").trim().replace(/^["']|["']$/g, "");
}

function firstUsableEnv(...values: Array<string | undefined>) {
  return (
    values
      .map((value) => cleanEnvValue(value))
      .find((value) => value && !value.startsWith("replace-with")) ?? ""
  );
}

function getConfig() {
  return {
    apiKey: firstUsableEnv(process.env.OPENAI_API_KEY, process.env.OPEN_API_KEY),
    model: firstUsableEnv(process.env.OPENAI_MODEL) || "gpt-4o-mini",
  };
}

function readJsonFile<T>(relativePath: string): T {
  const absolutePath = path.join(process.cwd(), relativePath);
  return JSON.parse(readFileSync(absolutePath, "utf8")) as T;
}

function loadData(): LoadedData {
  if (cachedData) {
    return cachedData;
  }

  const prompts = readJsonFile<PromptRecord[]>("src/data/prompts.json");
  const responses = readJsonFile<ResponseRecord[]>("src/data/responses.json");
  const sources = readJsonFile<SourceRecord[]>("src/data/sources.json");

  cachedData = {
    prompts,
    responses,
    sources,
    promptById: Object.fromEntries(
      prompts.map((prompt) => [prompt.id, prompt]),
    ) as Record<string, PromptRecord>,
    responseByPromptId: Object.fromEntries(
      responses.map((response) => [response.promptId, response]),
    ) as Record<string, ResponseRecord>,
    sourceById: Object.fromEntries(
      sources.map((source) => [source.id, source]),
    ) as Record<string, SourceRecord>,
  };

  return cachedData;
}

function tokenize(text: string) {
  return text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

function findBestPrompt(
  query: string,
  preferredMode: DemoMode | undefined,
  prompts: PromptRecord[],
) {
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

function selectSources(
  query: string,
  fallback: ResponseRecord,
  sources: SourceRecord[],
  sourceById: Record<string, SourceRecord>,
) {
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

function extractStructuredAnswer(text: string) {
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

async function buildGetResponse(): Promise<ResponseShape> {
  const config = getConfig();

  return {
    status: 200,
    payload: {
      ok: true,
      route: "/api/answer",
      keySet: Boolean(config.apiKey),
      model: config.model || null,
    },
  };
}

async function buildPostResponse(body: AnswerRequestBody): Promise<ResponseShape> {
  const config = getConfig();

  try {
    const data = loadData();
    const query = body.query?.trim() || data.promptById["roaming-business-eu"].text;
    const mode = body.mode;
    const matchedPrompt = findBestPrompt(query, mode, data.prompts);
    const fallback =
      data.responseByPromptId[matchedPrompt.id] ?? data.responses[0];
    const selectedSources = selectSources(
      query,
      fallback,
      data.sources,
      data.sourceById,
    );

    if (!config.apiKey) {
      return {
        status: 200,
        payload: createFallbackAnswer(
          mode,
          matchedPrompt,
          fallback,
          selectedSources,
          "No OpenAI key available on Vercel",
        ),
        headers: {
          "X-Magenta-Engine": "fallback",
          "X-Magenta-Key-Set": "no",
          "X-Magenta-Model": config.model || "unset",
        },
      };
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

    const openAiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
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
                `Question: ${query}\n` +
                `Mode: ${mode ?? matchedPrompt.mode}\n` +
                `Matched prompt: ${matchedPrompt.text}\n` +
                `Sources:\n${sourceContext}`,
            },
          ],
        }),
      },
    );

    const openAiPayload = (await openAiResponse.json().catch(() => ({}))) as {
      error?: { message?: string };
      choices?: Array<{ message?: { content?: string } }>;
    };

    if (!openAiResponse.ok) {
      throw new Error(
        openAiPayload?.error?.message ||
          `OpenAI request failed with ${openAiResponse.status}`,
      );
    }

    const parsed = extractStructuredAnswer(
      openAiPayload?.choices?.[0]?.message?.content ?? "",
    );

    if (!parsed) {
      return {
        status: 200,
        payload: createFallbackAnswer(
          mode,
          matchedPrompt,
          fallback,
          selectedSources,
          `OpenAI response could not be parsed (${config.model})`,
        ),
        headers: {
          "X-Magenta-Engine": "fallback",
          "X-Magenta-Key-Set": "yes",
          "X-Magenta-Model": config.model || "unset",
        },
      };
    }

    const citedIds = cleanStringList(
      parsed.citations,
      4,
      selectedSources.map((source) => source.id),
    );
    const citedSources = citedIds
      .map((sourceId) => data.sourceById[sourceId])
      .filter(Boolean) as SourceRecord[];

    const answer: LiveAnswer = {
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

    return {
      status: 200,
      payload: answer,
      headers: {
        "X-Magenta-Engine": "openai",
        "X-Magenta-Key-Set": "yes",
        "X-Magenta-Model": config.model || "unset",
      },
    };
  } catch (error) {
    console.error("[magenta] error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return {
      status: 500,
      payload: {
        error: "Internal server error",
        detail: message,
        keySet: Boolean(config.apiKey),
        model: config.model || null,
      },
    };
  }
}

function sendJson(
  response: ServerResponse,
  status: number,
  payload: unknown,
  headers: Record<string, string> = {},
) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  for (const [name, value] of Object.entries(headers)) {
    response.setHeader(name, value);
  }

  response.end(JSON.stringify(payload));
}

async function readRequestBody(request: IncomingMessage & { body?: unknown }) {
  if (request.body && typeof request.body === "object") {
    return request.body as AnswerRequestBody;
  }

  if (typeof request.body === "string") {
    try {
      return JSON.parse(request.body) as AnswerRequestBody;
    } catch {
      return {};
    }
  }

  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {};
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as AnswerRequestBody;
  } catch {
    return {};
  }
}

export default async function handler(
  request: IncomingMessage & { body?: unknown; method?: string },
  response: ServerResponse,
) {
  if (request.method === "OPTIONS") {
    response.statusCode = 204;
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.end();
    return;
  }

  if (request.method === "GET") {
    const result = await buildGetResponse();
    sendJson(response, result.status, result.payload, result.headers);
    return;
  }

  if (request.method === "POST") {
    const body = await readRequestBody(request);
    const result = await buildPostResponse(body);
    sendJson(response, result.status, result.payload, result.headers);
    return;
  }

  sendJson(response, 405, { error: "Method not allowed" });
}
