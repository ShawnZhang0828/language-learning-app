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

            var level = response.data.level

            await userRef.update({
                [level]: firebase.firestore.FieldValue.arrayUnion(
                    {
                        word: vocabularyData.word,
                        translation: vocabularyData.translation,
                        note: vocabularyData.note,
                        example: response.data.example,
                        time: timeStamp
                    }
                )} 
            );
            console.log(`Updated vocabulary collection - ${vocabularyData.word}`);
            return { status: 1, message: "" };
        }
    }
    catch(error) {
        console.error("Error adding vocabulary", error);
        return { status: 0, message: "We encountered an error when adding the word" };
    };
}

const getAllVocabulary = async (levelDict = false) => {
    const user = auth.currentUser;

    if (user) {
        const userId = user.uid;
        const userRef = database.collection("vocabulary").doc(userId);

        try {
            const docSnapshot = await userRef.get();
            if (docSnapshot.exists) {
                // Example: {"1": [Word, Word, ...], "2": [Word, ...]}
                var words = docSnapshot.data();

                // If a dictionary is requested (for vocabulary quiz)
                var levelWords = {};
                for (var key in words) {
                    levelWords[key] = words[key].map(word => {return new Word(word.word, word.translation, key, word.example, word.note, word.time)});
                }

                if (levelDict) {
                    return levelWords;
                } else {
                    return Object.values(levelWords).flat();
                }
            } else {
                throw new Error(`${userId} document does not exist.`);
            }
        }
        catch(error) {
            console.error("Error getting all vocabulary: ", error);
            return []
        }
    } else {
        console.error("user does not exist");
        return [];
    }
}

const updateWordInformation = async (word) => {
    const user = auth.currentUser;

    if (user) {
        const userId = user.uid;
        const userRef = database.collection("vocabulary").doc(userId);

        try {
            const docSnapshot = await userRef.get();
            if (docSnapshot.exists) {
                var words = docSnapshot.data();

                var oldLevel = null;
                var levelWords = [];
                var index = 0;
                for (var level in words) {
                    levelWords = words[level];
                    var wordToRemove = levelWords.find(w => w.word === word.word);
                    if (wordToRemove) {
                        oldLevel = level;
                        break;
                    }
                    index++;
                }

                if (oldLevel != word.level) {
                    console.log("Word level changed, deleting the old one...");
                    await userRef.update({
                        [oldLevel]: firebase.firestore.FieldValue.arrayRemove(wordToRemove)
                    });
                    await userRef.update({
                        [word.level]: firebase.firestore.FieldValue.arrayUnion(
                            {
                                word: word.word,
                                translation: word.translation,
                                note: word.note,
                                example: word.example,
                                time: getFormattedCurrentDate()
                            }
                        )} 
                    )
                } else {
                    console.log(word.example);
                    levelWords[index].translation = word.translation;
                    levelWords[index].note = word.note;
                    levelWords[index].time = getFormattedCurrentDate();
                    await userRef.update({
                        [oldLevel]: levelWords
                    });
                }
                console.log(`${word.word} successfully updated.`);
                return { status: 1, message: "" };
            } else {
                throw new Error(`${userId} document does not exist.`);
            }
        }
        catch(error) {
            console.error("Error updating word: ", error);
            return { status: 0, message: `We encountered an error when updating ${word.word}` };
        }
    } else {
        console.error("user does not exist");
        return { status: 0, message: "User not exist" };
    }
}

const removeWord = async (word) => {
    const user = auth.currentUser;

    if (user) {
        const userId = user.uid;
        const userRef = database.collection("vocabulary").doc(userId);

        try {
            const docSnapshot = await userRef.get();
            if (docSnapshot.exists) {
                var words = docSnapshot.data();

                var existLevel = null;
                var levelWords = [];
                for (var level in words) {
                    levelWords = words[level];
                    var wordToRemove = levelWords.find(w => w.word === word.word);
                    if (wordToRemove) {
                        existLevel = level;
                        break;
                    }
                }

                console.log("Word level changed, deleting the old one...");
                await userRef.update({
                    [existLevel]: firebase.firestore.FieldValue.arrayRemove(wordToRemove)
                });
                console.log(`${word.word} successfully removed.`);
                return { status: 1, message: "" };
            } else {
                throw new Error(`${userId} document does not exist.`);
            }
        }
        catch(error) {
            console.error("Error removing word: ", error);
            return { status: 0, message: `We encountered an error when removing ${word.word}` };
        }
    } else {
        console.error("user does not exist");
        return { status: 0, message: "User not exist" };
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

export { addNewWord, getAllVocabulary, updateWordInformation, removeWord };