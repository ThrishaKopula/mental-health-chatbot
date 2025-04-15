import { index } from './pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

const embeddings = new OpenAIEmbeddings();

export async function embedAndStore(dataset) {
  const vectors = [];

  dataset.intents.forEach((intent, i) => {
    intent.patterns.forEach(async (pattern, j) => {
      const embedding = await embeddings.embedQuery(pattern);
      vectors.push({
        id: `${intent.tag}-${i}-${j}`,
        values: embedding,
        metadata: {
          tag: intent.tag,
          response: intent.responses[0],
          pattern,
        },
      });
    });
  });

  await index.upsert(vectors);
}

export async function retrieveRelevantContext(message) {
  const queryEmbedding = await embeddings.embedQuery(message);

  const result = await index.query({
    vector: queryEmbedding,
    topK: 1,
    includeMetadata: true,
  });

  return result.matches?.[0]?.metadata?.response || '';
}
