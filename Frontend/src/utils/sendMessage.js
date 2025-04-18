import saveMessage from "./saveMessage";
import buildConversationForGPT from "./buildConversation";
import { askChatbot } from "./langchainChatbot";

const sendMessage = async (input, setInput, setMessages, setLoading, setIsTyping, chatId, consent, messages, dynamicSystemPrompt, inputRef) => {
  if (!input.trim()) return;

  setLoading(true);

  const userMessage = { sender: "user", text: input.trim() };
  setMessages((prev) => [...prev, userMessage]);
  saveMessage(chatId, consent, userMessage);
  setInput("");
  inputRef.current.style.height = "30px";

  setIsTyping(true);

  setTimeout(async () => {
    try {
      const conversationMessages = buildConversationForGPT([
        ...messages,
        userMessage,
      ]);

      const botReply = await askChatbot(conversationMessages, dynamicSystemPrompt);

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
      saveMessage(chatId, consent, { sender: "bot", text: botReply });
    } catch (error) {
      console.error("❌ Feil ved sending av melding:", error);
    } finally {
      setIsTyping(false);
      setLoading(false);
    }
  }, 500);
};

export default sendMessage;