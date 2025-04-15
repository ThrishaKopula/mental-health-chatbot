import { retrieveRelevantContext } from '../../lib/rag.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export default async function handler(req, res) {
  const { message, history } = req.body;

  const context = await retrieveRelevantContext(message);

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: `You are a compassionate therapist. Use this context: ${context}` },
      ...history,
      { role: 'user', content: message },
    ],
  });

  res.status(200).json({ response: completion.choices[0].message.content });
}
