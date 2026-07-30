import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '..', '..', '.data');
const tokenFile = path.join(dataDir, 'tokens.json');

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export function readTokens() {
  ensureDataDir();

  if (!fs.existsSync(tokenFile)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(tokenFile, 'utf8'));
  } catch {
    return null;
  }
}

export function writeTokens(tokens) {
  ensureDataDir();
  fs.writeFileSync(tokenFile, JSON.stringify(tokens, null, 2));
}
