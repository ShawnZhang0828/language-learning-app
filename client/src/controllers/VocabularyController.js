import axios from 'axios';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

import { auth, database } from './FirebaseController';

import Word from '../models/word'

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
            var timeStamp = getFormattedCurrentDate();

            const userId = user.uid;
            const userRef = database.collection("vocabulary").doc(userId);

            await userRef.update({
                words: firebase.firestore.FieldValue.arrayUnion(
                    {
                        word: vocabularyData.word,
                        translation: vocabularyData.translation,
                        note: vocabularyData.note,
                        level: response.data.level,
                        example: response.data.example,
                        time: timeStamp
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

const getAllVocabulary = async () => {
    const user = auth.currentUser;

    if (user) {
        const userId = user.uid;
        const userRef = database.collection("vocabulary").doc(userId);

        try {
            const docSnapshot = await userRef.get();
            if (docSnapshot.exists) {
                var words = docSnapshot.data().words;
                
                return words.map(word => {return new Word(word.word, word.translation, word.level, word.example, word.note, word.time)});
            } else {
                throw new Error(`${userId} document does not exist.`);
            }
        }
        catch(error) {
            console.error("Error getting all vocabulary: ", error);
        }
    } else {
        console.error("user does not exist");
        return [];
    }
}

const getFormattedCurrentDate = () => {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en', { month: 'short' });
    var month = formatter.format(date);
    var day = date.getDate();
    var year = date.getFullYear();
    var timeStamp = `${month}. ${day}, ${year}`;

    return timeStamp
}

export { addNewWord, getAllVocabulary };