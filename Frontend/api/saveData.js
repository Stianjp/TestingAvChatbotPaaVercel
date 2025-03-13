import { v4 as uuidv4 } from "uuid";  // Installer med: npm install uuid

const activeChats = {}; // Midlertidig lagring av samtaler

export default function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Tillat alle domener
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    if (req.method === "POST") {
        if (req.url === "/api/saveData/start") {
            const chatId = uuidv4();
            activeChats[chatId] = [];
            return res.status(200).json({ message: "✅ Ny samtale startet", chatId });
        }

        if (req.url === "/api/saveData/save") {
            const { chatId, sender, text } = req.body;
            if (!chatId || !activeChats[chatId]) {
                return res.status(400).json({ error: "Ugyldig eller manglende chatId." });
            }
            activeChats[chatId].push({ sender, text, timestamp: new Date().toISOString() });
            return res.json({ message: "✅ Meldingen er lagret midlertidig.", chatId });
        }
    }

    if (req.method === "GET") {
        if (req.url.startsWith("/api/saveData/")) {
            const chatId = req.url.split("/").pop();
            if (!chatId || !activeChats[chatId]) {
                return res.status(404).json({ error: "Chat not found." });
            }
            return res.json({ chatId, messages: activeChats[chatId] });
        }
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}
