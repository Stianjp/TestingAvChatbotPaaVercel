/*
Funksjonen finishChat avslutter en samtale, oppdaterer statusen i databasen, og genererer en oppsummering av samtalen ved hjelp av en GPT-basert AI-modell.

Input:
- isFinishingChat: En boolean som indikerer om funksjonen allerede kjører (forhindrer flere samtidige kall).
- setIsFinishingChat: En funksjon som oppdaterer state for å indikere om samtalen avsluttes.
- consent: Brukerens samtykke (true/false) for lagring av data.
- chatId: En unik ID for samtalen som brukes til å oppdatere status i databasen.
- messages: En liste med meldinger som representerer hele samtalen.
- setMessages: En funksjon som oppdaterer meldingslisten i grensesnittet.
- setChatEnded: En funksjon som markerer samtalen som avsluttet.
- summaryPrompt: En tekststreng som instruerer GPT-modellen om hvordan oppsummeringen skal genereres.

Hva funksjonen gjør:
1. Forhindrer flere samtidige kall:
   - Hvis isFinishingChat er true, returnerer funksjonen umiddelbart.
   - Setter setIsFinishingChat(true) for å indikere at avslutningsprosessen er i gang.

2. Oppdaterer samtalestatus i databasen:
   - Hvis consent er ikke-false og chatId er definert:
     - Bruker Supabase til å oppdatere samtalens status til "finished".
     - Logger en feil hvis oppdateringen mislykkes.

3. Bygger samtalen for oppsummering:
   - Bruker buildConversationForGPT til å formatere meldingslisten (messages) til et format som GPT-modellen kan forstå.

4. Genererer oppsummering:
   - Sender den formaterte samtalen og summaryPrompt til GPT-modellen via askChatbot.
   - Logger oppsummeringen for debugging.

5. Oppdaterer meldingslisten:
   - Oppretter en liste med oppsummeringsmeldinger som inkluderer:
     - En introduksjon til oppsummeringen.
     - Selve oppsummeringen generert av GPT.
     - En avsluttende melding med takknemlighet og instruksjoner for å starte en ny samtale.
   - Oppdaterer meldingslisten med setMessages.

6. Lagrer oppsummeringen i databasen:
   - Bruker saveMessage til å lagre hver oppsummeringsmelding i databasen.

7. Marker samtalen som avsluttet:
   - Setter setChatEnded(true) for å indikere at samtalen er ferdig.

8. Håndterer feil:
   - Logger eventuelle feil som oppstår under prosessen.

9. Tilbakestiller state:
   - Setter setIsFinishingChat(false) for å indikere at avslutningsprosessen er ferdig.

Hvorfor:
- For å avslutte samtalen på en strukturert måte og gi brukeren en oppsummering av hele samtalen.
- Oppdaterer databasen for å holde oversikt over samtalens status.
- Gir brukeren en positiv avslutning med en oppsummering og muligheten til å starte en ny samtale.

Returnerer:
- Ingen returverdi (funksjonen er void), men oppdaterer state og meldingslisten.
*/

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
    const conversationMessages = buildConversationForGPT(
      messages.map((m) => ({
        ...m,
        text: m.text || (m.jsx ? "Liste eller JSX-innhold" : ""), // Konverter JSX til tekst
      }))
    );

    // Generer oppsummering
    const summary = await askChatbot(conversationMessages, summaryPrompt);
    console.log("🛠️ Oppsummering fra GPT:", summary);

    // Del opp teksten i introduksjon og punktliste
    const [intro, ...listItems] = summary.split("\n-"); // Del opp ved første punktliste

    // Formater introduksjonen
    const formattedIntro = intro.split(/(\*\*.*?\*\*)/).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.replace(/\*\*/g, "")}</strong>
      ) : (
        part
      )
    );

    // Formater punktlisten
    const formattedList =
      listItems.length > 0 ? (
        <ul>
          {listItems.map((item, index) => (
            <li key={index}>
              {item
                .replace(/^[-*]\s*/, "") // Fjern "-" eller "*" fra starten
                .split(/(\*\*.*?\*\*)/) // Del opp i tekst og fet skrift
                .map((part, i) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={i}>{part.replace(/\*\*/g, "")}</strong>
                  ) : (
                    part
                  )
                )}
            </li>
          ))}
        </ul>
      ) : null;

    // Kombiner introduksjon og punktliste i én melding
    const combinedMessage = (
      <div>
        <p>{formattedIntro}</p>
        {formattedList}
      </div>
    );

    // Legg til oppsummeringen som én melding fra boten
    const summaryMessages = [
      { sender: "bot", jsx: combinedMessage },
      { sender: "bot", text: "Takk for samtalen!😊 Ha en fin dag videre!" },
    ];

    setMessages((prev) => [...prev, ...summaryMessages]); // Oppdater meldingslisten med oppsummeringen

    // Lagre oppsummeringen i databasen
    for (const message of summaryMessages) {
      await saveMessage(chatId, consent, message);
    }

    setChatEnded(true); // Marker samtalen som avsluttet
  } catch (error) {
    console.error("❌ Feil ved oppsummering:", error);
  } finally {
    setIsFinishingChat(false); // Skjul spinneren når prosessen er ferdig
  }
};

export default finishChat;