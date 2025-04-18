import { supabase } from "../supabaseClient";
import saveMessage from "./saveMessage";
import buildConversationForGPT from "./buildConversation";
import { askChatbot } from "./langchainChatbot";

const finishChat = async (isFinishingChat, setIsFinishingChat, consent, chatId, messages, setMessages, setChatEnded, summaryPrompt) => {
  if (isFinishingChat) return; // Forhindrer flere kall
  setIsFinishingChat(true);

  try {
    if (consent !== false && chatId) {
      // Oppdater samtalestatus i databasen
      const { error } = await supabase
        .from("chats")
        .update({ status: "finished" })
        .eq("id", chatId);

      if (error) throw error;
    }

    // Bygg samtalen for oppsummering
    const conversationMessages = buildConversationForGPT(messages); // Bruker hele meldingslisten
    

    // Generer oppsummering
    const summary = await askChatbot(conversationMessages, summaryPrompt);
    console.log("🛠️ Oppsummering fra GPT:", summary);

    // Legg til oppsummeringen som en melding fra boten
    const summaryMessages = [
      { sender: "bot", text: "Her er en oppsummering av samtalen:" },
      { sender: "bot", text: summary },
      { sender: "bot", text: "Takk for samtalen!😊 Ha en fin dag videre!\nHvis du vil starte på nytt, trykk på knappen nedenfor 👇" },
    ];

    setMessages((prev) => [...prev, ...summaryMessages]); // Oppdater meldingslisten med oppsummeringen

    // Lagre oppsummeringen i databasen
    for (const message of summaryMessages) {
      await saveMessage(chatId, consent, message);
    }

    setChatEnded(true); // Marker samtalen som avsluttet
  } catch (error) {
    console.error("❌ Feil ved oppdatering av samtalestatus eller oppsummering:", error);
  } finally {
    setIsFinishingChat(false); // Skjul spinneren når prosessen er ferdig
  }
};

export default finishChat;