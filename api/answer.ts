import type { IncomingMessage, ServerResponse } from "node:http";
import { createAnswerHandler } from "../server/answerEngine";

const handler = createAnswerHandler({
  apiKey: process.env.OPENAI_API_KEY ?? "",
  model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
});

export default function (
  req: IncomingMessage,
  res: ServerResponse,
) {
  return handler(req, res, (err?: unknown) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  });
}
