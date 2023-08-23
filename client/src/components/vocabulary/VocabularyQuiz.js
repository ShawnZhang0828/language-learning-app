import React, { useState } from 'react'
import { useNavigate  } from 'react-router-dom';

import "../../styles/VocabularyQuiz.css"
import QuizOption from '../common/QuizOption';
import VocabularyQuizCard from './VocabularyQuizCard';

function VocabularyQuiz() {

    const [difficulty, setDiffculty] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(20);
    const [remainingTime, setRemainingTime] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [answers, setAnswers] = useState({});

    const navigate = useNavigate();

    const onPreviousPageClick = () => {
        navigate(-1);
    }

    const onQuizStartClick = () => {
        setQuizStarted(true);
    }

    const onQuizSubmitClick = () => {
        console.log(answers);
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
            <div id='vocabulary-quiz-cards-container'>
                <VocabularyQuizCard 
                    title='English -> Chinese'
                    questions={["急ぐ1", "ひだり1", "過ぎる1", "乗る1", "火気厳禁1", "急ぐ2", "ひだり2", "過ぎる2", "乗る2", "火気厳禁2",
                    "急ぐ3", "ひだり3", "過ぎる3", "乗る3", "火気厳禁3", "急ぐ4", "ひだり4", "過ぎる4", "乗る4", "火気厳禁4"]}    
                    setParentAnswer={setAnswers}
                />
                <VocabularyQuizCard 
                    title='English -> Chinese'
                    questions={["急ぐ", "ひだり", "過ぎる", "乗る", "火気厳禁", "急ぐ", "ひだり", "過ぎる", "乗る", "火気厳禁"]}    
                />
            </div>
        </div>
    )
}

export default VocabularyQuiz