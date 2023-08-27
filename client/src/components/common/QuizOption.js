import React, { useState } from 'react'
import { MenuItem, Select, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';

import './styles/QuizOption.css'

function QuizOption({ onQuizStart, onQuizSubmit }) {

    const [difficulty, setDiffculty] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(20);
    const [hourLimit, setHourLimit] = useState(0);
    const [minuteLimit, setMinuteLimit] = useState(30);
    const [quizStarted, setQuizStarted] = useState(false);

    const [remainingTime, setRemainingTime] = useState(0);
    const [timer, setTimer] = useState(null);
    const [timeUp, setTimeUp] = useState(false);

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
        // const totalTime = hourLimit * 3600 * 1000 + minuteLimit * 60 * 1000;
        setQuizStarted(true);
        onQuizStart(difficulty, totalQuestions);
        startTimer();
    }

    const onQuizSubmitClick = () => {
        setTimer(null);

        setQuizStarted(false);
        onQuizSubmit();
    }

    const onTimeUpMessageClose = () => {
        setTimeUp(false);
    }

    const startTimer = () => {
        setRemainingTime(hourLimit * 3600 + minuteLimit * 60);
        setTimeUp(false);

        const timer = setInterval(() => {
            setRemainingTime((prevsTime) => {
                if (prevsTime <= 1) {
                    setHourLimit(0);
                    setMinuteLimit(0);
                    clearInterval(timer);
                    setTimeUp(true);
                    onQuizSubmitClick();
                    return 0;
                } else {
                    const [hour, minute] = parseRemainingTime(prevsTime - 1);
                    setHourLimit(hour);
                    setMinuteLimit(minute);
                    return prevsTime - 1;
                }
            })
        }, 1000)

        setTimer(timer);
    }

    const parseRemainingTime = (timeInSecond) => {
        const hour = Math.floor(timeInSecond / 3600);
        const minute = Math.ceil(timeInSecond / 60);
        return [hour, minute];
    }

    return (
        <div id='quiz-option'>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                open={timeUp}
                onClose={onTimeUpMessageClose}
            >
                <Alert onClose={onTimeUpMessageClose} severity='warning'>
                    Quiz time is up!
                </Alert>
            </Snackbar>

            <FormControl sx={{width: "90px"}}>
                <InputLabel>Difficulty</InputLabel>
                <Select
                    id="difficulty-selection"
                    value={difficulty}
                    label="Difficulty"
                    onChange={onDifficultySelected}
                    disabled={quizStarted}
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
                    sx={{ 
                        "&.Mui-disabled": {
                            color: `${minuteLimit <= 5 ? '#ce3e3e' : '#08013d' }`,
                            fontWeight: 'bold',
                            opacity: 1
                          }
                    }}
                >
                    {
                        Array.from({ length: 5 }).map((_, index) => (
                            <MenuItem value={index} key={index}>{index}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>

            <FormControl sx={{ width: "70px" }}>
                <InputLabel>Minute</InputLabel>
                <Select
                    id="minute-selection"
                    value={minuteLimit}
                    label="Minute"
                    onChange={onMinuteSelected}
                    disabled={quizStarted}
                    sx={{ 
                            "&.Mui-disabled": {
                                color: `${minuteLimit <= 5 ? '#ce3e3e' : '#08013d' }`,
                                fontWeight: 'bold',
                                opacity: 1
                              }
                        }}
                >
                    {
                        Array.from({ length: 60 }).map((_, index) => (
                            <MenuItem 
                                value={index} 
                                sx={{ display: `${index % 10 === 0 ? '' : 'none' }` }}
                                key={index}
                            >
                                {index}
                            </MenuItem>
                        ))
                    }
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
            <button className='quiz-button' onClick={onQuizSubmitClick} disabled={!quizStarted}>SUBMIT</button>
        </div>
    )
}

export default QuizOption