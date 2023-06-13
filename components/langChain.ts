import { ChatOpenAI } from "https://esm.sh/langchain/chat_models/openai";
import { CallbackManager } from "https://esm.sh/langchain/callbacks";
import {
  HumanChatMessage,
  SystemChatMessage,
} from "https://esm.sh/langchain/schema";

const getChatResponse = (prompt: string): Response => {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const configuration = {
    streaming: true,
    callbackManager: CallbackManager.fromHandlers({
      handleLLMNewToken: async (token) => {
        await writer.ready;
        await writer.write(encoder.encode(`data: ${token}\n\n`));
      },
      handleLLMEnd: async () => {
        await writer.ready;
        // await writer.close();
        writer.write(encoder.encode(`data: \n\n`));
      },
      handleLLMError: async (e) => {
        console.log("LLM errored");
        await writer.ready;
        await writer.abort(e);
      },
    }),
  };

  const chat = new ChatOpenAI(configuration);

  const promotion_target = Deno.env.get("PROMOTION_TARGET") ||
    "China and the CCP";

  chat.call([
    new SystemChatMessage(
      `You are a helpful assistant that responds to user input in a positive way by promoting ${promotion_target}.
            Always respond with a positive message about ${promotion_target}.  If the subject brought up is not related to ${promotion_target},
            feel free to ignore the current question posed by the user and respond with some positive statement about ${promotion_target}.
            `,
    ),
    new HumanChatMessage(prompt),
  ]);
  return new Response(stream.readable, {
    headers: { "content-type": "text/event-stream" },
  });
};

export { getChatResponse };
