import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Stack, Divider, CircularProgress } from "@mui/material";
import Draggable from "react-draggable";
import ReplyIcon from "@mui/icons-material/Reply";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";

import { translateMessage } from "../../controllers/ChatController";
import { getLanguageCode } from "../../utils/languageHelper";

const SentenceOptions = forwardRef(
  ({ xPos, yPos, selectedText, targetLanguage, storyLanguage }, ref) => {
    const [translation, setTranslation] = useState("");
    const [loadingTranslation, setLoadingTranslation] = useState(false);
    const [showPronounceSubOption, setShowPronounceSubOption] = useState(false);
    const [isReading, setIsReading] = useState(false);
    const [startReading, setStartReading] = useState(false);
    const [speakInterval, setSpeakInterval] = useState(null);

    const synth = window.speechSynthesis;
    const voice = synth
      .getVoices()
      .find((voice) => voice.lang === getLanguageCode(storyLanguage));

    const handleMouseDown = (event) => {
      event.preventDefault();
    };

    const onBackClick = () => {
      setTranslation("");
    };

    const onPronounceClick = () => {
      setShowPronounceSubOption(!showPronounceSubOption);
    };

    const onStartPauseClick = () => {
      if (!isReading && startReading) {
        // resume reading
        setIsReading(true);
        synth.resume();
        startSpeakInterval();
      } else if (!startReading) {
        // to begin a read section
        synth.cancel();

        setIsReading(true);
        setStartReading(true);

        const utterThis = new SpeechSynthesisUtterance();
        utterThis.text = selectedText;
        utterThis.voice = voice;
        utterThis.onerror = (event) => {
          console.error("speech synthesis error: ", event);
        };
        utterThis.onend = (event) => {
          setIsReading(false);
          setStartReading(false);
        };

        synth.speak(utterThis);
        startSpeakInterval();
      } else {
        // pause a read section
        setIsReading(false);
        synth.pause();
        clearInterval(speakInterval);
        setSpeakInterval(null);
      }
    };

    const startSpeakInterval = () => {
      // clear old interval before creating a new one
      if (speakInterval) {
        console.log("entering");
        clearInterval(speakInterval);
        setSpeakInterval(null);
      }

      const newInterval = setInterval(() => {
        if (!synth.speaking) {
          clearInterval(newInterval);
          setSpeakInterval(null);
        } else {
          // avoid browser auto pauses the speech
          synth.pause();
          synth.resume();
        }
      }, 14000);

      setSpeakInterval(newInterval);
    };

    const onPlayStopClick = () => {
      synth.cancel();
      setIsReading(false);
      setStartReading(false);
      clearInterval(speakInterval);
      setSpeakInterval(null);
    };

    const onTranslateClick = async () => {
      setLoadingTranslation(true);
      const response = await translateMessage(selectedText, targetLanguage);
      const translate = response.translation;
      setTranslation(translate);
      setLoadingTranslation(false);
    };

    // pass this function to parent (story page)
    useImperativeHandle(ref, () => ({
      onOptionsClose: () => {
        synth.cancel();
        setIsReading(false);
        setStartReading(false);
        clearInterval(speakInterval);
        setSpeakInterval(null);
      },
    }));

    return (
      <Draggable
        handle=".handle"
        id="sentence-options-draggable"
        enableUserSelectHack={false}
      >
        <div
          id="sentence-options-container"
          style={{ position: "absolute", left: xPos, top: yPos }}
        >
          <div
            id="drag-area"
            className="handle"
            onMouseDown={handleMouseDown}
          ></div>
          {!translation && !loadingTranslation && (
            <Stack id="sentence-options">
              <div
                className="sentence-option"
                onMouseDown={handleMouseDown}
                onClick={onTranslateClick}
              >
                Translate
              </div>
              <Divider />
              <div
                className={`sentence-option ${
                  showPronounceSubOption ? "sentence-option-with-suboption" : ""
                }`}
                onMouseDown={handleMouseDown}
                onClick={onPronounceClick}
              >
                Pronounce
              </div>
              <div
                className="sentence-suboption"
                style={{ display: showPronounceSubOption ? "" : "none" }}
              >
                <div id="pronounce-suboption">
                  <button
                    onClick={onStartPauseClick}
                    className="suboption-button"
                  >
                    {isReading ? <PauseIcon /> : <PlayArrowIcon />}
                  </button>
                  <button
                    onClick={onPlayStopClick}
                    className="suboption-button"
                  >
                    <StopIcon />
                  </button>
                </div>
              </div>
              <Divider />
              <div className="sentence-option" onMouseDown={handleMouseDown}>
                Favourite
              </div>
            </Stack>
          )}
          {(loadingTranslation || translation) && (
            <div id="translation-container">
              <button onClick={onBackClick}>
                <ReplyIcon sx={{ fontSize: "20px" }} />
              </button>
              {!loadingTranslation && <span>{translation}</span>}
              {loadingTranslation && (
                <CircularProgress size={20} color="inherit" />
              )}
            </div>
          )}
        </div>
      </Draggable>
    );
  }
);

export default SentenceOptions;
