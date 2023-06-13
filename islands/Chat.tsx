import { aiResponse, userInput } from "../components/Signals.ts";

export default function Chat() {
  const onClick = () => {
    aiResponse.value = "";
    userInput.value = document.getElementById("userInput")?.value;
    const eventSource = new EventSource(
      "/api/chatstream?prompt=" + userInput.value,
    );
    eventSource.onmessage = (e) => {
      aiResponse.value += e.data;
    };
    eventSource.onerror = (e) => {
      eventSource.close();
    };
  };

  return (
    <>
      <div class="grid grid-cols-1 m-5 place-content-center">
        <h1 class="text-2xl font-bold text-red-500">Welcome to ChatCCP</h1>
        <textarea
          class=" my-5 p-5 rounded border-3 bg-gray-100 hover:bg-gray-200"
          name="userInput"
          id="userInput"
          value=""
          placeholder={`Enter your message here and press submit`}
        />
        <div class="flex justify-center">
          <input
            onClick={onClick}
            class="mb-5 rounded bg-red-400 hover:bg-red-500 w-1/5 text-white"
            type="button"
            value="Submit"
          />
        </div>
        <p class="p-10 bg-gray-100">{userInput.value || ""}</p>
        <p class="p-10 mt-5 bg-red-100">{aiResponse.value}</p>
      </div>
    </>
  );
}
