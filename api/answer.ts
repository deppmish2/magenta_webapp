import type { IncomingMessage, ServerResponse } from "node:http";
import { generateAnswer, type AnswerEngineConfig } from "../server/answerEngine";
import type { DemoMode } from "../src/types";

// Strip surrounding quotes that get included when copying from .env files
function cleanEnvValue(value: string | undefined): string {
  return (value ?? "").trim().replace(/^["']|["']$/g, "");
}

function firstUsableEnv(...values: Array<string | undefined>) {
  return values
    .map((value) => cleanEnvValue(value))
    .find((value) => value && !value.startsWith("replace-with")) ?? "";
}

function getConfig(): AnswerEngineConfig {
  return {
    apiKey: firstUsableEnv(process.env.OPENAI_API_KEY, process.env.OPEN_API_KEY),
    model: firstUsableEnv(process.env.OPENAI_MODEL) || "gpt-4o-mini",
  };
}

async function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    req.on("error", reject);
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const config = getConfig();

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
    console.log(
      config.apiKey
        ? `[magenta] config ready · model=${config.model} · keySet=yes`
        : "[magenta] OPENAI_API_KEY / OPEN_API_KEY missing · scripted fallback active",
    );

    const answer = await generateAnswer({ query, mode }, config);

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("X-Magenta-Engine", answer.engine ?? "unknown");
    res.setHeader("X-Magenta-Key-Set", config.apiKey ? "yes" : "no");
    res.setHeader("X-Magenta-Model", config.model || "unset");
    res.end(JSON.stringify(answer));
  } catch (err) {
    console.error("[magenta] error:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
}
