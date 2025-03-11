import express from "express";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";  // Installer uuid: npm install uuid

const router = express.Router();
const basePath = "data"; // Mappe der vi lagrer samtaler

// Midlertidig lagring av aktive samtaler i minnet (tilknyttet ID)
const activeChats = {};

// Start en ny samtale og generer en ID
router.post("/start", (req, res) => {
    const chatId = uuidv4(); // Generer en unik ID
    activeChats[chatId] = []; // Start en tom samtale med denne ID-en

    res.json({ message: "✅ Ny samtale startet", chatId });
});

// Lagre meldinger til en aktiv samtale
router.post("/save", (req, res) => {
    console.log("saveData endpoint called");
    const { chatId, sender, text } = req.body;

    if (!chatId || !activeChats[chatId]) {
        return res.status(400).json({ error: "Ugyldig eller manglende chatId." });
    }

    // Legg til meldingen i minnet
    activeChats[chatId].push({ sender, text, timestamp: new Date().toISOString() });

    res.json({ message: "✅ Meldingen er lagret midlertidig.", chatId });
});

// Fullfør samtalen og lagre den som en JSON-fil
router.post("/finish", (req, res) => {
    const { chatId } = req.body;

    if (!chatId || !activeChats[chatId]) {
        return res.status(400).json({ error: "Ugyldig eller manglende chatId." });
    }

    const chatData = {
        chatId,
        messages: activeChats[chatId],
    };

    // Skriv til en egen fil for denne samtalen
    const filePath = path.join(basePath, `${chatId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(chatData, null, 2));

    // Fjern chatten fra minnet
    delete activeChats[chatId];

    res.json({ message: "✅ Samtalen er lagret som JSON-fil.", chatId, filePath });
});

// Slett en spesifikk samtale basert på ID
router.delete("/delete/:chatId", (req, res) => {
    const { chatId } = req.params;
    const filePath = path.join(basePath, `${chatId}.json`);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.json({ message: `✅ Samtale med ID ${chatId} slettet.` });
    } else {
        res.status(404).json({ error: "Filen finnes ikke." });
    }
});

export default router;