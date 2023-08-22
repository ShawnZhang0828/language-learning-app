import React, { useState } from 'react'
import { useNavigate  } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "../../styles/VocabularyQuiz.css"
import QuizOption from '../common/QuizOption';

function VocabularyQuiz() {

    const [difficulty, setDiffculty] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(20);
    const [remainingTime, setRemainingTime] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);

    const navigate = useNavigate();

    const onPreviousPageClick = () => {
        navigate(-1);
    }

    const onQuizStartClick = () => {
        setQuizStarted(true);
    }

    return (
        <div id='vocabulary-quiz-page'>
            <button className='previous-page-button' onClick={onPreviousPageClick}>
                <img src='/common-icons/back.png' />
            </button>
            <QuizOption
                onQuizStart={onQuizStartClick} 
            />
            
        </div>
    )
}

export default VocabularyQuiz