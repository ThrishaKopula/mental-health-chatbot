import { Configuration, OpenAIApi } from 'openai';
import { retrieveRelevantContext } from '@/lib/rag';

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

export default async function handler(req, res) {
  const { message, history } = req.body;

  const context = await retrieveRelevantContext(message);

  const completion = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: `You are a compassionate therapist. Use this context: ${context}` },
      ...history,
      { role: 'user', content: message },
    ],
  });

  res.status(200).json({ response: completion.data.choices[0].message.content });
}
