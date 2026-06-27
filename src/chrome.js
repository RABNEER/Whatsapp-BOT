import { existsSync } from "node:fs";

const WINDOWS_CHROME_PATHS = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  process.env.LOCALAPPDATA
    ? `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`
    : null,
].filter(Boolean);

export function resolveChromePath() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  for (const chromePath of WINDOWS_CHROME_PATHS) {
    if (existsSync(chromePath)) {
      return chromePath;
    }
  }

  return undefined;
}

export function getPuppeteerOptions() {
  const executablePath = resolveChromePath();
  const options = {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };

  if (executablePath) {
    options.executablePath = executablePath;
  }

  return options;
}
