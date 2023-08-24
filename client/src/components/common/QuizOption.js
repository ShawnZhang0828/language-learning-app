import React, { useState } from 'react'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

function QuizOption({ onQuizStart, onQuizSubmit }) {

    const [difficulty, setDiffculty] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(20);
    const [hourLimit, setHourLimit] = useState(0);
    const [minuteLimit, setMinuteLimit] = useState(30);
    const [quizStarted, setQuizStarted] = useState(false);

    const onDifficultySelected = (event) => {
        setDiffculty(event.target.value);
    }

    const onTotalQuestionsSelected = (event) => {
        setTotalQuestions(event.target.value);
    }

    const onHourSelected = (event) => {
        setHourLimit(event.target.value);
    }

    const onMinuteSelected = (event) => {
        setMinuteLimit(event.target.value);
    }

    const onQuizStartClick = () => {
        setQuizStarted(true);
        onQuizStart(difficulty, totalQuestions);
    }

    return (
        <div id='quiz-option'>
            <FormControl sx={{width: "90px"}}>
                <InputLabel>Difficulty</InputLabel>
                <Select
                    id="difficulty-selection"
                    value={difficulty}
                    label="Difficulty"
                    onChange={onDifficultySelected}
                    disabled={quizStarted}
                    // IconComponent={() => null}
                    // sx={{borderRadius: "50%", textAlign: "center"}}
                >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                </Select>
            </FormControl>
            
            <FormControl sx={{width: "70px"}}>
                <InputLabel>Hour</InputLabel>
                <Select
                    id="hour-selection"
                    value={hourLimit}
                    label="Hour"
                    onChange={onHourSelected}
                    disabled={quizStarted}
                >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={0}>0</MenuItem>
                </Select>
            </FormControl>

            <FormControl sx={{width: "70px"}}>
                <InputLabel>Minute</InputLabel>
                <Select
                    id="minute-selection"
                    value={minuteLimit}
                    label="Minute"
                    onChange={onMinuteSelected}
                    disabled={quizStarted}
                >
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={40}>40</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                </Select>
            </FormControl>

            <FormControl sx={{width: "120px"}}>
                <InputLabel>Total Questions</InputLabel>
                <Select
                    id="total-questions-selection"
                    value={totalQuestions}
                    label="Total Queestions"
                    onChange={onTotalQuestionsSelected}
                    disabled={quizStarted}
                    // IconComponent={() => null}
                    // sx={{borderRadius: "50%", textAlign: "center"}}
                >
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={40}>40</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                </Select>
            </FormControl>
            
            <button className='quiz-button' onClick={onQuizStartClick} disabled={quizStarted}>START</button>
            <button className='quiz-button' onClick={onQuizSubmit}>SUBMIT</button>
        </div>
    )
}

export default QuizOption