return (
    <div className="chat-container">
      <header className="chat-header">
        <img src={logo} alt="MeyerHaugen" className="logo" />
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