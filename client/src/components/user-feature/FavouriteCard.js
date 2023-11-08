import React, { useState, useEffect, Fragment } from "react";
import {
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

import { getAllFavourites } from "../../controllers/FavouriteController";

import "./styles/FavouriteCard.css";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && children}
    </div>
  );
}

function FavouriteCard() {
  const [tabIndex, setTabIndex] = useState(0);
  const [favChat, setFavChat] = useState([]);
  const [favPhrase, setFavPhrase] = useState([]);
  const [favGrammar, setFavGrammar] = useState([]);
  const [favCulture, setFavCulture] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const fetchFavourites = async () => {
    const response = await getAllFavourites();

    if (response.status) {
      setFavChat(response.chat);
      setFavPhrase(response.phrasebook);
      setFavGrammar(response.grammar);
      setFavCulture(response.culture);

      console.log("Finish getting all favourites.");
    } else {
      // TODO: handle failed case
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  return (
    <div id="favourite-card">
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
      >
        <Tab label="Phrasebook" />
        <Tab label="Chat Highlights" />
        <Tab label="Grammar Gems" />
        <Tab label="Cultural Insights" />
      </Tabs>
      <CustomTabPanel value={tabIndex} index={0}>
        <List>
          {favPhrase.map((phrase, index) => (
            <Fragment key={phrase.phrase}>
              <ListItem>
                <ListItemText
                  primary={phrase.phrase}
                  secondary={phrase.translation}
                />
              </ListItem>
              {index !== favPhrase.length - 1 && <Divider variant="middle" />}
            </Fragment>
          ))}
        </List>
      </CustomTabPanel>
      {/* <CustomTabPanel value={tabIndex} index={1}></CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={2}></CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={3}></CustomTabPanel> */}
    </div>
  );
}

export default FavouriteCard;
