import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config'; // Load .env
import { embedAndStore } from '../lib/rag.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../data/intents.json');

try {
  const rawData = await fs.readFile(filePath, 'utf-8');
  const intents = JSON.parse(rawData); // ✅ Parse string to object
  await embedAndStore(intents);
  console.log('✅ Upload to Pinecone complete!');
} catch (err) {
  console.error('❌ Failed to upload:', err.message);
}
