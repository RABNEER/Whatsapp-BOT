import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { applyProviderSettings, config } from "./config.js";
import { checkOllamaHealth } from "./ollama.js";

function ask(rl, question) {
  return rl.question(question);
}

export async function setupAiProvider() {
  const rl = createInterface({ input, output });

  try {
    console.log("\nChoose AI provider:\n");
    console.log("  1) Ollama (local)");
    console.log("  2) Groq (cloud)\n");

    let provider = null;

    while (!provider) {
      const choice = (await ask(rl, "Enter 1 or 2: ")).trim();

      if (choice === "1") {
        provider = "ollama";
      } else if (choice === "2") {
        provider = "groq";
      } else {
        console.log("Invalid choice. Please enter 1 or 2.\n");
      }
    }

    if (provider === "groq") {
      let groqApiKey = "";

      while (!groqApiKey) {
        const entered = (await ask(rl, "Enter Groq API key: ")).trim();
        groqApiKey = entered || config.groqApiKey;

        if (!groqApiKey) {
          console.log("Groq API key is required.\n");
        }
      }

      applyProviderSettings({ provider: "groq", groqApiKey });
      console.log(`\nUsing Groq model: ${config.groqModel}\n`);
      return;
    }

    applyProviderSettings({ provider: "ollama" });
    console.log("\nChecking Ollama...");
    await checkOllamaHealth();
    console.log(`Using Ollama model: ${config.ollamaModel}\n`);
  } finally {
    rl.close();
  }
}
