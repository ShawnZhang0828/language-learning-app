import React, { useState, useEffect, useContext } from "react";
import { Skeleton, ToggleButton } from "@mui/material";
import RedoIcon from "@mui/icons-material/Redo";
import BorderColorIcon from "@mui/icons-material/BorderColor";

import { requestStory } from "../../controllers/ReadingController";

import "../../styles/StoryPage.css";
import BackButton from "../common/BackButton";
import SentenceOptions from "./SentenceOptions";
import { userPreferenceContext } from "../../controllers/PreferenceController";

function StoryPage() {
  const [storyLoading, setStoryLoading] = useState(false);
  const [storyContent, setStoryContent] = useState("");
  const [textSelection, setTextSelection] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [showSentenceOpitons, setShowSentenceOptions] = useState(false);
  const [sentenceOptionPos, setSentenceOptionsPos] = useState({
    xPos: 0,
    yPos: 0,
  });

  const { userPreference, setUserPreference } = useContext(
    userPreferenceContext
  );

  const onRegenerateClick = async () => {
    requestNewStory();
  };

  const onTextSelectClick = async () => {
    setTextSelection(!textSelection);
  };

  const onStoryMouseUp = (event) => {
    // Set selected text is none is selected
    if (textSelection && !selectedText) {
      const selected = window.getSelection().toString();
      setSelectedText(selected);
      return;
    }

    // Show right click menu if text is selected
    if (event.button === 2 && selectedText) {
      setShowSentenceOptions(true);
      setSentenceOptionsPos({ xPos: event.clientX, yPos: event.clientY });
    } else if (event.button === 0) {
      setShowSentenceOptions(false);
      setSelectedText("");
    }
  };

  const requestNewStory = async () => {
    setStoryLoading(true);
    var storyResponse = await requestStory(userPreference["target language"]);
    setStoryLoading(false);
    setStoryContent(storyResponse.story);
    return storyResponse;
  };

  useEffect(() => {
    requestNewStory();
  }, []);

  return (
    <div id="story-page-container">
      <BackButton />
      <div id="story-feature-container">
        <ToggleButton
          className="story-feature-button"
          value="text-select"
          selected={textSelection}
          onClick={onTextSelectClick}
          sx={{ padding: "5px" }}
        >
          <BorderColorIcon sx={{ fontSize: "35px" }} />
        </ToggleButton>
        <button className="story-feature-button" onClick={onRegenerateClick}>
          <RedoIcon sx={{ fontSize: "35px" }} />
        </button>
      </div>
      <div
        id="story-content-container"
        onContextMenu={(event) => {
          event.preventDefault();
          return false;
        }}
      >
        {storyLoading && (
          <Skeleton
            variant="rounded"
            width={1228}
            height={400}
            animation="wave"
          />
        )}
        {!storyLoading && (
          <div
            id="story-content"
            className={textSelection ? "text-select" : ""}
            onMouseUp={onStoryMouseUp}
            style={{ opacity: showSentenceOpitons ? "0.6" : "1" }}
          >
            {storyContent}
          </div>
        )}
        {showSentenceOpitons && (
          <SentenceOptions
            xPos={sentenceOptionPos.xPos}
            yPos={sentenceOptionPos.yPos}
            selectedText={selectedText}
            targetLanguage={userPreference["original language"]}
          />
        )}
      </div>
    </div>
  );
}

export default StoryPage;
