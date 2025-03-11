// chatbotApi.js

import axios from "axios";

const API_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_BASE_URL_PRODUCTION
  : process.env.REACT_APP_API_BASE_URL_DEVELOPMENT;

export const saveData = async (consent, messages) => {
  try {
    const response = await axios.post(`${API_URL}/api/saveData`, {
      consent,
      data: messages,
    });
    console.log("Lagringsresultat:", response.data);
  } catch (error) {
    console.error("Feil ved lagring:", error);
  }
};

export const clearBackendData = async () => {
  try {
    const response = await axios.delete(`${API_URL}/api/clearData`);
    console.log("Sletting av data:", response.data);
  } catch (error) {
    console.error("Feil ved sletting av data:", error);
  }
};

// (Valgfritt) Du kan fjerne analyzeUserData og reanalyzeUserData 
// helt hvis du ikke skal bruke dem i det nye oppsettet.