import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App"; // Sørg for at denne peker til App.jsx

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
