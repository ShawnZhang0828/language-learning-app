import React, { useState, useContext } from 'react'
import { useNavigate  } from 'react-router-dom';

import { getFeedback, getVocabularyQuizQuestions } from '../../controllers/VocabularyQuizController';

import "../../styles/VocabularyQuiz.css"
import QuizOption from '../common/QuizOption';
import VocabularyQuizCard from './VocabularyQuizCard';
import BackButton from '../common/BackButton';
import { userPreferenceContext } from '../../controllers/PreferenceController';

function VocabularyQuiz() {

    const [quizStarted, setQuizStarted] = useState(false);
    const [firstSetAnswer, setFirstSetAnswer] = useState({});
    const [secondSetAnswer, setSecondSetAnswer] = useState({});
    const [firstQuestionSet, setFirstQuestionSet] = useState([]);
    const [secondQuestionSet, setSecondQuestionSet] = useState([]);
    const [firstSetFeedback, setFirstSetFeedback] = useState([]);
    const [secondSetFeedback, setSecondSetFeedback] = useState([]);

    const navigate = useNavigate();
    const { userPreference, setUserPreference } = useContext(userPreferenceContext);

    const onPreviousPageClick = () => {
        navigate(-1);
    }

    const onQuizStartClick = async (diff, numberOfQuestions) => {
        var allQuestions = await getVocabularyQuizQuestions(diff, numberOfQuestions);

        var firstSet = allQuestions
                                .filter((_, index) => index % 2 === 0)
                                .map(word => [word.word, word.translation]);
        var secondSet = allQuestions
                                .filter((_, index) => index % 2 !== 0)
                                .map(word => [word.translation, word.word]);
        setFirstQuestionSet(firstSet);
        setSecondQuestionSet(secondSet);
        setFirstSetFeedback([]);
        setSecondSetFeedback([]);
        setQuizStarted(true);
    }

    const onQuizSubmitClick = async () => {
        const firstFeedbackResponse = await getFeedback(firstSetAnswer, userPreference["target language"], userPreference["original language"]);
        const secondFeedbackResponse = await getFeedback(secondSetAnswer, userPreference["original language"], userPreference["target language"]);
        const firstFeedback = firstFeedbackResponse.response;
        const secondFeedback = secondFeedbackResponse.response;
        setFirstSetFeedback(firstFeedback.split('\n').map(f => f === '1' ? true : false));
        setSecondSetFeedback(secondFeedback.split('\n').map(f => f === '1' ? true : false));
        setQuizStarted(false);
    }

    return (
        <div id='vocabulary-quiz-page'>
            <BackButton />
            <QuizOption
                onQuizStart={onQuizStartClick} 
                onQuizSubmit={onQuizSubmitClick}
            />
            <div 
                id='vocabulary-quiz-cards-container' 
                style={{display: `${firstQuestionSet.length === 0 || secondQuestionSet.length === 0 ? 'none' : ''}`}}
            >
                <VocabularyQuizCard 
                    title='QUESTION SET 1'
                    questions={firstQuestionSet}
                    setParentAnswer={setFirstSetAnswer}
                    feedback={firstSetFeedback}
                />
                <VocabularyQuizCard 
                    title='QUESTION SET 2'
                    questions={secondQuestionSet}
                    setParentAnswer={setSecondSetAnswer}  
                    feedback={secondSetFeedback}
                />
            </div>
        </div>
    )
}

export default VocabularyQuiz