const copyToClipboard = (chatId, setCopySuccess) => {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    navigator.clipboard.writeText(chatId)
      .then(() => {
        setCopySuccess("Chat-ID kopiert!");
        setTimeout(() => setCopySuccess(""), 2000);
      })
      .catch((err) => {
        console.error("Feil ved kopiering av Chat-ID:", err);
      });
  } else {
    console.warn("Clipboard API ikke tilgjengelig.");
  }
};

export default copyToClipboard;