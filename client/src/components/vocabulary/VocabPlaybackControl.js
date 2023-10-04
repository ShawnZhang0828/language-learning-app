import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Slider,
  ToggleButtonGroup,
  ToggleButton,
  Snackbar,
  Alert,
} from "@mui/material";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import Looks4Icon from "@mui/icons-material/Looks4";
import Looks5Icon from "@mui/icons-material/Looks5";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import LoopIcon from "@mui/icons-material/Loop";

import { getLanguageCode } from "../../utils/languageHelper";

import { userPreferenceContext } from "../../controllers/PreferenceController";

function VocabPlaybackControl({ words }) {
  const [selectedLevels, setSelectedLevels] = useState([
    "1",
    "2",
    "3",
    "4",
    "5",
  ]);
  const [playbackOn, setPlaybackOn] = useState(false);
  const [loopOn, setLoopOn] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredWords, setFilteredWords] = useState([]);
  const [showLastWarning, setShowLastWarning] = useState(false);
  const [showFirstWarning, setShowFirstWarning] = useState(false);

  const { userPreference, setUserPreference } = useContext(
    userPreferenceContext
  );

  const loopOnRef = useRef(loopOn);
  const currentIndexRef = useRef(0);

  // Initialize speech synthesis voices and utterance
  const synth = window.speechSynthesis;
  const targetLanguage = getLanguageCode(userPreference["target-language"]);
  const originalLanguage = getLanguageCode(userPreference["original-language"]);

  const targetVoice = synth
    .getVoices()
    .find((voice) => voice.lang === targetLanguage);
  const originalVoice = synth
    .getVoices()
    .find((voice) => voice.lang === originalLanguage);

  const utterWord = new SpeechSynthesisUtterance();
  utterWord.voice = targetVoice;
  utterWord.rate = 0.7;
  utterWord.pitch = 0.8;
  const utterTranslation = new SpeechSynthesisUtterance();
  utterTranslation.voice = originalVoice;
  const utterExample = new SpeechSynthesisUtterance();
  utterExample.voice = targetVoice;
  utterWord.rate = 0.85;

  const onSelectedLevelChange = (_, newLevels) => {
    setSelectedLevels(newLevels);
  };

  const onLoopChange = () => {
    setLoopOn(!loopOn);
    loopOnRef.current = !loopOn;
  };

  const onSliderChanged = (_, newIndex) => {
    setCurrentIndex(newIndex);
    currentIndexRef.current = newIndex;

    // Cancel current utterance and start with the new word
    synth.cancel();
    readWord(filteredWords[currentIndexRef.current], currentIndexRef.current);
  };

  const onNextClick = () => {
    var index = currentIndex;
    if (index === filteredWords.length - 1) {
      setShowLastWarning(true);
      return;
    }

    onSliderChanged(null, index + 1);
  };

  const onPrevClick = () => {
    var index = currentIndex;
    if (index === 0) {
      setShowFirstWarning(true);
      return;
    }

    onSliderChanged(null, index - 1);
  };

  const togglePlayback = () => {
    var playing = playbackOn;

    setPlaybackOn(!playbackOn);

    if (playing) {
      synth.cancel();
      return;
    }

    readWord(filteredWords[currentIndex], currentIndex);
  };

  const readWord = (word, index) => {
    var nextIndex = index + 1;

    // Speak word three times, then translation, then example. Ensure each fragment is completed before starting next fragment.
    utterWord.text = `${word.word}, ${word.word}, ${word.word}`;
    utterWord.onend = () => {
      utterTranslation.text = word.translation;
      utterTranslation.onend = () => {
        utterExample.text = word.example;
        utterExample.onend = handleEndOfWord;
        synth.speak(utterExample);
      };
      synth.speak(utterTranslation);
    };
    synth.speak(utterWord);

    // At the end of each word, start next word or return to the first word
    const handleEndOfWord = () => {
      if (nextIndex < filteredWords.length) {
        setCurrentIndex(nextIndex);
        readWord(filteredWords[nextIndex], nextIndex);
      } else {
        setCurrentIndex(0);
        if (loopOnRef.current) {
          readWord(filteredWords[0], 0);
        } else {
          setPlaybackOn(false);
        }
      }
    };
  };

  const valueLabelFormat = (value) => {
    if (filteredWords.length === 0) {
      return words[0].word;
    } else {
      return filteredWords[value].word;
    }
  };

  useEffect(() => {
    var newWords = words.filter((word) => selectedLevels.includes(word.level));
    setFilteredWords(newWords);
  }, [words, selectedLevels]);

  return (
    <div id="playback-controller">
      <div id="level-filter-container">
        <span id="level-filter-title">Level Filter</span>
        <ToggleButtonGroup
          value={selectedLevels}
          onChange={onSelectedLevelChange}
          sx={{ gap: "5px" }}
          disabled={playbackOn}
        >
          <ToggleButton value="1" aria-label="1" sx={{ padding: "5px" }}>
            <LooksOneIcon />
          </ToggleButton>
          <ToggleButton value="2" aria-label="2" sx={{ padding: "5px" }}>
            <LooksTwoIcon />
          </ToggleButton>
          <ToggleButton value="3" aria-label="3" sx={{ padding: "5px" }}>
            <Looks3Icon />
          </ToggleButton>
          <ToggleButton value="4" aria-label="4" sx={{ padding: "5px" }}>
            <Looks4Icon />
          </ToggleButton>
          <ToggleButton value="5" aria-label="5" sx={{ padding: "5px" }}>
            <Looks5Icon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <Slider
        value={currentIndex}
        max={filteredWords.length - 1}
        onChange={onSliderChanged}
        valueLabelDisplay="on"
        valueLabelFormat={valueLabelFormat}
        sx={{ paddingTop: "8px" }}
      />
      <div id="playback-control-button-group">
        <button onClick={onPrevClick}>
          <ArrowLeftIcon />
        </button>
        <button onClick={togglePlayback}>
          {playbackOn ? <PauseIcon /> : <PlayArrowIcon />}
        </button>
        <button onClick={onNextClick}>
          <ArrowRightIcon />
        </button>
        <ToggleButton
          value="loop"
          selected={loopOn}
          id="playback-loop-button"
          onClick={onLoopChange}
          sx={{ padding: "0px" }}
        >
          <LoopIcon />
        </ToggleButton>
      </div>
      <Snackbar
        open={showFirstWarning}
        autoHideDuration={3000}
        onClose={() => {
          setShowFirstWarning(false);
        }}
      >
        <Alert
          severity="warning"
          sx={{ backgroundColor: "#aacdfa", borderRadius: "20px" }}
        >
          This is already the first word!
        </Alert>
      </Snackbar>
      <Snackbar
        open={showLastWarning}
        autoHideDuration={3000}
        onClose={() => {
          setShowLastWarning(false);
        }}
      >
        <Alert
          severity="warning"
          sx={{ backgroundColor: "#aacdfa", borderRadius: "20px" }}
        >
          This is already the last word!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default VocabPlaybackControl;
