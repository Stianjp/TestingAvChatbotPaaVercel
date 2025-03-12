import React from "react";
import ReactDOM from "react-dom/client";
import Chatbot from "./components/Chatbot"; // Sørg for at denne peker til App.jsx

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Chatbot />
  </React.StrictMode>
);
