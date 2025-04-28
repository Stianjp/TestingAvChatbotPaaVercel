/*
Funksjonen startNewChat oppretter en ny samtale i databasen ved hjelp av Supabase og oppdaterer chat-ID-en i state.

Input:
- setChatId: En funksjon som oppdaterer state for chat-ID.

Hva funksjonen gjør:
1. Setter inn en ny rad i "chats"-tabellen:
   - Bruker Supabase til å opprette en ny samtale med status "active".
   - Henter dataen for den opprettede samtalen.

2. Håndterer feil:
   - Hvis det oppstår en feil under opprettelsen, kaster funksjonen en feil og logger den til konsollen.

3. Oppdaterer chat-ID:
   - Hvis samtalen opprettes vellykket, oppdaterer funksjonen chat-ID-en i state ved å kalle setChatId med ID-en fra databasen.

Hvorfor:
- For å starte en ny samtale og lagre den i databasen.
- Oppdaterer state med den nye chat-ID-en for videre bruk i applikasjonen.

Returnerer:
- Ingen returverdi (funksjonen er void), men oppdaterer state via setChatId og logger meldinger til konsollen.
*/

import { supabase } from "../supabaseClient";

const startNewChat = async (setChatId) => {
  try {
    const { data, error } = await supabase
      .from("chats")
      .insert([{ status: "active" }])
      .select()
      .single();

    if (error) throw error;

    setChatId(data.id);
    console.log("Ny samtale startet med ID:", data.id);
  } catch (error) {
    console.error("Feil ved oppstart av chat:", error);
  }
};

export default startNewChat;