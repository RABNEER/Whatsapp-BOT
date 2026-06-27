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

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.groqApiKey}`,
    },
    body: JSON.stringify({
      model: config.groqModel,
      messages: [
        { role: "system", content: config.systemPrompt },
        ...history,
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error("Groq returned an empty reply");
  }

  history.push({ role: "assistant", content: reply });
  trimHistory(history);

  return reply;
}
