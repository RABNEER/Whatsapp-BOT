import "dotenv/config";

const DEFAULT_SYSTEM_PROMPT =
  "You are a helpful WhatsApp assistant. Keep replies concise and friendly.";

export const config = {
  groqApiKey: process.env.GROQ_API_KEY ?? "",
  groqModel: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
  systemPrompt: process.env.SYSTEM_PROMPT ?? DEFAULT_SYSTEM_PROMPT,
  maxHistoryMessages: 12,
};

if (!config.groqApiKey) {
  console.error("Missing GROQ_API_KEY in .env");
  process.exit(1);
}
