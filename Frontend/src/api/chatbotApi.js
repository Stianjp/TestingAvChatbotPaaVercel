// chatbotApi.js

import { supabase } from '../supabaseClient';

export const saveData = async (consent, messages) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert(messages.map(message => ({
        chat_id: message.chatId,
        sender: message.sender,
        text: message.text,
      })));
    if (error) throw error;
    console.log("Lagringsresultat:", data);
  } catch (error) {
    console.error("Feil ved lagring:", error);
  }
};

export const clearBackendData = async () => {
  try {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('status', 'active');
    if (error) throw error;
    console.log("Sletting av data: Data slettet");
  } catch (error) {
    console.error("Feil ved sletting av data:", error);
  }
};
