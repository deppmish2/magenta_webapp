import { generateAnswer, type AnswerEngineConfig } from "../server/answerEngine.ts";
import type { DemoMode } from "../src/types";

export const runtime = "nodejs";

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

function json(payload: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      ...(init?.headers ?? {}),
    },
  });
}

export async function GET() {
  const config = getConfig();

  return json({
    ok: true,
    route: "/api/answer",
    runtime,
    keySet: Boolean(config.apiKey),
    model: config.model || null,
  });
}

export async function OPTIONS() {
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

export async function POST(request: Request) {
  const config = getConfig();

  try {
    const body = (await request.json().catch(() => ({}))) as {
      query?: string;
      mode?: DemoMode;
    };

    const answer = await generateAnswer(
      {
        query: body.query ?? "",
        mode: body.mode,
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
}
