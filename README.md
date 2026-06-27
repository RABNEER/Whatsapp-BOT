# WhatsApp AI Bot

A WhatsApp chatbot that connects by **scanning a QR code** (like WhatsApp Web). No Meta Business API required. AI replies are powered by **Ollama** (local) or **Groq** (cloud).

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/)
- [Ollama](https://ollama.com/) if you choose Ollama at startup
- A [Groq](https://console.groq.com/) API key if you choose Groq at startup
- **Google Chrome** installed (used to run WhatsApp Web), or Puppeteer's bundled Chromium
- A phone with WhatsApp

Pull a model (if you have not already):

```bash
ollama pull llama3.2
```

## Setup

```bash
cd C:\Users\LOQ\Projects\whatsapp-ai-bot
pnpm install
copy .env.example .env
```

Optional `.env` defaults:

| Variable | Default | Description |
|----------|---------|-------------|
| `GROQ_API_KEY` | *(prompted)* | Pre-fill Groq key if set |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` | Groq model |
| `OLLAMA_BASE_URL` | `http://127.0.0.1:11434` | Ollama API URL |
| `OLLAMA_MODEL` | `llama3.2` | Ollama model |
| `SYSTEM_PROMPT` | helpful assistant | AI personality |

## Run

```bash
pnpm start
```

1. Choose **Ollama** or **Groq** in the terminal (Groq will ask for your API key).
2. A QR code appears in the terminal.
3. On your phone: **WhatsApp → Linked devices → Link a device**.
4. Scan the QR code.
5. Send a message — the bot replies using your chosen provider.

The session is saved in `.wwebjs_auth/`, so you usually only scan once.

## Development

```bash
pnpm dev
```

Restarts automatically when you change source files.

## Troubleshooting

**Puppeteer Chrome download failed during `pnpm install`**

The bot auto-detects Google Chrome on Windows. Install Chrome, or set `CHROME_PATH` in `.env` to your browser executable.

**Ollama model not found**

```bash
ollama pull llama3.2
```

## Notes

- Uses [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) — unofficial, not endorsed by Meta.
- Keep the process running for the bot to stay online.
- The bot replies to all inbound DMs and group messages.
