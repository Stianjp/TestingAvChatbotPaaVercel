import { supabase } from "../supabaseClient";

const saveMessage = async (chatId, consent, message) => {
  if (!chatId || consent === false) {
    return;
  }

  try {
    const { error } = await supabase
      .from("messages")
      .insert([{ chat_id: chatId, sender: message.sender, text: message.text }]);

    if (error) throw error;
  } catch (error) {
    console.error("❌ Feil ved lagring av melding:", error);
  }
};

export default saveMessage;