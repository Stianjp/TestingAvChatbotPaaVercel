export const askChatbot = async (conversationMessages, systemPrompt) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("API key is missing. Please set the REACT_APP_OPENAI_API_KEY environment variable.");
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationMessages,
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`API-feil: ${data.error.message}`);
  }

  return data.choices[0].message.content;
};