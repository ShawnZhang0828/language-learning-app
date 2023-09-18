import React from "react";
import { Stack, Divider } from "@mui/material";

function SentenceOptions({ xPos, yPos }) {
  return (
    <div
      id="sentence-options-container"
      style={{ position: "absolute", top: yPos, left: xPos }}
    >
      <Stack id="sentence-options">
        <div className="sentence-option">Translate</div>
        <Divider />
        <div className="sentence-option">Pronounce</div>
        <Divider />
        <div className="sentence-option">Favourite</div>
      </Stack>
    </div>
  );
}

export default SentenceOptions;
