/*
Funksjonen scrollToBottom sørger for at grensesnittet automatisk scroller til bunnen av en meldingsliste.

Input:
- messagesEndRef: En referanse til det siste elementet i meldingslisten. Dette er vanligvis en React ref som peker til en <div> eller et annet DOM-element.

Hva funksjonen gjør:
1. Sjekker om referansen er definert:
   - Hvis "messagesEndRef.current" eksisterer, betyr det at referansen peker til et gyldig DOM-element.

2. Utfører scrolling:
   - Kaller scrollIntoView på elementet som referansen peker til.
   - Bruker { behavior: "smooth" } for å gi en jevn scroll-animasjon.

Hvorfor:
- For å forbedre brukeropplevelsen ved å automatisk scrolle til bunnen av meldingslisten når nye meldinger legges til.
- Dette sikrer at brukeren alltid ser de nyeste meldingene uten å måtte scrolle manuelt.

Returnerer:
- Ingen returverdi (funksjonen er void).
*/

const scrollToBottom = (messagesEndRef) => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" }); // Ruller til bunnen av meldingslisten
  }
};

export default scrollToBottom;