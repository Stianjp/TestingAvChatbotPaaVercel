/*
Funksjonen copyToClipboard kopierer en gitt tekst (chatId) til utklippstavlen ved hjelp av Clipboard API.

Input:
- chatId: En streng som representerer teksten som skal kopieres (i dette tilfellet en Chat-ID).
- setCopySuccess: En funksjon som oppdaterer en state for å vise en suksessmelding når kopieringen er vellykket.

Hva funksjonen gjør:
1. Sjekker om Clipboard API er tilgjengelig:
   - Bruker navigator.clipboard og navigator.clipboard.writeText for å bekrefte at nettleseren støtter kopiering til utklippstavlen.
2. Hvis Clipboard API er tilgjengelig:
   - Kopierer chatId til utklippstavlen ved hjelp av navigator.clipboard.writeText.
   - Hvis kopieringen er vellykket:
     - Oppdaterer setCopySuccess med meldingen "Chat-ID kopiert!".
     - Tilbakestiller meldingen etter 2 sekunder ved hjelp av setTimeout.
   - Hvis kopieringen mislykkes:
     - Logger en feilmelding til konsollen.
3. Hvis Clipboard API ikke er tilgjengelig:
   - Logger en advarsel til konsollen om at Clipboard API ikke er støttet.

Hvorfor:
- For å gi brukeren en enkel måte å kopiere Chat-ID til utklippstavlen.
- Viser en suksessmelding for å bekrefte at handlingen ble utført.
- Håndterer tilfeller der Clipboard API ikke er tilgjengelig, for å unngå feil.

Returnerer:
- Ingen returverdi (funksjonen er void), men oppdaterer state via setCopySuccess og logger meldinger til konsollen.
*/

const copyToClipboard = (chatId, setCopySuccess) => {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") { // Sjekker om Clipboard API er tilgjengelig
    navigator.clipboard.writeText(chatId) // Kopierer chatId til utklippstavlen
      .then(() => {
        setCopySuccess("Chat-ID kopiert!"); // Oppdaterer state for å vise suksessmelding
        console.log("Chat-ID kopiert til utklippstavlen:", chatId); // Logger suksess
        setTimeout(() => setCopySuccess(""), 2000); // Tilbakestiller meldingen etter 2 sekunder
      })
      .catch((err) => { // Håndterer feil ved kopiering
        console.error("Feil ved kopiering av Chat-ID:", err); 
      });
  } else { // Hvis Clipboard API ikke er tilgjengelig
    console.warn("Clipboard API ikke tilgjengelig.");
  }
};

export default copyToClipboard;