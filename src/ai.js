import { config } from "./config.js";
import { getAiReply as getGroqReply } from "./groq.js";
import { getAiReply as getOllamaReply } from "./ollama.js";

export function getAiReply(chatId, userMessage) {
  if (config.provider === "groq") {
    return getGroqReply(chatId, userMessage);
  }
  return getOllamaReply(chatId, userMessage);
}

export function getProviderLabel() {
  if (config.provider === "groq") {
    return `Groq (${config.groqModel})`;
  }
  return `Ollama (${config.ollamaModel})`;
}
