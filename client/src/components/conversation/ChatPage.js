import React, { useState, useEffect, useContext } from 'react'
import { List, ListItem, ListItemText, ListItemAvatar, TextField } from '@mui/material'

import { sendMessage } from '../../controllers/ChatController'
import Message from '../../models/message'

import '../../styles/ChatPage.css'
import BackButton from '../common/BackButton'
import { userPreferenceContext } from '../../controllers/PreferenceController';

function ChatPage({ sender, responder, scenario, roleSwitchable }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const { userPreference, setUserPreference } = useContext(userPreferenceContext);

    const onSendMessageClick = async () => {
        if (newMessage.trim() !== "") {
            const message = new Message(sender, newMessage);
            setMessages(prevMessages => [...prevMessages, message]);

            const response = await sendMessage(newMessage, userPreference["target language"], sender, responder, scenario);
            setMessages(prevMessages => [...prevMessages, response.response]);
        }
        setNewMessage("");
    }

    useEffect(() => {
        async function sendInitialMessage() {
            if (messages.length === 0) {
                const message = await sendMessage("Start with greeting me!", userPreference["target language"], sender, responder, scenario);
                setMessages(prevMessages => [...prevMessages, message.response]);
            }
        }
        sendInitialMessage();
    }, []);

    useEffect(() => {
        console.log(messages)
    }, [messages]);

    // Switch roles
    return (
        <div id='chat-page-container'>
            <BackButton />

            <div id='chat-page-header-container'>
                <div>{responder}</div>
                <button disabled={!roleSwitchable}>  
                    <img src='/common-icons/swap.png' id='chat-swap-img' />
                </button>
                <div>{sender}</div>
            </div>

            <List id='chat-history-list'>
                {messages.map((message, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={message.content}/>
                    </ListItem>
                ))}
            </List>

            <div id='user-chat-input-container'>
                <TextField
                    id="user-chat-input-box"
                    label=""
                    multiline
                    placeholder='Send a message'
                    maxRows={4}
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    sx={{ 
                            width: "70%",
                            '& .MuiInputBase-root': {
                                padding: "8px 10px"
                            }
                        }}
                />
                <button onClick={onSendMessageClick}>
                    <img src='/chat-icons/send-message.png' id='send-message-button-img'/>
                </button>
            </div>
            
        </div>
    )
}

export default ChatPage