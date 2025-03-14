const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { conversationMessages, systemPrompt } = req.body;
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing. Please set the REACT_APP_OPENAI_API_KEY environment variable.' });
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationMessages,
      ],
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error calling OpenAI API:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://localhost:5001',
    changeOrigin: true,
  })
);

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});