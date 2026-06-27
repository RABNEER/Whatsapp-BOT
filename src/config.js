import "dotenv/config";

const DEFAULT_SYSTEM_PROMPT =
  "You are a helpful WhatsApp assistant. Keep replies concise and friendly.";

export const config = {
  provider: null,
  groqApiKey: process.env.GROQ_API_KEY ?? "",
  groqModel: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434",
  ollamaModel: process.env.OLLAMA_MODEL ?? "llama3.2",
  systemPrompt: process.env.SYSTEM_PROMPT ?? DEFAULT_SYSTEM_PROMPT,
  maxHistoryMessages: 12,
};

export function applyProviderSettings(settings) {
  Object.assign(config, settings);
}
