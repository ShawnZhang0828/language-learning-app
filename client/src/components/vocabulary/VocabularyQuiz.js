import React, { useState } from 'react'
import { useNavigate  } from 'react-router-dom';

import { getVocabularyQuizQuestions } from '../../controllers/VocabularyQuizController';

import "../../styles/VocabularyQuiz.css"
import QuizOption from '../common/QuizOption';
import VocabularyQuizCard from './VocabularyQuizCard';

function VocabularyQuiz() {

    const [difficulty, setDiffculty] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(20);
    const [remainingTime, setRemainingTime] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [firstSetAnswer, setFirstSetAnswer] = useState({});
    const [secondSetAnswer, setSecondSetAnswer] = useState({});
    const [firstQuestionSet, setFirstQuestionSet] = useState([]);
    const [secondQuestionSet, setSecondQuestionSet] = useState([]);

    const navigate = useNavigate();

    const onPreviousPageClick = () => {
        navigate(-1);
    }

    const onQuizStartClick = async (diff, numberOfQuestions) => {
        var allQuestions = await getVocabularyQuizQuestions(diff, numberOfQuestions);

        var firstSet = allQuestions
                                .filter((_, index) => index % 2 === 0)
                                .map(word => word.word);
        var secondSet = allQuestions
                                .filter((_, index) => index % 2 !== 0)
                                .map(word => word.translation);
        console.log(firstSet);
        console.log(secondSet);
        setFirstQuestionSet(firstSet);
        setSecondQuestionSet(secondSet);
        setQuizStarted(true);
    }

    const onQuizSubmitClick = () => {
        console.log(firstSetAnswer);
        console.log(secondSetAnswer)
    }

    return (
        <div id='vocabulary-quiz-page'>
            <button className='previous-page-button' onClick={onPreviousPageClick}>
                <img src='/common-icons/back.png' />
            </button>
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
                    // questions={["急ぐ1", "ひだり1", "過ぎる1", "乗る1", "火気厳禁1", "急ぐ2", "ひだり2", "過ぎる2", "乗る2", "火気厳禁2",
                    // "急ぐ3", "ひだり3", "過ぎる3", "乗る3", "火気厳禁3", "急ぐ4", "ひだり4", "過ぎる4", "乗る4", "火気厳禁4"]}    
                    setParentAnswer={setFirstSetAnswer}
                />
                <VocabularyQuizCard 
                    title='QUESTION SET 2'
                    questions={secondQuestionSet}
                    // questions={["急ぐ", "ひだり", "過ぎる", "乗る", "火気厳禁", "急ぐ", "ひだり", "過ぎる", "乗る", "火気厳禁"]}  
                    setParentAnswer={setSecondSetAnswer}  
                />
            </div>
        </div>
    )
}

export default VocabularyQuiz