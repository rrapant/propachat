import { Handlers } from "$fresh/server.ts";
import Chat from "../islands/Chat.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    return await ctx.render();
  },
};

export default function App() {
  return (
    <>
      <head>
        <title>ChatCCP</title>
      </head>
      <Chat />
    </>
  );
}
