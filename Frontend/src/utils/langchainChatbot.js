// src/utils/langchainChatbot.js

export const askChatbot = async (conversationMessages, systemPrompt) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ conversationMessages, systemPrompt })
      });
  
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("❌ Feil ved kommunikasjon med chatbot-API:", error);
      return "Beklager, jeg klarte ikke å svare akkurat nå.";
    }
  };
  