import axios from 'axios';

import { getAllVocabulary } from "./VocabularyController";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const getVocabularyQuizQuestions = async (difficulty, numberOfQuestions) => {
    var vocabularyLevelDict = await getAllVocabulary(true);

    // Return all words if not enough words for number of questions
    var totalWords = 0;
    Object.values(vocabularyLevelDict).forEach(words => totalWords += words.length);
    if (totalWords <= numberOfQuestions) {
        return Object.values(vocabularyLevelDict).flat();
    }

    // Get words from each level based on difficulty
    var percentageFromEachLevel;
    switch (difficulty) {
        case 1:
            percentageFromEachLevel = [0.3, 0.3, 0.2, 0.1, 0.1];
            break;
        case 2:
            percentageFromEachLevel = [0.2, 0.3, 0.3, 0.1, 0.1];
            break;
        case 3:
            percentageFromEachLevel = [0.2, 0.2, 0.2, 0.2, 0.2];
            break;
        case 4:
            percentageFromEachLevel = [0.1, 0.1, 0.3, 0.3, 0.2];
            break;
        case 5:
            percentageFromEachLevel = [0.1, 0.1, 0.2, 0.3, 0.3];
            break;
    }

    // Get questions from each level
    var questions = [];
    var level = 1;
    var insufficientWords = 0;
    // Loop until sufficient questions are collected
    while (questions.length !== numberOfQuestions) {
        var currentQuestionNumber = numberOfQuestions * percentageFromEachLevel[level - 1];
        var availableQuestions = vocabularyLevelDict[level.toString()];

        if (currentQuestionNumber > availableQuestions.length) {
            // If words from this level is not enough, ask later levels
            insufficientWords += (currentQuestionNumber - availableQuestions.length);
            // Add all available words if any
            if (availableQuestions.length > 0) {
                questions = questions.concat(availableQuestions);
            }
            // Ensure second round is only for insufficient words
            percentageFromEachLevel[level - 1] = 0;
        } else {
            // Get randoms words from arailable ones, get more if previous levels don't have enough words
            var neededQuestions = currentQuestionNumber + insufficientWords;
            var currentQuestions = getRandomElementsFromArray(availableQuestions, neededQuestions);
            insufficientWords -= (currentQuestions.length - currentQuestionNumber);
            questions = questions.concat(currentQuestions);
            // Remove words that have been collected
            vocabularyLevelDict[level.toString()] = availableQuestions.filter(word => !currentQuestions.includes(word));
            // Ensure second round is only for insufficient words
            percentageFromEachLevel[level - 1] = 0;
        }

        // WORST CASE: 1 -> 2 -> 3 -> 4 -> 5 -> 1 -> 2 -> 3 -> 4 -> END 
        if (level === 5) {
            level = 1;
        } else {
            level++;
        }
    }

    console.log(`Quiz questions obtained - ${questions}`);

    return questions;
}

const getFeedback = async (answers, originLanguage, targetLanguage) => {
    try {
        var requestBody = {
            answers: answers,
            originLanguage: originLanguage,
            targetLanguage: targetLanguage
        }
        const response = await axios.post(`${BACKEND_URL}/vocabulary/quiz-feedback`, requestBody);

        console.log(`Quiz feedback obtained - ${response.data.corrections}`);
        return { status: 1, message: "Answers evaluated successfully.", response: response.data.corrections }; 
    }
    catch(error) {
        console.error("Error adding vocabulary", error);
        return { status: 0, message: "We encountered an error when evaluating the answers.", response: "" };
    };
}

const getRandomElementsFromArray = (words, numberOfWords) => {
    // Shuffle words array and pick first n elements
    const shuffledWords = words.sort(() => 0.5 - Math.random());
    return shuffledWords.slice(0, numberOfWords);
}

export { getVocabularyQuizQuestions, getFeedback }