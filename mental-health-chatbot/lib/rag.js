import OpenAI from 'openai';
import { index } from './pinecone.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });

  return response.data[0].embedding;
}

export async function embedAndStore(dataset) {
  const vectors = [];

  for (const [i, intent] of dataset.intents.entries()) {
    for (const [j, pattern] of intent.patterns.entries()) {
      const embedding = await getEmbedding(pattern);
      vectors.push({
        id: `${intent.tag}-${i}-${j}`,
        values: embedding,
        metadata: {
          tag: intent.tag,
          response: intent.responses[0],
          pattern,
        },
      });
    }
  }

  console.log('🧠 Uploading', vectors.length, 'embeddings to Pinecone...');
  await index.upsert(vectors);
  console.log('✅ Upload to Pinecone complete!');
}
