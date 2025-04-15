import { embedAndStore } from '../lib/rag.js';
import fs from 'fs/promises';

const filePath = new URL('../data/intents.json', import.meta.url);
const fileData = await fs.readFile(filePath, 'utf-8');
const intents = JSON.parse(fileData);

await embedAndStore(intents);
console.log('Upload complete');
