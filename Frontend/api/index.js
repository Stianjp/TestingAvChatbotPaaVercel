import express from "express";
import cors from "cors";

const app = express();

// 🚀 Tillat CORS for alle domener ELLER spesifikt frontend-domenet
app.use(
  cors({
    origin: "https://frontend-5uybf8k58-stianjps-projects.vercel.app", // Endre dette til riktig frontend-URL
    methods: "GET,POST,DELETE",
    allowedHeaders: "Content-Type",
  })
);

// Legg til flere API-ruter her...
app.get("/api", (req, res) => {
  res.json({ message: "🚀 API fungerer!" });
});