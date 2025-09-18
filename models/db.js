import fs from 'fs';


const readData = () => {
  try {
  const data = fs.readFileSync('./db.json', 'utf-8');
  return JSON.parse(data);
  } catch (error) {
    console.error('Error reading db.json:', error);
    return { clientes: [], eventos: [] };
  }
}

const writeData = (data) => {
  try {
    fs.writeFileSync('db.json', JSON.stringify(data), 'utf-8');
  } catch (error) {
    console.error('Error writing db.json:', error);
  }
}

export { readData, writeData };