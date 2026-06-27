# WhatsApp AI Bot

A WhatsApp chatbot that connects by **scanning a QR code** (like WhatsApp Web). No Meta Business API required. AI replies are powered by **Ollama** running locally.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/)
- [Ollama](https://ollama.com/) installed and running
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

Edit `.env` if needed:

| Variable | Default | Description |
|----------|---------|-------------|
| `OLLAMA_BASE_URL` | `http://127.0.0.1:11434` | Ollama API URL |
| `OLLAMA_MODEL` | `llama3.2` | Model name |
| `ALLOWED_NUMBERS` | *(empty = all)* | Comma-separated numbers to reply to |
| `IGNORE_GROUPS` | `true` | Skip group chats |
| `SYSTEM_PROMPT` | helpful assistant | AI personality |

## Run

```bash
pnpm start
```

1. A QR code appears in the terminal.
2. On your phone: **WhatsApp → Linked devices → Link a device**.
3. Scan the QR code.
4. Send a message to the linked number — the bot replies using Ollama.

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
- For production, consider restricting `ALLOWED_NUMBERS` so only trusted contacts get AI replies.
