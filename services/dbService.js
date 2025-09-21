import fs from 'fs/promises';
import path from 'path';

export async function readDB(dbPath) {
  await ensureDB(dbPath);
  const raw = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(raw || '[]');
}

export async function writeDB(dbPath, data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function ensureDB(dbPath) {
  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, '[]', 'utf-8');
  }
}