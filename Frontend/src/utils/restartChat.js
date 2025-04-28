import startNewChat from "./startNewChat";
import { initialMessage } from "../data/chatbotPrompts";

const restartChat = (setChatId, setConsent, setChatEnded, setIsFinishingChat, setMessages) => {
  setChatId(null);
  setConsent(null);
  setChatEnded(false);
  setIsFinishingChat(false);
  setMessages([{ sender: "bot", text: initialMessage }]); // Start med en tekstmelding
  startNewChat(setChatId);
};

export default restartChat;