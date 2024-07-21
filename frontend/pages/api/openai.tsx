import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

export default async function handler(req:any, res:any) {
  if (req.method === 'POST') {
    const { prompt } = req.body;

    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4o',
      });

      res.status(200).json({ response: chatCompletion.choices[0].message.content });
    } catch (error) {
      console.error('Error interacting with OpenAI API:', error);
      res.status(500).json({ error: 'Error interacting with OpenAI API' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
