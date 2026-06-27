import { config } from "./config.js";

const chatHistory = new Map();

function getHistory(chatId) {
  if (!chatHistory.has(chatId)) {
    chatHistory.set(chatId, []);
  }
  return chatHistory.get(chatId);
}

function trimHistory(messages) {
  if (messages.length <= config.maxHistoryMessages) {
    return messages;
  }
  return messages.slice(-config.maxHistoryMessages);
}

export async function getAiReply(chatId, userMessage) {
  const history = getHistory(chatId);
  history.push({ role: "user", content: userMessage });
  trimHistory(history);

  const response = await fetch(`${config.ollamaBaseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: config.ollamaModel,
      stream: false,
      messages: [
        { role: "system", content: config.systemPrompt },
        ...history,
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const reply = data.message?.content?.trim();

  if (!reply) {
    throw new Error("Ollama returned an empty reply");
  }

  history.push({ role: "assistant", content: reply });
  trimHistory(history);

  return reply;
}

export async function checkOllamaHealth() {
  const response = await fetch(`${config.ollamaBaseUrl}/api/tags`);
  if (!response.ok) {
    throw new Error(`Cannot reach Ollama at ${config.ollamaBaseUrl}`);
  }

  const data = await response.json();
  const models = (data.models ?? []).map((m) => m.name);
  const hasModel = models.some(
    (name) =>
      name === config.ollamaModel || name.startsWith(`${config.ollamaModel}:`),
  );

  if (!hasModel) {
    console.warn(
      `Model "${config.ollamaModel}" not found locally. Available: ${models.join(", ") || "none"}`,
    );
    console.warn(`Run: ollama pull ${config.ollamaModel}`);
  }
}
