import axios from 'axios';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

import { auth, database } from './SignInController';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const addNewWord = async (vocabularyData) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/vocabulary/add`, vocabularyData);

        console.log(response.data);
    
        if (response.data.level === "6") {
            return { status: 0, message: response.data.example };
        } 
    
        const user = auth.currentUser;
    
        if (user) {
            const userId = user.uid;
            const userRef = database.collection("vocabulary").doc(userId);
    
            await userRef.update({
                words: firebase.firestore.FieldValue.arrayUnion(
                    {
                        word: vocabularyData.word,
                        translation: vocabularyData.translation,
                        note: vocabularyData.note,
                        level: response.data.level,
                        example: response.data.example
                    }
                )} 
            )
            console.log(`Updated vocabulary collection - ${vocabularyData.word}`);
            return { status: 1, message: ""};
        }
    }
    catch(error) {
        console.error("Error adding vocabulary", error);
        return { status: 0, message: "We encountered an error when adding the word" };
    };
}

export { addNewWord };