import type { Connect } from "vite";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createAnswerHandler } from "./server/answerEngine";

function firstUsableValue(...values: Array<string | undefined>) {
  return (
    values.find((value) => {
      const normalized = value?.trim();
      return normalized && !normalized.startsWith("replace-with");
    }) ?? ""
  );
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const handler = createAnswerHandler({
    apiKey: firstUsableValue(
      process.env.OPEN_API_KEY,
      process.env.OPENAI_API_KEY,
      env.OPEN_API_KEY,
      env.OPENAI_API_KEY,
    ),
    model: env.OPENAI_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini",
  });

  const apiPlugin = {
    name: "magenta-answer-api",
    configureServer(server: { middlewares: Connect.Server }) {
      server.middlewares.use("/api/answer", handler);
    },
    configurePreviewServer(server: { middlewares: Connect.Server }) {
      server.middlewares.use("/api/answer", handler);
    },
  };

  return {
    plugins: [react(), apiPlugin],
  };
});
