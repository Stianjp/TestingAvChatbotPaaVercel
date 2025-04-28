/*
Funksjonen sendMessage håndterer prosessen med å sende en melding fra brukeren til chatboten, oppdatere grensesnittet, og motta et svar fra boten.

Input:
- input: Teksten som brukeren har skrevet i inputfeltet.
- setInput: En funksjon som oppdaterer state for inputfeltet.
- setMessages: En funksjon som oppdaterer meldingslisten i grensesnittet.
- setLoading: En funksjon som oppdaterer state for å indikere om meldingen er under behandling.
- setIsTyping: En funksjon som oppdaterer state for å indikere om boten "skriver".
- chatId: En unik ID for samtalen som brukes til å lagre meldinger i databasen.
- consent: En boolean som angir om brukeren har gitt samtykke til lagring av data.
- messages: En liste med meldinger som representerer hele samtalen.
- dynamicSystemPrompt: En tekststreng som gir GPT-modellen instruksjoner om hvordan den skal oppføre seg.
- inputRef: En referanse til inputfeltet for å justere høyden dynamisk.

Hva funksjonen gjør:
1. Validerer input:
   - Hvis input er tomt eller kun inneholder mellomrom, returnerer funksjonen uten å gjøre noe.

2. Oppdaterer state for å indikere at meldingen behandles:
   - Setter setLoading(true) for å vise at meldingen behandles.

3. Oppretter og lagrer brukerens melding:
   - Oppretter et objekt for brukerens melding med sender: "user" og text: input.trim().
   - Oppdaterer meldingslisten med setMessages.
   - Lagrer meldingen i databasen ved hjelp av saveMessage.

4. Tilbakestiller inputfeltet:
   - Tømmer inputfeltet ved å kalle setInput("").
   - Justerer høyden på inputfeltet tilbake til standard ved hjelp av inputRef.

5. Indikerer at boten "skriver":
   - Setter setIsTyping(true) for å vise at boten forbereder et svar.

6. Genererer botens svar:
   - Etter en forsinkelse på 500 ms (simulerer "skriving"), bygger funksjonen samtalen ved hjelp av buildConversationForGPT.
   - Sender samtalen og systemprompten til GPT-modellen via askChatbot.
   - Mottar botens svar og oppdaterer meldingslisten med det.

7. Lagrer botens svar:
   - Lagrer botens svar i databasen ved hjelp av saveMessage.

8. Håndterer feil:
   - Logger eventuelle feil som oppstår under prosessen.

9. Tilbakestiller state:
   - Setter setIsTyping(false) og setLoading(false) for å indikere at prosessen er ferdig.

Hvorfor:
- For å håndtere hele meldingsflyten fra brukerens input til botens svar.
- Oppdaterer grensesnittet og databasen for å sikre en sømløs brukeropplevelse.

Returnerer:
- Ingen returverdi (funksjonen er void), men oppdaterer state og meldingslisten.
*/

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

      console.log("🛠️ Meldinger sendt til GPT:", conversationMessages);

      const botReply = await askChatbot(conversationMessages, dynamicSystemPrompt);

      // Sjekk om svaret inneholder både vanlig tekst og punktliste
      let botMessage;
      const [intro, ...listItems] = botReply.split("\n-"); // Del opp ved første punktliste

      if (listItems.length > 0) {
        // Formater både introduksjon og punktliste
        const formattedIntro = (
          <p>
            {intro.split(/(\*\*.*?\*\*)/).map((part, i) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={i}>{part.replace(/\*\*/g, "")}</strong>
              ) : (
                part
              )
            )}
          </p>
        );

        const formattedList = (
          <ul>
            {listItems.map((item, index) => (
              <li key={index}>
                {item
                  .trim()
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
        );

        // Kombiner introduksjon og punktliste i én melding
        botMessage = {
          sender: "bot",
          jsx: (
            <div>
              {formattedIntro}
              {formattedList}
            </div>
          ),
        };
      } else {
        // Hvis det kun er vanlig tekst
        botMessage = {
          sender: "bot",
          jsx: (
            <p>
              {botReply.split(/(\*\*.*?\*\*)/).map((part, i) =>
                part.startsWith("**") && part.endsWith("**") ? (
                  <strong key={i}>{part.replace(/\*\*/g, "")}</strong>
                ) : (
                  part
                )
              )}
            </p>
          ),
        };
      }

      setMessages((prev) => [...prev, botMessage]);
      saveMessage(chatId, consent, botMessage);
    } catch (error) {
      console.error("❌ Feil ved sending av melding:", error);
    } finally {
      setIsTyping(false);
      setLoading(false);
    }
  }, 500);
};

export default sendMessage;