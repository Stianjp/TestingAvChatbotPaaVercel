// src/components/Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { initialMessage } from "../Prompts/chatbotEmpaticPrompt";
import "../styles/Chatbot.css";
import logo from "../..public/logo.png";
import miniLogo from "../..public/MH_logo.png";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hei! Hvordan kan jeg hjelpe deg?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);

    setMessages(prev => [...prev, { sender: "bot", text: "..." }]); // Loading indicator
    setInput("");

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      
      const data = await response.json();

      setMessages(prev => {
        let newMessages = [...prev];
        newMessages = newMessages.filter(m => m.text !== "..."); // Fjern loading indicator
        return [...newMessages, { sender: "bot", text: data.response }];
      });

    } catch (error) {
      console.error("Feil under henting av svar:", error);
      setMessages(prev => [...prev, { sender: "bot", text: "Beklager, noe gikk galt." }]);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.sender === "bot" && (
              <img src={miniLogo} alt="Bot" className="bot-avatar" />
            )}
            <div>{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Skriv melding..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div> // Lukker div-elementet her
  );
};

export default Chatbot;
