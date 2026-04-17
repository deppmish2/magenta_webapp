import promptsRaw from "../src/data/prompts.json";
import responsesRaw from "../src/data/responses.json";
import sourcesRaw from "../src/data/sources.json";
import type { DemoMode, LiveAnswer, PromptRecord, ResponseRecord, SourceRecord } from "../src/types";

const prompts = promptsRaw as PromptRecord[];
const responses = responsesRaw as ResponseRecord[];
const sources = sourcesRaw as SourceRecord[];

const promptById = Object.fromEntries(prompts.map((p) => [p.id, p])) as Record<string, PromptRecord>;
const responseByPromptId = Object.fromEntries(responses.map((r) => [r.promptId, r])) as Record<string, ResponseRecord>;
const sourceById = Object.fromEntries(sources.map((s) => [s.id, s])) as Record<string, SourceRecord>;

function cleanEnvValue(v: string | undefined) {
  return (v ?? "").trim().replace(/^["']|["']$/g, "");
}

function getApiKey() {
  return cleanEnvValue(process.env.OPENAI_API_KEY) || cleanEnvValue(process.env.OPEN_API_KEY) || "";
}

function getModel() {
  return cleanEnvValue(process.env.OPENAI_MODEL) || "gpt-4o-mini";
}

function tokenize(text: string) {
  return text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

function findBestPrompt(query: string, mode?: DemoMode): PromptRecord {
  const q = query.toLowerCase();
  const tokens = tokenize(query);
  const ranked = prompts.map((p) => {
    let score = 0;
    if (mode && p.mode === mode) score += 3;
    if (q.includes(p.text.toLowerCase())) score += 10;
    for (const t of tokens) {
      if (p.keywords.some((k) => k.includes(t))) score += 4;
      if (p.text.toLowerCase().includes(t) || p.preview.toLowerCase().includes(t) || p.category.toLowerCase().includes(t)) score += 2;
    }
    return { p, score };
  });
  const best = ranked.sort((a, b) => b.score - a.score)[0];
  return best?.score > 0 ? best.p : (prompts.find((p) => p.mode === mode) ?? prompts[0]);
}

function selectSources(query: string, fallback: ResponseRecord): SourceRecord[] {
  const tokens = tokenize(query);
  const ranked = sources
    .map((s) => {
      let score = fallback.sources.includes(s.id) ? 8 : 0;
      for (const t of tokens) {
        if (s.title.toLowerCase().includes(t) || s.domain.toLowerCase().includes(t)) score += 4;
        if (s.snippet.toLowerCase().includes(t) || s.kind.toLowerCase().includes(t)) score += 2;
      }
      return { s, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((e) => e.s);
  const ids = [...new Set([...fallback.sources, ...ranked.map((s) => s.id)])].slice(0, 4);
  return ids.map((id) => sourceById[id]).filter(Boolean) as SourceRecord[];
}

function cleanList(value: unknown, limit: number, fb: string[]): string[] {
  if (!Array.isArray(value)) return fb.slice(0, limit);
  const cleaned = value.map((i) => (typeof i === "string" ? i.trim() : "")).filter(Boolean).slice(0, limit);
  return cleaned.length > 0 ? cleaned : fb.slice(0, limit);
}

function parseJson(text: string) {
  const c = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  const s = c.indexOf("{"), e = c.lastIndexOf("}");
  if (s === -1 || e <= s) return null;
  try { return JSON.parse(c.slice(s, e + 1)) as Record<string, unknown>; } catch { return null; }
}

function fallbackAnswer(
  mode: DemoMode | undefined,
  prompt: PromptRecord,
  fb: ResponseRecord,
  srcs: SourceRecord[],
  label: string,
): LiveAnswer {
  return {
    title: fb.title, summary: fb.executiveSummary, answer: fb.detailedAnswer,
    takeaways: fb.takeaways, followUps: fb.followUps, sources: srcs,
    trustBadges: fb.trustBadges, confidence: fb.confidence, trustReason: fb.trustReason,
    trace: fb.trace, matchedPromptId: prompt.id, mode: mode ?? prompt.mode,
    providerLabel: "T-Systems AI advisory experience", backendLabel: label, engine: "fallback",
  };
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = getApiKey();
  const model = getModel();

  let query = promptById["roaming-business-eu"].text;
  let mode: DemoMode | undefined;

  try {
    const body = await request.json() as { query?: string; mode?: DemoMode };
    if (body.query?.trim()) query = body.query.trim();
    mode = body.mode;
  } catch { /* use defaults */ }

  const prompt = findBestPrompt(query, mode);
  const fb = responseByPromptId[prompt.id] ?? responses[0];
  const srcs = selectSources(query, fb);

  if (!apiKey) {
    return new Response(
      JSON.stringify(fallbackAnswer(mode, prompt, fb, srcs, "No API key — set OPENAI_API_KEY in Vercel")),
      { status: 200, headers: { ...corsHeaders(), "Content-Type": "application/json", "X-Magenta-Key-Set": "no" } },
    );
  }

  try {
    const sourceContext = srcs
      .map((s) => `[${s.id}] ${s.title}\nType: ${s.kind}\nDomain: ${s.domain}\nFreshness: ${s.freshness}\nSnippet: ${s.snippet}`)
      .join("\n\n");

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model, temperature: 0.3, max_tokens: 800,
        messages: [
          {
            role: "system",
            content:
              "You are MagentAI Experience, a concise T-Systems advisory assistant. " +
              "Write as T-Systems presenting to a client. Use 'we recommend' and 'T-Systems would approach this by'. " +
              "Reply with strict JSON only — no markdown, no prose outside JSON. " +
              "Keys: title (string), summary (1 sentence string), answer (array of 2 short paragraphs), " +
              "takeaways (array of 3 bullet sentences), followUps (array of 3 questions), " +
              "citations (array of source IDs from provided sources only), trustReason (string).",
          },
          { role: "user", content: `Question: ${query}\nMode: ${mode ?? prompt.mode}\nSources:\n${sourceContext}` },
        ],
      }),
    });

    const data = await res.json() as { choices?: Array<{ message?: { content?: string } }>; error?: { message?: string } };

    if (!res.ok) {
      const msg = data?.error?.message ?? `OpenAI ${res.status}`;
      return new Response(
        JSON.stringify(fallbackAnswer(mode, prompt, fb, srcs, `API error: ${msg.slice(0, 100)}`)),
        { status: 200, headers: { ...corsHeaders(), "Content-Type": "application/json", "X-Magenta-Key-Set": "yes", "X-Magenta-Error": msg } },
      );
    }

    const parsed = parseJson(data?.choices?.[0]?.message?.content ?? "");
    if (!parsed) {
      return new Response(
        JSON.stringify(fallbackAnswer(mode, prompt, fb, srcs, `Unparseable response (${model})`)),
        { status: 200, headers: { ...corsHeaders(), "Content-Type": "application/json", "X-Magenta-Key-Set": "yes" } },
      );
    }

    const citedIds = cleanList(parsed.citations, 4, srcs.map((s) => s.id));
    const citedSrcs = citedIds.map((id) => sourceById[id]).filter(Boolean) as SourceRecord[];

    const answer: LiveAnswer = {
      title: (parsed.title as string)?.trim() || fb.title,
      summary: (parsed.summary as string)?.trim() || fb.executiveSummary,
      answer: cleanList(parsed.answer, 3, fb.detailedAnswer),
      takeaways: cleanList(parsed.takeaways, 3, fb.takeaways),
      followUps: cleanList(parsed.followUps, 3, fb.followUps),
      sources: citedSrcs.length > 0 ? citedSrcs : srcs,
      trustBadges: fb.trustBadges,
      confidence: fb.confidence,
      trustReason: (parsed.trustReason as string)?.trim() || fb.trustReason,
      trace: fb.trace,
      matchedPromptId: prompt.id,
      mode: mode ?? prompt.mode,
      providerLabel: "T-Systems AI advisory experience",
      backendLabel: `OpenAI live model (${model})`,
      engine: "openai",
    };

    return new Response(JSON.stringify(answer), {
      status: 200,
      headers: { ...corsHeaders(), "Content-Type": "application/json", "X-Magenta-Engine": "openai", "X-Magenta-Key-Set": "yes" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify(fallbackAnswer(mode, prompt, fb, srcs, `Fetch error: ${msg.slice(0, 100)}`)),
      { status: 200, headers: { ...corsHeaders(), "Content-Type": "application/json", "X-Magenta-Error": msg } },
    );
  }
}
