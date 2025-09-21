const fs = require('fs').promises;
const path = require('path');

// Lee y devuelve el contenido del archivo JSON
async function readDB(dbPath) {
  await ensureDB(dbPath);
  const raw = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(raw || '[]');
}

// Escribe datos en el archivo JSON
async function writeDB(dbPath, data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

// Asegura que el archivo JSON exista
async function ensureDB(dbPath) {
  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, '[]', 'utf-8');
  }
}

module.exports = { readDB, writeDB, ensureDB };