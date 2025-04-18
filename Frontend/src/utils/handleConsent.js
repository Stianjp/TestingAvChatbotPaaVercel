import saveMessage from "./saveMessage";

const createConsentMessages = (userConsent, kryssIkon) => {
  const userMsg = {
    sender: "user",
    text: userConsent
      ? "Ja, jeg samtykker."
      : "Nei, jeg ønsker ikke lagring.",
  };

  const botMsg1 = {
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

  const botMsg2 = {
    sender: "bot",
    text: " Men først! Mitt navn er SoftAi, hva heter du?",
  };

  return { userMsg, botMsg1, botMsg2 };
};

const handleConsent = async (userConsent, setConsent, setMessages, startNewChat, chatId, kryssIkon) => {
  setConsent(userConsent);

  const { userMsg, botMsg1, botMsg2 } = createConsentMessages(userConsent, kryssIkon);

  setMessages((prev) => [...prev, userMsg, botMsg1, botMsg2]);

  if (userConsent) {
    try {
      await startNewChat();

      if (chatId) {
        saveMessage(chatId, userConsent, userMsg);
        saveMessage(chatId, userConsent, botMsg1);
        saveMessage(chatId, userConsent, botMsg2);
      } else {
        console.error("❌ chatId er ikke definert. Meldinger kan ikke lagres.");
      }
    } catch (error) {
      console.error("❌ Feil under oppstart av ny chat eller lagring av meldinger:", error);
    }
  }
};

export default handleConsent;