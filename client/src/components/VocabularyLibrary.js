import React, { useState, useEffect, useRef } from 'react'
import Modal from '@mui/material/Modal';
import Zoom from '@mui/material/Zoom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { getAllVocabulary } from '../controllers/VocabularyController';

import Word from '../models/word';
import '../styles/VocabularyLibrary.css'
import NewWordForm from './NewWordForm'
import VocabularyList from './VocabularyList';
import WordDetailCard from './WordDetailCard';

function VocabularyLibrary() {

    const [addWord, setAddWord] = useState(false);
    const [words, setWords] = useState([]);
    const [currentPage, setCurrentPage] = useState(1.0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageVocabularyList, setPageVocabularyList] = useState([]);
    const [selectedWord, setSelectedWord] = useState(null);

    const sliderRef = useRef(null);

    const onAddWordClicked = () => {
        setAddWord(true);
    }

    const onCloseAddWordClicked = () => {
        setAddWord(false);
    }

    const onPageButtonClicked = (pageNUmber) => {
        setCurrentPage(pageNUmber);
        if (sliderRef && sliderRef.current) {
            sliderRef.current.slickGoTo(pageNUmber);
        }
    }

    const onVocabularyRowClicked = (word) => {
        setSelectedWord(word);
    }

    const onWordDetailExitClicked = () => {
        setSelectedWord(null);
    }

    const fetchVocabulary = async () => {
        const vocabulary = await getAllVocabulary();
        
        console.log(`Got ${vocabulary.length} words from database.`)
        setWords(vocabulary);
    }

    const vocabularySliderSetting = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        afterChange: current => setCurrentPage(current),
    }

    useEffect(() => {
        async function fetchFirebase() {
            await fetchVocabulary();
        }
        fetchFirebase();
    }, []);

    useEffect(() => {
        const maxWordPerPage = 1;
        const totalPages = Math.ceil(words.length / maxWordPerPage)
        setTotalPages(totalPages);
        setCurrentPage(1);

        var pageVocabularyList = [];
        for (var pageNum = 0; pageNum < totalPages; pageNum++) {
            pageVocabularyList.push(words.slice(maxWordPerPage*pageNum, maxWordPerPage*(pageNum+1)));
        }
        setPageVocabularyList(pageVocabularyList);
    }, [words]);

    return (
        <div id='vocabulary-library-container'>
            <div className='add-word-btn-container' style={{ opacity: selectedWord === null ? 1 : 0.3}}>
                <button onClick={onAddWordClicked}>Add New Word</button>
                <button>Learn New Word</button>
            </div>
            <Modal
                open={addWord}    
                id="add-word-popup"
            >
                <Zoom in={addWord}>
                    <div className='add-word-zoom-container'>
                        <NewWordForm cancelAdd={onCloseAddWordClicked}/>
                    </div>
                    
                </Zoom>
            </Modal>
            <div className='vocabulary-lists-container' style={{ opacity: selectedWord === null || addWord ? 1 : 0.3}}>
                <Slider ref={sliderRef} {...vocabularySliderSetting}>
                    {pageVocabularyList.map((pageVocabulary, index) => (
                        <VocabularyList words={pageVocabulary} onWordSelected={onVocabularyRowClicked} key={index}/>
                    ))}
                </Slider>
            </div>
            <div className='page-number-container'>
                {Array.from({ length: totalPages }).map((_, index) => (
                    <button className='page-number-btn' 
                            key={index} 
                            onClick={() => {onPageButtonClicked(index+1)}}
                            style={{background: `${index+1 === currentPage ? "#90b4f0" : "none"}`}}
                    >
                                {index+1}
                    </button>
                ))}
            </div>
            <Modal
                open={selectedWord != null}
                id="word-detail-popup"
            >
                <Zoom in={selectedWord}>
                    {selectedWord && <WordDetailCard word={selectedWord} onExitClick={onWordDetailExitClicked}/>}
                </Zoom>
            </Modal>
        </div>
    )
}

export default VocabularyLibrary