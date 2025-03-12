const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001"; 

export const askChatbot = async (conversationMessages, systemPrompt) => {
    try {
        const response = await fetch(`${apiBaseUrl}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ conversationMessages, systemPrompt })
        });

        if (!response.ok) {
            throw new Error(`API-feil: ${response.statusText}`);
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("❌ Feil ved kommunikasjon med chatbot-API:", error);
        return "Beklager, jeg klarte ikke å svare akkurat nå.";
    }
};
