import fs from 'fs';
import path from 'path';

export type LlmDocEntry = {
  path: string;
  title?: string;
  description?: string;
  docType?: string;
  lastModified?: string;
};

const DOCS_INDEX_PATH = path.join(process.cwd(), 'public', 'docs-index.json');
let cachedEntries: LlmDocEntry[] | null = null;

export const readLlmDocEntries = (): LlmDocEntry[] => {
  if (cachedEntries) {
    return cachedEntries;
  }

  if (!fs.existsSync(DOCS_INDEX_PATH)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(DOCS_INDEX_PATH, 'utf8');
    const parsed = JSON.parse(raw) as LlmDocEntry[];
    cachedEntries = Array.isArray(parsed) ? parsed : [];
    return cachedEntries;
  } catch {
    return [];
  }
};

export const normalizeRoutePath = (rawPath: string): string => {
  if (rawPath.startsWith('/')) {
    return rawPath;
  }
  return `/${rawPath}`;
};
