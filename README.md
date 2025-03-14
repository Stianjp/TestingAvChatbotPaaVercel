# TestingAvChatbotPaaVercel
Opprett en .env.local fil i mappen Frontend og legg til:
REACT_APP_OPENAI_API_KEY="" # Legg til din OpenAI API nøkkel

# Viktig
Husk å legge til .env.local i .gitignore filen - denne skal ligge i mappen Frontend. .gitignore skal se slik ut:
.vercel
.env
.env*.local
.vercel_build_output
.env.local


# Kjøre kode
For å kjøre koden, skriv følgende kommandoer i terminalen:
Startes fra Frondend: 
npm run build (kjøres første gang)
npm start

hvis det feiler, kjør: 
npm install
npm run build
npm start

OG 
Fra root mappen (TestingAvChatbotPaaVercel):
node proxy.js
