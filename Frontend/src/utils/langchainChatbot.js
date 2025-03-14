export const askChatbot = async (conversationMessages, systemPrompt) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      conversationMessages,
      systemPrompt,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`API-feil: ${data.error.message}`);
  }

  return data.choices[0].message.content;
};