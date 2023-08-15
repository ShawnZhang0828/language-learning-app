import React, { useState } from 'react'

import { addNewWord } from '../controllers/VocabularyController';

function NewWordForm({ addCancel }) {

    const [word, setWord] = useState("");
    const [translation, setTranslation] = useState("");
    const [note, setNote] = useState("");
    const [notification, setNotification] = useState("");
    const [warning, setWarning] = useState("");

    const onWordSubmit = async (e) => {
        e.preventDefault();
        console.log(`adding word ${word} - ${translation} - ${note}`);

        setWord("");
        setTranslation("");
        setNote("");

        var wordData = {
            word: word,
            translation: translation,
            note: note
        };
        console.log(wordData);

        var result = await addNewWord(wordData);
        if (result.status === 0) {
            setWarning(result.message);
        } else {
            setNotification(`${word} is successfully added!`);
        }
    }

    const onChangeHandler = (event) => {
        setNotification("");
        setWarning("");

        const {name, value} = event.target;

        switch (name) {
            case 'word':
                setWord(value);
                break;
            case 'translation':
                setTranslation(value);
                break;
            case 'note':
                setNote(value);
                break;
        }
    }

    return (
        <form onSubmit={onWordSubmit} className='new-word-form'>
            {notification && <div className="notification" style={{color: "#36a61f", fontSize: "14"}}>{notification}</div>}
            {warning && <div className="warning" style={{color: "#940027", fontSize: "14"}}>{warning}</div>}
            <div className='add-word-form-header'>
                <span className='add-word-form-title'>Add A New Word</span>
                <div className='add-word-form-header-btns'>
                    <button type='submit' className='add-word-form-header-btn'>
                        <img src='/common-icons/submit.png' alt='Submit'/>
                    </button>
                    <button type='button' className='add-word-form-header-btn' onClick={addCancel}>
                        <img src='/common-icons/cancel.png' alt='Cancel'/>
                    </button>
                </div>
            </div>
            <div>
                <label> Word: </label>
                <input type='text' name='word' onChange={(event) => {onChangeHandler(event)}} value={word} />
            </div>
            <div>
                <label> Translation: </label>
                <input type='text' name='translation' onChange={(event) => {onChangeHandler(event)}} value={translation} />
            </div>
            <div id='note-container'>
                <label> Note: </label>
                <textarea type='text' name='note'onChange={(event) => {onChangeHandler(event)}} value={note} />
            </div>
            {/* <div id='add-word-form-btn-container'>
                <input type='submit' value='Submit' name='submit' style={{marginRight: '5px'}}/>
                <input type='submit' value='Cancel' name='cancel' />
            </div> */}
        </form>
    )
}

export default NewWordForm