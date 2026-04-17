import type { IncomingMessage, ServerResponse } from "node:http";
import { createAnswerHandler } from "../server/answerEngine";

// Strip surrounding quotes that users sometimes copy from .env files (e.g. "sk-proj-...")
function cleanEnvValue(value: string | undefined): string {
  if (!value) return "";
  return value.trim().replace(/^["']|["']$/g, "");
}

const apiKey = cleanEnvValue(process.env.OPENAI_API_KEY);
const model = cleanEnvValue(process.env.OPENAI_MODEL) || "gpt-4o-mini";

if (!apiKey) {
  console.warn("[magenta] OPENAI_API_KEY is not set — responses will use scripted fallback");
} else {
  console.log(`[magenta] Answer engine ready · model: ${model} · key: ${apiKey.slice(0, 12)}...`);
}

const handler = createAnswerHandler({ apiKey, model });

export default async function (req: IncomingMessage, res: ServerResponse) {
  // Allow cross-origin requests (needed if custom domain differs from API domain)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  return handler(req, res, (err?: unknown) => {
    console.error("[magenta] Unhandled handler error:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Internal server error" }));
  });
}
