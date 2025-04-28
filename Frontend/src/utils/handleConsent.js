/*
Funksjonen handleConsent håndterer brukerens samtykke til datalagring og oppdaterer meldingslisten basert på valget. Hvis brukeren gir samtykke, starter den en ny chat og lagrer meldinger i databasen.

Input:
- userConsent: En boolean som angir om brukeren har gitt samtykke (true for ja, false for nei).
- setConsent: En funksjon som oppdaterer state for brukerens samtykke.
- setMessages: En funksjon som oppdaterer meldingslisten i grensesnittet.
- startNewChat: En funksjon som starter en ny chat og genererer en chatId.
- chatId: En unik ID for samtalen som brukes til å lagre meldinger i databasen.
- kryssIkon: Et bildeikon som brukes i meldingen for å forklare hvordan brukeren kan avslutte samtalen.

Hva funksjonen gjør:
1. Oppdaterer brukerens samtykke:
   - Kaller setConsent med verdien av userConsent for å lagre valget i state.

2. Genererer meldinger basert på samtykke:
   - Bruker createConsentMessages for å lage tre meldinger:
     - userMsg: Meldingen fra brukeren som bekrefter eller avslår samtykke.
     - botMsg1: En melding fra boten som forklarer prosessen videre.
     - botMsg2: En melding fra boten som introduserer seg selv og spør om brukerens navn.

3. Oppdaterer meldingslisten:
   - Legger til userMsg, botMsg1, og botMsg2 i meldingslisten ved hjelp av setMessages.

4. Starter en ny chat hvis samtykke er gitt:
   - Hvis userConsent er true:
     - Kaller startNewChat for å opprette en ny samtale.
     - Hvis chatId er definert:
       - Lagrer meldingene (userMsg, botMsg1, botMsg2) i databasen ved hjelp av saveMessage.
     - Logger en feil hvis chatId ikke er definert.

5. Logger feil:
   - Logger eventuelle feil som oppstår under oppstart av ny chat eller lagring av meldinger.

Hvorfor:
- For å håndtere brukerens samtykke på en strukturert måte.
- Oppdaterer meldingslisten for å gi brukeren en respons basert på valget.
- Starter en ny chat og lagrer meldinger hvis brukeren gir samtykke.

Returnerer:
- Ingen returverdi (funksjonen er void), men oppdaterer state og meldingslisten.
*/


import saveMessage from "./saveMessage";

const createConsentMessages = (userConsent, kryssIkon) => { // Funksjon for å lage meldinger basert på brukerens samtykke
  const userMsg = {
    sender: "user",
    text: userConsent
      ? "Ja, jeg samtykker."
      : "Nei, jeg ønsker ikke lagring.",
  };

  const botMsg1 = { // Meldingen fra boten som forklarer prosessen videre
    sender: "bot",
    jsx: (
      <>
        Den er grei😊 La oss først bli litt kjent, før vi ser på hvordan situasjonen din er i dag.
        Deretter utforsker vi hva som motiverer deg og gir deg mening, med inspirasjon fra Ikigai - en japansk metode. 
        Ved å trykke { " " }  <img src={kryssIkon} alt="kryss" style={{ width: "20px", verticalAlign: "middle" }} />
        { " " }, vil du få en oppsummering av samtalen vår.
        Du kan avslutte samtalen når du vil, men for best utbytte anbefaler vi å ta deg tid.
      </>
    ),
  };

  const botMsg2 = { // Meldingen fra boten som introduserer seg selv
    sender: "bot",
    text: " Men først! Mitt navn er SoftAi, hva heter du?",
  };

  return { userMsg, botMsg1, botMsg2 };
};

const handleConsent = async (userConsent, setConsent, setMessages, startNewChat, chatId, kryssIkon) => { // Funksjon for å håndtere brukerens samtykke
  setConsent(userConsent); 

  const { userMsg, botMsg1, botMsg2 } = createConsentMessages(userConsent, kryssIkon);

  setMessages((prev) => [...prev, userMsg, botMsg1, botMsg2]); // Oppdaterer meldingslisten med brukerens og botens meldinger

  if (userConsent) { // Hvis brukeren gir samtykke
    try {
      await startNewChat();

      if (chatId) { // Hvis chatId er definert
        saveMessage(chatId, userConsent, userMsg);
        saveMessage(chatId, userConsent, botMsg1);
        saveMessage(chatId, userConsent, botMsg2);
      } else {  // Hvis chatId ikke er definert
        console.error("chatId er ikke definert. Meldinger kan ikke lagres.");
      }
    } catch (error) { // Logger feil under oppstart av ny chat eller lagring av meldinger
      console.error("Feil under oppstart av ny chat eller lagring av meldinger:", error);
    }
  }
};

export default handleConsent;