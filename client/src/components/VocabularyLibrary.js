import React, { useState } from 'react'
import Modal from '@mui/material/Modal';
import Zoom from '@mui/material/Zoom';

import '../styles/VocabularyLibrary.css'
import NewWordForm from './NewWordForm'

function VocabularyLibrary() {

    const [addWord, setAddWord] = useState(false);

    const onAddWordClicked = () => {
        setAddWord(true);
    }

    const onCloseAddWordClicked = () => {
        setAddWord(false);
    }

    return (
        <div className='vocabulary-library-container'>
            <div className='add-word-btn-container'>
                <button onClick={onAddWordClicked}>Add New Word</button>
                <button>Learn New Word</button>
            </div>
            <Modal
                open={addWord}    
                id="add-word-popup"
            >
                <Zoom in={addWord}>
                    <div className='add-word-zoom-container'>
                        <NewWordForm addCancel={onCloseAddWordClicked}/>
                    </div>
                    
                </Zoom>
            </Modal>
        </div>
    )
}

export default VocabularyLibrary