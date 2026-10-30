import { chromium } from 'playwright-core';
import fs from 'node:fs';
// Uses CHROME_PATH, else a system Chrome or Chromium.
const candidates = [process.env.CHROME_PATH, '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
export const launch = () => {
  const executablePath = candidates.find((p) => fs.existsSync(p));
  if (!executablePath) throw new Error('No Chrome found. Set CHROME_PATH.');
  return chromium.launch({ executablePath, args: ['--no-sandbox'] });
};
