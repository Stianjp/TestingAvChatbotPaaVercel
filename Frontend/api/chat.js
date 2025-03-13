// api/chat.js
const { OpenAI } = require('openai');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Miljøvariabel i Vercel
    });

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Melding mangler i forespørselen" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4", // Endre til din ønskede GPT-modell
      messages: [{ role: "user", content: message }]
    });

    return res.status(200).json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("❌ Feil i OpenAI API:", error);
    return res.status(500).json({ error: error.message || "Ukjent feil" });
  }
};
