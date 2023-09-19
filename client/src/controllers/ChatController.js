import axios from "axios";

import Message from "../models/message";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const sendMessage = async (
  message,
  language,
  senderRole,
  responderRole,
  scenario
) => {
  try {
    const request = {
      message: message,
      language: language,
      senderRole: senderRole,
      responderRole: responderRole,
      scenario: scenario,
    };

    const response = await axios.post(`${BACKEND_URL}/chat/send`, request);

    return {
      status: 1,
      response: new Message(responderRole, response.data.response),
    };
  } catch (error) {
    console.error("Error sending message", error);
    return {
      status: 0,
      message: "We encountered an error when sending the message",
    };
  }
};

const translateMessage = async (message, targetLanguage) => {
  try {
    const request = {
      message: message,
      targetLanguage: targetLanguage,
    };

    const response = await axios.post(`${BACKEND_URL}/chat/translate`, request);

    return { status: 1, translation: response.data.translation };
  } catch (error) {
    console.error("Error translating message", error);
    return {
      status: 0,
      message: "We encountered an error when translating the message",
    };
  }
};

export { sendMessage, translateMessage };
