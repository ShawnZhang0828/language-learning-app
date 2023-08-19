import React, { useState, useEffect, useRef } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Word from '../models/word'

function WordDetailCard({ word, onExitClick, onSaveClick, onRemoveClick }) {

    const [translation, setTranslation] = useState(word.translation);
    const [note, setNote] = useState(word.translation);
    const [level, setLevel] = useState(word.level);

    const [titleSize, setTitleSize] = useState(28);
    const titleDivRef = useRef(null);

    const onLevelSelect = (event) => {
        setLevel(event.target.value);
    }

    // Adjust the size of the title to avoid putting title in two lines
    const adjustTitleSize = (size) => {
        if (!titleDivRef.current || titleSize <= 5) {
            return;
        }
        titleDivRef.current.style.fontSize = `${size}px`;
        while (titleDivRef.current.clientHeight > 60 && size > 5) {
            size -= 1;
            titleDivRef.current.style.fontSize = `${size}px`;
            break;
        }
    }

    useEffect(() => {
        adjustTitleSize(30);
    }, [word]);

    return (
        <div>
            <div id='word-popup-function-icon-container'>
                <button 
                    onClick={() => {
                        var newWord = {...word};
                        newWord.translation = translation;
                        newWord.note = note;
                        newWord.level = level;
                        onSaveClick(newWord);
                    }} 
                    id='word-detail-save-button'
                >
                    <img src='/common-icons/save.png' alt='save' className='word-popup-function-icon'/>
                </button>
                <button onClick={() => {onRemoveClick(word)}} id='word-detail-delete-button'>
                    <img src='/common-icons/delete.png' alt='delete' className='word-popup-function-icon'/>
                </button>
                <button onClick={onExitClick} id='word-detail-exit-button' >
                    <img src='/common-icons/cancel.png' alt='close' className='word-popup-function-icon'/>
                </button>
            </div>
            <table id='word-general-info-container'>
                <tbody>
                    <tr id='id-translation-exit'>
                        <td>
                            <div id='word-title' ref={titleDivRef}>{word.word}</div>
                        </td>
                        <td id='translation-cell'>
                            <input
                                id='translation-cell-input'
                                type='text'
                                defaultValue={word.translation}
                                onChange={(e) => {setTranslation(e.target.value)}} />
                            </td>
                    </tr>
                    <tr id='level-example-save-delete'>
                        <td id='level-selection-cell'>
                            <Select
                                id="level-selection"
                                value={level}
                                label="Level"
                                onChange={onLevelSelect}
                                IconComponent={() => null}
                                sx={{borderRadius: "50%", textAlign: "center"}}
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                            </Select>
                        </td>
                        <td id='example-cell'>
                            <div id='example-cell-text'>{word.example}</div>
                        </td>
                    </tr>
                </tbody>
                
            </table>
            <div id='word-note'>
                <textarea
                    id='word-note-textarea'
                    type='text'
                    defaultValue={word.note}
                    onChange={(e) => {setNote(e.target.value)}} />
            </div>
        </div>
    )
}

export default WordDetailCard