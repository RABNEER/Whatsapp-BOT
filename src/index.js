import qrcode from "qrcode-terminal";
import whatsapp from "whatsapp-web.js";

import { getPuppeteerOptions } from "./chrome.js";
import { config } from "./config.js";
import { getAiReply } from "./groq.js";

const { Client, LocalAuth } = whatsapp;

function getMessageText(message) {
  const body = message.body?.trim();
  if (body) {
    return body;
  }

  const caption = message._data?.caption?.trim();
  if (caption) {
    return caption;
  }

  const type = message.type ?? "unknown";
  return `[User sent a ${type} message with no text]`;
}

async function handleIncomingMessage(message) {
  if (message.fromMe) {
    return;
  }

  const text = getMessageText(message);
  const chat = await message.getChat();
  await chat.sendStateTyping();

  try {
    const reply = await getAiReply(message.from, text);
    await message.reply(reply);
  } catch (error) {
    console.error("Failed to generate reply:", error.message);
    await message.reply(
      "Sorry, I could not generate a reply right now. Check the Groq API key.",
    );
  }
}

async function main() {
  console.log(`Using Groq model: ${config.groqModel}`);
  console.log("Replying to all inbound messages (DMs + groups).");

  const client = new Client({
    authStrategy: new LocalAuth({ dataPath: ".wwebjs_auth" }),
    puppeteer: getPuppeteerOptions(),
  });

  client.on("qr", (qr) => {
    console.log("\nScan this QR code with WhatsApp on your phone:\n");
    qrcode.generate(qr, { small: true });
    console.log(
      "\nWhatsApp → Linked devices → Link a device → scan the QR above\n",
    );
  });

  client.on("authenticated", () => {
    console.log("Authenticated. Session saved for next run.");
  });

  client.on("auth_failure", (message) => {
    console.error("Authentication failed:", message);
    process.exit(1);
  });

  client.on("ready", () => {
    console.log("WhatsApp bot is ready.");
  });

  client.on("message", (message) => {
    handleIncomingMessage(message).catch((error) => {
      console.error("Message handler error:", error);
    });
  });

  client.on("disconnected", (reason) => {
    console.error("Disconnected:", reason);
    process.exit(1);
  });

  console.log("Starting WhatsApp client...");
  await client.initialize();
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
