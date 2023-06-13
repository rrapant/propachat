import { HandlerContext } from "$fresh/server.ts";
import { getChatResponse } from "../../components/langChain.ts";

export const handler = (req: Request, _ctx: HandlerContext): Response => {
  const prompt = new URL(req.url).searchParams.get("prompt") || "";
  return getChatResponse(prompt);
};
