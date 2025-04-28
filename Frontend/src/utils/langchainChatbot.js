/*
Funksjonen askChatbot sender en samtale og en systemprompt til OpenAI's GPT API og returnerer et generert svar.

Input:
- conversationMessages: En liste med meldinger som representerer samtalen mellom brukeren og boten. Hver melding har følgende struktur:
  - role: Angir rollen til avsenderen ("user", "assistant", eller "system").
  - content: Selve teksten i meldingen.
- systemPrompt: En tekststreng som gir GPT-modellen instruksjoner om hvordan den skal oppføre seg og svare.

Hva funksjonen gjør:
1. Henter API-nøkkelen:
   - Leser API-nøkkelen fra miljøvariabelen REACT_APP_OPENAI_API_KEY.
   - Kaster en feil hvis API-nøkkelen mangler.

2. Sender en forespørsel til OpenAI's GPT API:
   - Bruker fetch for å sende en POST-forespørsel til https://api.openai.com/v1/chat/completions.
   - Inkluderer følgende i forespørselen:
     - model: Angir hvilken GPT-modell som skal brukes (i dette tilfellet gpt-4o).
     - messages: En liste som kombinerer systemPrompt som en systemmelding og conversationMessages som brukermeldinger.

3. Håndterer API-responsen:
   - Leser JSON-responsen fra API-et.
   - Kaster en feil hvis API-responsen ikke er vellykket.
   - Returnerer innholdet i det genererte svaret (data.choices[0].message.content).

4. Håndterer feil:
   - Kaster en feil hvis API-nøkkelen mangler eller hvis API-forespørselen mislykkes.

Hvorfor:
- For å generere svar fra OpenAI's GPT-modell basert på en samtale og en systemprompt.
- Gir en fleksibel måte å kommunisere med GPT-modellen på, ved å kombinere systeminstruksjoner og brukerinteraksjoner.


Feilhåndtering:
- Hvis API-nøkkelen mangler:
  - Kaster en feil: "API key is missing. Please set the REACT_APP_OPENAI_API_KEY environment variable."
- Hvis API-forespørselen mislykkes:
  - Kaster en feil med meldingen fra API-et, f.eks.: "API-feil: Invalid API key."

Returnerer:
- ingen
*/

export const askChatbot = async (conversationMessages, systemPrompt) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("API key is missing. Please set the REACT_APP_OPENAI_API_KEY environment variable.");
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationMessages,
      ],
    }),
  });
  
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`API-feil: ${data.error.message}`);
  }

  return data.choices[0].message.content;
};