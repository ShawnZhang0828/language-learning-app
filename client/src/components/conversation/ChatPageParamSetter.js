import React from 'react'
import { useParams } from 'react-router-dom'

import ChatPage from './ChatPage'

function ChatPageParamSetter() {
    var { type } = useParams();

    var sender, responder;
    var roleSwitchable = true;

    switch (type) {
        case 'Restaurant':
            sender = "Customer";
            responder = "Waiter";
            break;
        case 'Clinic':
            sender = "Patient";
            responder = "Doctor";
            break;
        case 'School':
            sender = "Student";
            responder = "Teacher"
            break;
        case 'Market':
            sender = "Customer";
            responder = "Waiter";
            break;
        default:
            sender = "Learner";
            responder = "ChatBot";
            roleSwitchable = false;
    }

    return (
        <ChatPage initSender={sender} initResponder={responder} scenario={type} roleSwitchable={roleSwitchable} />
    )
}

export default ChatPageParamSetter