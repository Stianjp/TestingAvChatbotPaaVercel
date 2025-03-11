// src/components/Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  initialMessage,
  phaseOnePrompt,
  phaseTwoPrompt,
} from "../Prompts/chatbotEmpaticPrompt";
import "../styles/Chatbot.css";
import "../styles/App.css";
import { askChatbot } from "../utils/langchainChatbot";
import logo from "../media/logo.png";
import miniLogo from "../media/MH_logo.png";
import { IoClose } from "react-icons/io5";

// Bruk Vercel-miljøvariabel for API-kall
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const Chatbot = () => {
  // Meldingshistorikk
  const [messages, setMessages] = useState([
    { sender: "bot", text: initialMessage },
  ]);

  // Samtykke (hvis du fremdeles vil bruke det)
  const [consent, setConsent] = useState(null);

  // Brukerens input + states
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState(null); // ID for samtalen
  const [hoverText, setHoverText] = useState("Klikk for å kopiere ID");
  const [hoverXbottom, setHoverXbottom] = useState("Klikk for å avslutte samtalen");

  // Fase-styring: 1 = kort kartlegging, 2 = dyp motivasjon
  const [phase, setPhase] = useState(1);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    clearData(); // Tøm userData.json når siden lastes inn
    startNewChat(); // Start en ny samtale når chatboten lastes inn
  }, []);

  // Start en ny samtale og hent en ID
  const startNewChat = async () => {
    try {
      const response = await axios.post(`${apiBaseUrl}api/saveData/start`);
      setChatId(response.data.chatId);
      console.log("Ny samtale startet med ID:", response.data.chatId);
    } catch (error) {
      console.error("❌ Feil ved oppstart av chat:", error);
    }
  };

  // Autoscroll / autofokus
  useEffect(() => {
    scrollToBottom();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages]);

  // Tøm userData.json
  const clearData = async () => {
    try {
      await axios.post(`${apiBaseUrl}/api/clearData`);
      console.log("userData.json tømt");
    } catch (error) {
      console.error("❌ Feil ved tømming av userData.json:", error);
    }
  };

  // Send melding
  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    // Legg til brukermelding
    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    saveMessage(userMessage);
    setInput("");
    inputRef.current.style.height = "30px";

    setIsTyping(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.response || "Beklager, jeg forstår ikke helt." },
      ]);

      saveMessage({ sender: "bot", text: data.response });

    } catch (error) {
      console.error("❌ Feil ved henting av svar:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Beklager, noe gikk galt." },
      ]);
    }

    setIsTyping(false);
    setLoading(false);
  };

  // Lagre en melding til backend
  const saveMessage = async (message) => {
    try {
      await axios.post(`${apiBaseUrl}api/saveData/save`, {
        chatId,
        sender: message.sender,
        text: message.text,
      });
    } catch (error) {
      console.error("❌ Feil ved lagring av melding:", error);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <img src={logo} alt="MeyerHaugen" className="logo" />
        <p className="chat-date">
          {new Date().toLocaleDateString("no-NO", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </header>

      <div className="chatbot-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.sender}`}>
            {msg.sender === "bot" ? (
              <img src={miniLogo} alt="Bot" className="bot-avatar" />
            ) : null}
            <div className={`chat-bubble ${msg.sender}`}>{msg.text}</div>
          </div>
        ))}

        {isTyping && (
          <div className="typing-bubble">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <textarea
          ref={inputRef}
          placeholder="Skriv melding her"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          disabled={loading}
          rows={1}
          style={{ resize: "none", minHeight: "30px", maxHeight: "200px", overflowY: "auto" }}
        />
        <button onClick={sendMessage} disabled={loading}>
          ➤
        </button>
        <button title={hoverXbottom}>
          <IoClose />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
