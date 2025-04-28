/**
 * Teller antall spørsmål som er besvart i en samtale.
 * @param {Array} messages - Listen over meldinger i samtalen.
 * @returns {number} - Antall meldinger fra brukeren.
 */
const countUserMessages = (messages) => {
  return messages.filter((msg) => msg.sender === "user").length;
};

export default countUserMessages;