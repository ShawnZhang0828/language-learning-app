import React, { useState, useEffect, useContext, useRef } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  TextField,
  Avatar,
  Popover,
} from "@mui/material";

import {
  sendMessage,
  translateMessage,
} from "../../controllers/ChatController";
import Message from "../../models/message";

import "../../styles/ChatPage.css";
import BackButton from "../common/BackButton";
import { userPreferenceContext } from "../../controllers/PreferenceController";

function ChatPage({ initSender, initResponder, scenario, roleSwitchable }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sender, setSender] = useState(initSender);
  const [responder, setResponder] = useState(initResponder);
  const [translation, setTranslation] = useState("");
  const [translationAnchor, setTranslationAnchor] = useState(null);
  const [translatedMessageIndex, setTranslatedMessageIndex] = useState(0);

  const { userPreference, setUserPreference } = useContext(
    userPreferenceContext
  );

  const chatHistoryEndRef = useRef(null);

  const onSendMessageClick = async () => {
    if (newMessage.trim() !== "") {
      var message = new Message(sender, newMessage);
      setMessages((prevMessages) => [...prevMessages, message]);

      const response = await sendMessage(
        newMessage,
        userPreference["target-language"],
        sender,
        responder,
        scenario
      );
      setMessages((prevMessages) => [...prevMessages, response.response]);
    }
    setNewMessage("");
  };

  const onSwitchRoleClock = () => {
    var temp = sender;
    setSender(responder);
    setResponder(temp);
  };

  const onTranslationRequested = async (message, index, event) => {
    setTranslationAnchor(event.currentTarget);
    setTranslatedMessageIndex(index);
    var response = await translateMessage(
      message,
      userPreference["original-language"]
    );
    setTranslation(response.translation);
  };

  const onTranslationPopOverClose = () => {
    // console.log(translationAnchor)
    setTranslation("");
    setTranslationAnchor(null);
  };

  useEffect(() => {
    async function sendInitialMessage() {
      if (messages.length === 0) {
        const response = await sendMessage(
          "Start with greeting me!",
          userPreference["target-language"],
          sender,
          responder,
          scenario
        );
        setMessages((prevMessages) => [...prevMessages, response.response]);
      }
    }
    sendInitialMessage();
  }, []);

  useEffect(() => {
    chatHistoryEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Switch roles
  return (
    <div id="chat-page-container">
      <BackButton />

      <div id="chat-page-header-container">
        <div className="role-name-container">{responder}</div>
        <button disabled={!roleSwitchable} onClick={onSwitchRoleClock}>
          <img src="/common-icons/swap.png" id="chat-swap-img" />
        </button>
        <div className="role-name-container">{sender}</div>
      </div>

      <List id="chat-history-list">
        {messages.map((message, index) => (
          <div key={index}>
            <ListItem
              key={index}
              className="chat-history-item"
              sx={{
                width: "60%",
                margin: message.sender === sender ? "0 0 0 auto" : "0 auto 0 0",
                display: "flex",
                flexDirection:
                  message.sender === sender ? "row-reverse" : "row",
                textAlign: message.sender === sender ? "right" : "left",
              }}
            >
              <ListItemAvatar>
                <Avatar
                  alt="AI"
                  src={
                    message.sender !== sender
                      ? "/chat-icons/robot.png"
                      : "/chat-icons/human.png"
                  }
                  sx={{
                    float: message.sender === sender ? "right" : "left",
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={message.content}
                onClick={(e) =>
                  onTranslationRequested(message.content, index, e)
                }
              />
              <Popover
                id="translation-popover"
                open={Boolean(translation) && translatedMessageIndex === index}
                onClose={onTranslationPopOverClose}
                anchorEl={translationAnchor}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: message.sender === sender ? "right" : "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: message.sender === sender ? "right" : "left",
                }}
              >
                {translation}
              </Popover>
            </ListItem>
          </div>
        ))}
        <div ref={chatHistoryEndRef} />
      </List>

      <div id="user-chat-input-container">
        <TextField
          id="user-chat-input-box"
          label=""
          multiline
          placeholder="Send a message"
          maxRows={4}
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          sx={{
            width: "70%",
            "& .MuiInputBase-root": {
              padding: "8px 10px",
            },
          }}
        />
        <button onClick={onSendMessageClick}>
          <img
            src="/chat-icons/send-message.png"
            id="send-message-button-img"
          />
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
