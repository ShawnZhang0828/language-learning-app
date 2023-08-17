import React, { useState, useEffect } from 'react'
import Modal from '@mui/material/Modal';
import Zoom from '@mui/material/Zoom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { getAllVocabulary } from '../controllers/VocabularyController';

import '../styles/VocabularyLibrary.css'
import NewWordForm from './NewWordForm'
import VocabularyList from './VocabularyList';

function VocabularyLibrary() {

    const [addWord, setAddWord] = useState(false);
    const [words, setWords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1.0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageVocabularyList, setPageVocabularyList] = useState([]);

    const onAddWordClicked = () => {
        setAddWord(true);
    }

    const onCloseAddWordClicked = () => {
        setAddWord(false);
    }

    const onPageButtonClicked = (pageNUmber) => {
        setCurrentPage(pageNUmber);
    }

    const fetchVocabulary = async () => {
        const vocabulary = await getAllVocabulary();
        var displayVocabulary = vocabulary.map(word => {
            const currentYear = new Date().getFullYear().toString();
            return {
                word: word.word,
                translation: word.translation,
                level: word.level,
                time: currentYear === word.time.slice(-4) ? word.time.slice(0, -6) : word.time
            }
        })
        console.log(`Got ${displayVocabulary.length} words from database.`)
        setWords(displayVocabulary);
    }

    const vocabularySliderSetting = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
    }

    useEffect(() => {
        async function fetchFirebase() {
            await fetchVocabulary();
        }
        fetchFirebase();
    }, []);

    useEffect(() => {
        const maxWordPerPage = 2;
        const totalPages = Math.ceil(words.length / maxWordPerPage)
        setTotalPages(totalPages);
        
        // setCurrentPage((totalPages - 1) / 2);
        setCurrentPage(1);

        var pageVocabularyList = [];
        for (var pageNum = 0; pageNum < totalPages; pageNum++) {
            pageVocabularyList.push(words.slice(maxWordPerPage*pageNum, maxWordPerPage*(pageNum+1)));
        }
        setPageVocabularyList(pageVocabularyList);
    }, [words]);

    return (
        <div id='vocabulary-library-container'>
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
            <div className='vocabulary-lists-container'>
                <Slider {...vocabularySliderSetting}>
                    {pageVocabularyList.map((pageVocabulary, index) => (
                        <VocabularyList words={pageVocabulary} key={index}/>
                    ))}
                </Slider>
            </div>
            <div className='page-number-container'>
                {Array.from({ length: totalPages }).map((_, index) => (
                    <button className='page-number-btn' 
                            key={index} 
                            onClick={() => {onPageButtonClicked(index+1)}}
                    >
                                {index+1}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default VocabularyLibrary