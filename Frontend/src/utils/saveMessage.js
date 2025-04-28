/*
Funksjonen saveMessage lagrer en melding i databasen ved hjelp av Supabase.

Input:
- chatId: En unik ID for samtalen som meldingen tilhører.
- consent: En boolean som angir om brukeren har gitt samtykke til lagring av data (true for ja, false for nei).
- message: Et objekt som representerer meldingen som skal lagres. Meldingen har følgende egenskaper:
  - sender: Angir hvem som sendte meldingen ("user" eller "bot").
  - text: Selve teksten i meldingen.

Hva funksjonen gjør:
1. Sjekker om lagring er tillatt:
   - Hvis "chatId" mangler eller "consent" er "false", returnerer funksjonen umiddelbart uten å gjøre noe.

2. Lagrer meldingen i databasen:
   - Bruker Supabase til å sette inn en ny rad i "messages"-tabellen med følgende data:
     - chat_id: ID-en for samtalen.
     - sender: Hvem som sendte meldingen ("user" eller "bot").
     - text: Teksten i meldingen.

3. Håndterer feil:
   - Hvis det oppstår en feil under lagringen, logger funksjonen feilen til konsollen.

Hvorfor:
- For å lagre meldinger i databasen slik at de kan hentes senere, for eksempel for å vise en historikk over samtaler.
- Respekterer brukerens samtykke ved å unngå lagring hvis "consent" er "false".

Returnerer:
- Ingen returverdi (funksjonen er void), men logger feil til konsollen hvis noe går galt.
*/

import { supabase } from "../supabaseClient";

const saveMessage = async (chatId, consent, message) => {
  if (!chatId || consent === false) {
    return;
  }

  try {
    const textToSave = message.text || (message.jsx ? "Liste eller JSX-innhold" : ""); // Konverter JSX til tekst
    const { error } = await supabase
      .from("messages")
      .insert([{ chat_id: chatId, sender: message.sender, text: textToSave }]);

    if (error) throw error;
  } catch (error) {
    console.error("❌ Feil ved lagring av melding:", error);
  }
};

export default saveMessage;