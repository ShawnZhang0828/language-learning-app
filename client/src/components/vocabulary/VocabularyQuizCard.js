import React, { useState, useEffect } from 'react'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function VocabularyQuizCard({ title, questions, setParentAnswer, feedback }) {

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

    // Initialize empty answer dictionary
    const initializeAnswer = (questions) => {
        var answers = questions.reduce((acc, curr) => {
            acc[curr[0]] = "";
            return acc;
        }, {});
        return answers;
    }

    useEffect(() => {
        const blankAnswer = initializeAnswer(questions);
        setAnswers(blankAnswer);
        setParentAnswer(blankAnswer);
    }, [questions]);

    return (
        <div id='vocabulary-quiz-card'>
            <div id='vocabulary-quiz-card-title'>{title}</div>
            <Slider {...sliderSetting}>
                {splitQuestions(questions).map((questionGroup, groupIndex) => (
                    <div className='vocabulary-question-column-container' key={groupIndex}>
                        {questionGroup.map((question, questionIndex) => {
                            var q = question[0];
                            var a = question[1];
                            var questionNumber = groupIndex * questionsPerColumn + questionIndex;
                            return (
                                <div className='vocabulary-question-container' key={questionIndex}>
                                    <div className='vocabulary-question'>
                                        {`${questionNumber + 1}. ${q}`}
                                    </div>
                                    <input 
                                        className='vocabulary-answer-input'
                                        type='text'
                                        value={answers[q] || ''}
                                        onChange={(e) => onAnswerChange(q, e)}
                                    />
                                    <div className='vocabulary-feedback-container' style={{display: `${feedback.length === 0 ? 'none' : ''}`}}>
                                        {
                                            feedback[questionNumber] 
                                            ? <img src='/common-icons/checkmark.png' className='feedback-icon'/> 
                                            : <div className='vocabulary-answer-correction'>{a}</div>
                                        }
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default VocabularyQuizCard