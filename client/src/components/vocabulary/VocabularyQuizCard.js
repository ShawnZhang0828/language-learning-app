import React, { useState } from 'react'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function VocabularyQuizCard({ title, questions, setParentAnswer }) {

    const [answers, setAnswers] = useState({});

    const sliderSetting = {
        dots: true,
        infinite: false,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 1
    }

    const questionsPerColumn = 5;

    // Split questions into chunks to be displayed in the slider
    const splitQuestions = (questions) => {
        var splittedQuestions = [];
        for (var i = 0; i < questions.length; i += questionsPerColumn) {
            splittedQuestions.push(questions.slice(i, i + questionsPerColumn));
        }

        return splittedQuestions;
    }

    const onAnswerChange = (question, event) => {
        setAnswers({
            ...answers,
            [question]: event.target.value
        });
        setParentAnswer({
            ...answers,
            [question]: event.target.value
        });
    }

    return (
        <div id='vocabulary-quiz-card'>
            <div id='vocabulary-quiz-card-title'>{title}</div>
            <Slider {...sliderSetting}>
                {splitQuestions(questions).map((questionGroup, groupIndex) => (
                    <div className='vocabulary-question-column-container' key={groupIndex}>
                        {questionGroup.map((question, questionIndex) => (
                            <div className='vocabulary-question-container' key={questionIndex}>
                                <div className='vocabulary-question'>
                                    {`${groupIndex * questionsPerColumn + questionIndex + 1}. ${question}`}
                                </div>
                                <input 
                                    className='vocabulary-answer-input'
                                    type='text'
                                    value={answers[question] || ''}
                                    onChange={(e) => onAnswerChange(question, e)}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default VocabularyQuizCard