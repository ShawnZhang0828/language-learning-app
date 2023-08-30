import React, { useState, useEffect, useContext } from 'react'
import { List, ListItem, ListItemText, ListItemAvatar, TextField, Avatar } from '@mui/material'

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
            var message = new Message(sender, newMessage);
            setMessages(prevMessages => [...prevMessages, message]);

            const response = await sendMessage(newMessage, userPreference["target language"], sender, responder, scenario);
            setMessages(prevMessages => [...prevMessages, response.response]);
        }
        setNewMessage("");
    }

    useEffect(() => {
        async function sendInitialMessage() {
            if (messages.length === 0) {
                const response = await sendMessage("Start with greeting me!", userPreference["target language"], sender, responder, scenario);
                setMessages(prevMessages => [...prevMessages, response.response]);
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
                    <ListItem 
                        key={index} 
                        className='chat-history-item'
                        sx={{
                            width: "60%",
                            float: message.sender === sender ? 'right' : 'left',
                            flexDirection: message.sender === sender ? 'row-reverse' : 'row',
                            textAlign: message.sender === sender ? 'right' : 'left'
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar 
                                alt='AI' 
                                src={message.sender !== sender ? '/chat-icons/robot.png' : '/chat-icons/human.png'}
                                sx={{
                                    float: message.sender === sender ? 'right' : 'left'
                                }}
                            />
                        </ListItemAvatar>
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