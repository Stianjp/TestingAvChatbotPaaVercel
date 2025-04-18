const buildConversationForGPT = (allMessages) => {
  return allMessages
    .filter((m) => m.text) // Fjerner meldinger uten `text`
    .map((m) => ({
      role: m.sender === "bot" ? "assistant" : "user",
      content: m.text,
    }));
};

export default buildConversationForGPT;