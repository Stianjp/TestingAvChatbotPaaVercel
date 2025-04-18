const scrollToBottom = (messagesEndRef) => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
};

export default scrollToBottom;