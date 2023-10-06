import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";

import "./styles/FavouriteCard.css";

function FavouriteCard() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <div id="favourite-card">
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="secondary"
      >
        <Tab label="Phrasebook" />
        <Tab label="Chat Highlights" />
        <Tab label="Grammar Gems" />
        <Tab label="Cultural Insights" />
      </Tabs>
    </div>
  );
}

export default FavouriteCard;
