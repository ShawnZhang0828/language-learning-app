import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import Modal from "@mui/material/Modal";
import Zoom from "@mui/material/Zoom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  getAllVocabulary,
  updateWordInformation,
  removeWord,
} from "../../controllers/VocabularyController";

import Word from "../../models/word";
import "../../styles/VocabularyLibrary.css";
import NewWordForm from "./NewWordForm";
import VocabularyList from "./VocabularyList";
import WordDetailCard from "./WordDetailCard";
import BackButton from "../common/BackButton";
import VocabPlaybackControl from "./VocabPlaybackControl";
import { userPreferenceContext } from "../../controllers/PreferenceController";

function VocabularyLibrary() {
  const [addWord, setAddWord] = useState(false);
  const [words, setWords] = useState([]);
  const [showPlaybackController, setShowPlaybackController] = useState(false);
  const [currentPage, setCurrentPage] = useState(1.0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageVocabularyList, setPageVocabularyList] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);

  const { userPreference, setUserPreference } = useContext(
    userPreferenceContext
  );
  const navigate = useNavigate();

  const sliderRef = useRef(null);

  const onAddWordClick = () => {
    setAddWord(true);
  };

  const onCloseAddWordClick = () => {
    setAddWord(false);
  };

  const onPlaybackClick = () => {
    setShowPlaybackController(true);
  };

  const onPageButtonClick = (pageNUmber) => {
    setCurrentPage(pageNUmber);
    if (sliderRef && sliderRef.current) {
      sliderRef.current.slickGoTo(pageNUmber);
    }
  };

  const onVocabularyRowClick = (word) => {
    setSelectedWord(word);
  };

  const onWordDetailExitClick = () => {
    setSelectedWord(null);
  };

  const onWordDetailSaveClick = async (word) => {
    console.log(`Updating information of ${word.word}`);
    var result = await updateWordInformation(word);
    return result;
  };

  const onWordDetailDeletClick = async (word) => {
    console.log(`Removing ${word.word} from database`);
    var result = await removeWord(word);
    return result;
  };

  // TODO: paging to be implemented
  const onPreviousPageClick = () => {
    navigate(-1);
  };

  const fetchVocabulary = async () => {
    const vocabulary = await getAllVocabulary();

    console.log(`Got ${vocabulary.length} words from database.`);
    setWords(vocabulary);
  };

  const vocabularySliderSetting = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    afterChange: (current) => setCurrentPage(current),
  };

  useEffect(() => {
    const fetchFirebase = async () => {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          await fetchVocabulary();
        } else {
          console.log("User signed out.");
          setWords([]);
        }
      });
    };
    fetchFirebase();
  }, []);

  useEffect(() => {
    const maxWordPerPage = 18;
    const totalPages = Math.ceil(words.length / maxWordPerPage);
    setTotalPages(totalPages);
    setCurrentPage(1);

    var pageVocabularyList = [];
    for (var pageNum = 0; pageNum < totalPages; pageNum++) {
      pageVocabularyList.push(
        words.slice(maxWordPerPage * pageNum, maxWordPerPage * (pageNum + 1))
      );
    }
    setPageVocabularyList(pageVocabularyList);
  }, [words]);

  return (
    <div id="vocabulary-library-container">
      <BackButton />
      <div
        className="library-option-btn-container"
        style={{
          opacity:
            selectedWord === null && !addWord && !showPlaybackController
              ? 1
              : 0.3,
        }}
      >
        <button onClick={onAddWordClick}>Add New Word</button>
        <button>Learn New Word</button>
        <button onClick={onPlaybackClick}>Vocab Playback</button>
      </div>
      <Modal open={addWord} id="add-word-popup">
        <Zoom in={addWord}>
          <div
            id="add-word-zoom-container"
            className="mui-modal-component-wrapper"
          >
            <NewWordForm
              cancelAdd={onCloseAddWordClick}
              language={userPreference["target-language"]}
            />
          </div>
        </Zoom>
      </Modal>
      <Modal
        open={showPlaybackController}
        onClose={() => {
          setShowPlaybackController(false);
        }}
        id="playback-controller-popup"
      >
        <Zoom in={showPlaybackController}>
          <div
            id="playback-containner-container"
            className="mui-modal-component-wrapper"
          >
            <VocabPlaybackControl words={words} />
          </div>
        </Zoom>
      </Modal>
      <div
        className="vocabulary-lists-container"
        style={{
          opacity:
            selectedWord === null && !addWord && !showPlaybackController
              ? 1
              : 0.3,
        }}
      >
        <Slider ref={sliderRef} {...vocabularySliderSetting}>
          {pageVocabularyList.map((pageVocabulary, index) => (
            <VocabularyList
              words={pageVocabulary}
              onWordSelected={onVocabularyRowClick}
              key={index}
            />
          ))}
        </Slider>
      </div>
      <div className="page-number-container">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            className="page-number-btn"
            key={index}
            onClick={() => {
              onPageButtonClick(index + 1);
            }}
            style={{
              background: `${index + 1 === currentPage ? "#90b4f0" : "none"}`,
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <Modal open={selectedWord !== null} id="word-detail-popup">
        <Zoom in={selectedWord !== null}>
          <div
            id="word-detail-container"
            className="mui-modal-component-wrapper"
          >
            {selectedWord && (
              <WordDetailCard
                word={selectedWord}
                onExitClick={onWordDetailExitClick}
                onSaveClick={onWordDetailSaveClick}
                onRemoveClick={onWordDetailDeletClick}
              />
            )}
          </div>
        </Zoom>
      </Modal>
    </div>
  );
}

export default VocabularyLibrary;
