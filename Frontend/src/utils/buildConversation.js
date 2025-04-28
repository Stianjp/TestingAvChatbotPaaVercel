/*
Funksjonen buildConversationForGPT tar inn en liste med meldinger (allMessages)
og bygger en strukturert samtale som GPT-modellen kan forstå.

Input: 
- allMessages: En liste med meldinger, der hver melding er et objekt med
  egenskapene:
  - sender: Angir hvem som sendte meldingen ("user" eller "bot").
  - text: Selve teksten i meldingen.

Hva funksjonen gjør:
1. Fjerner meldinger uten tekst (meldinger der `text` er tom eller ikke finnes).
2. Mapper hver melding til et nytt format som GPT-modellen forstår:
   - 'role': Settes til "user" hvis meldingen er fra brukeren, og "assistant" hvis den er fra boten.
   - 'content': Inneholder teksten fra meldingen.

Hvorfor:
- For å sikre at vi bare sender relevante meldinger med faktisk innhold til GPT-modellen.
- Dette reduserer unødvendige data og forbedrer ytelsen.
- Det kan også redusere kostnadene ved API-kall.

Returnerer: 
- En liste som kan brukes direkte for å sende samtalen til GPT-modellen.
*/

const extractTextFromJSX = (jsx) => {
  // Hvis JSX er en liste, trekk ut teksten fra hvert element
  if (Array.isArray(jsx.props.children)) {
    return jsx.props.children.map((child) => (typeof child === "string" ? child : "")).join(", ");
  }
  return typeof jsx === "string" ? jsx : "Listeinnhold";
};

const buildConversationForGPT = (allMessages) => {
  return allMessages
    .filter((m) => m.text || m.jsx) // Inkluder meldinger med tekst eller JSX
    .map((m) => ({
      role: m.sender === "bot" ? "assistant" : "user",
      content: m.text || (m.jsx ? extractTextFromJSX(m.jsx) : ""), // Konverter JSX til tekst
    }));
};

export default buildConversationForGPT;