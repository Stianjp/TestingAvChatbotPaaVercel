import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const filePath = path.join("data", "userData.json");

// Endepunkt for å tømme `userData.json`
router.post("/", (req, res) => {
  try {
    fs.writeFileSync(filePath, "[]", "utf-8"); // Tøm filen ved å skrive en tom array
    console.log("✅ userData.json tømt ved refresh");
    res.json({ message: "✅ Data slettet ved refresh." });
  } catch (error) {
    console.error("❌ Feil ved tømming av userData.json:", error);
    res.status(500).json({ error: "Kunne ikke tømme datafilen." });
  }
});

export default router;