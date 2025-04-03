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

  if (!response.ok) {
    const errorData = await response.json().catch(() => {
      throw new Error('Unexpected response from server');
    });
    throw new Error(`API error: ${errorData.error || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};