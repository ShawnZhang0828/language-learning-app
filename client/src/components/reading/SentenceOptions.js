import React, { useState } from "react";
import { Stack, Divider, CircularProgress } from "@mui/material";
import Draggable from "react-draggable";
import ReplyIcon from "@mui/icons-material/Reply";

import { translateMessage } from "../../controllers/ChatController";

function SentenceOptions({ xPos, yPos, selectedText, targetLanguage }) {
  const [translation, setTranslation] = useState("");
  const [loadingTranslation, setLoadingTranslation] = useState(false);

  const handleMouseDown = (event) => {
    event.preventDefault();
  };

  const onBackClick = () => {
    setTranslation("");
  };

  const onTranslateClick = async () => {
    setLoadingTranslation(true);
    const response = await translateMessage(selectedText, targetLanguage);
    const translate = response.translation;
    setTranslation(translate);
    setLoadingTranslation(false);
  };

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
            <div className="sentence-option" onMouseDown={handleMouseDown}>
              Pronounce
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

export default SentenceOptions;
