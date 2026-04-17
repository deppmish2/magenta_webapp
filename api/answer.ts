import type { IncomingMessage, ServerResponse } from "node:http";
import { generateAnswer, type AnswerEngineConfig } from "../server/answerEngine";
import type { DemoMode } from "../src/types";

// Strip surrounding quotes that get included when copying from .env files
function cleanEnvValue(value: string | undefined): string {
  return (value ?? "").trim().replace(/^["']|["']$/g, "");
}

const config: AnswerEngineConfig = {
  apiKey: cleanEnvValue(process.env.OPENAI_API_KEY),
  model: cleanEnvValue(process.env.OPENAI_MODEL) || "gpt-4o-mini",
};

console.log(
  config.apiKey
    ? `[magenta] ready · model: ${config.model} · key: ${config.apiKey.slice(0, 12)}...`
    : "[magenta] OPENAI_API_KEY not set — scripted fallback active",
);

async function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    req.on("error", reject);
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  try {
    const raw = await readBody(req);
    let query = "";
    let mode: DemoMode | undefined;

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { query?: string; mode?: DemoMode };
        query = parsed.query ?? "";
        mode = parsed.mode;
      } catch {
        // malformed JSON — use empty query, engine will pick default
      }
    }

    console.log(`[magenta] query="${query}" mode=${mode ?? "unset"}`);

    const answer = await generateAnswer({ query, mode }, config);

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(answer));
  } catch (err) {
    console.error("[magenta] error:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
}
