// src/components/Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  initialMessage,
  phaseOnePrompt,
  phaseTwoPrompt,
} from "../data/chatbotPrompts";
import "../styles/Chatbot.css";
import { askChatbot } from "../utils/langchainChatbot";
import logo from "../media/logo.png";
import miniLogo from "../media/MH_logo.png";
import { IoClose } from "react-icons/io5";
import { supabase } from "../supabaseClient";

// Bruker miljøvariabel for API-kall
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: initialMessage },
  ]);
  const [consent, setConsent] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [chatEnded, setChatEnded] = useState(false);
  const [isFinishingChat, setIsFinishingChat] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const [questionCount, setQuestionCount] = useState(0);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (consent) {
      startNewChat();
    }
  }, [consent]);

  const startNewChat = async () => {
    try {
      const { data, error } = await supabase
        .from("chats")
        .insert([{ status: "active" }])
        .select()
        .single();

      if (error) throw error;

      setChatId(data.id);
      console.log("✅ Ny samtale startet med ID:", data.id);
    } catch (error) {
      console.error("❌ Feil ved oppstart av chat:", error);
    }
  };

  useEffect(() => {
    scrollToBottom();
    if (inputRef.current) inputRef.current.focus();
  }, [messages]);

  const handleConsent = async (userConsent) => {
    setConsent(userConsent);

    const userMsg = {
      sender: "user",
      text: userConsent
        ? "Ja, jeg samtykker."
        : "Nei, jeg ønsker ikke lagring.",
    };
    const botMsg = {
      sender: "bot",
      text: "Tusen takk! Mitt navn er SoftAI, hva heter du?",
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);

    if (userConsent) {
      await startNewChat();
      saveMessage(userMsg);
      saveMessage(botMsg);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    saveMessage(userMessage);
    setInput("");

    setIsTyping(true);

    setTimeout(async () => {
      let botReply = "";
      const conversationMessages = buildConversationForGPT([
        ...messages,
        userMessage,
      ]);

      let systemPrompt = questionCount < 5 ? phaseOnePrompt : phaseTwoPrompt;
      botReply = await askChatbot(conversationMessages, systemPrompt);

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
      saveMessage({ sender: "bot", text: botReply });

      setQuestionCount((prevCount) => prevCount + 1);
      setIsTyping(false);
      setLoading(false);
    }, 500);
  };

  const saveMessage = async (message) => {
    if (!chatId || consent === false) {
      console.warn("⚠️ Meldinger lagres ikke: enten chatId ikke klar eller ikke samtykket.");
      return;
    }

    try {
      const { error } = await supabase
        .from("messages")
        .insert([{ chat_id: chatId, sender: message.sender, text: message.text }]);

      if (error) throw error;
    } catch (error) {
      console.error("❌ Feil ved lagring av melding:", error);
    }
  };

  const finishChat = async () => {
    if (isFinishingChat) return;
    setIsFinishingChat(true);

    try {
      if (consent !== false && chatId) {
        const { error } = await supabase
          .from("chats")
          .update({ status: "finished" })
          .eq("id", chatId);

        if (error) throw error;
      }
    } catch (error) {
      console.error("❌ Feil ved oppdatering av samtalestatus:", error);
    }

    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Takk for samtalen!😊 Ha en fin dag videre!" },
    ]);
    setChatEnded(true);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(chatId).then(
      () => {
        setCopySuccess("Chat-ID kopiert!");
        setTimeout(() => setCopySuccess(""), 2000);
      },
      (err) => {
        console.error("Feil ved kopiering av Chat-ID:", err);
      }
    );
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <img src={logo} alt="MeyerHaugen" className="logo" />
        {chatId && (
          <p className="chat-id" onClick={copyToClipboard} style={{ cursor: "pointer" }}>
            Chat-ID: {chatId} (Klikk for å kopiere)
          </p>
        )}
        {copySuccess && <p className="copy-success">{copySuccess}</p>}
        <p className="chat-date">
          {new Date().toLocaleDateString("no-NO", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </header>

      <div className="chatbot-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.sender}`}>
            {msg.sender === "bot" && (
              <img src={miniLogo} alt="Bot" className="bot-avatar" />
            )}
            <div className={`chat-bubble ${msg.sender}`}>{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {consent === null && (
        <div className="consent-buttons">
          <button className="accept" onClick={() => handleConsent(true)}>
            Godta
          </button>
          <button className="decline" onClick={() => handleConsent(false)}>
            Avslå
          </button>
        </div>
      )}

      {consent !== null && !chatEnded && (
        <div className="chat-input">
          <textarea
            ref={inputRef}
            placeholder="Skriv melding her"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            disabled={loading}
            rows={1}
          />
          <button onClick={sendMessage} disabled={loading}>
            ➤
          </button>
          <button onClick={finishChat} disabled={isFinishingChat}>
            <IoClose />
          </button>
        </div>
      )}
    </div>
  );
};

function buildConversationForGPT(allMessages) {
  return allMessages.map((m) => ({
    role: m.sender === "bot" ? "assistant" : "user",
    content: m.text,
  }));
}

export default Chatbot;
