import React, { useState, useEffect, useContext, Fragment } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Modal,
  Zoom,
} from "@mui/material";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import {
  GrammarRule,
  Verb,
  Noun,
  Adverb,
  Adjective,
  FixedString,
} from "../../models/grammar";
import { getGrammarRules } from "../../controllers/GrammarController";
import { userPreferenceContext } from "../../controllers/PreferenceController";

import "../../styles/GrammarLibrary.css";
import BackButton from "../common/BackButton";
import NewGrammarCard from "./NewGrammarCard";

function GrammarLibrary() {
  const [rules, setRules] = useState([]);
  const [addGrammar, setAddGrammar] = useState(false);

  const { userPreference, setUserPreference } = useContext(
    userPreferenceContext
  );

  const onCloseAddGrammarClick = () => {
    setAddGrammar(false);
  };

  useEffect(() => {
    async function callGetGrammarRules() {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          var result = await getGrammarRules();

          if (result.status) {
            var newRules = [];

            result.grammars.forEach((rule) => {
              var convertedRule = rule["rule"].map((element) => {
                switch (element["type"].toLowerCase()) {
                  case "verb":
                    return new Verb(element["screen-text"], element["fixed"]);
                  case "noun":
                    return new Noun(element["screen-text"], element["fixed"]);
                  case "adverb":
                    return new Adverb(element["screen-text"], element["fixed"]);
                  case "adjective":
                    return new Adjective(
                      element["screen-text"],
                      element["fixed"]
                    );
                  case "string":
                    return new FixedString(
                      element["screen-text"],
                      element["fixed"]
                    );
                  default:
                    return null;
                }
              });

              newRules.push(new GrammarRule(...convertedRule));
            });
          }

          console.log(newRules);
          setRules(newRules);
        } else {
          console.log("User signed out.");
          setRules([]);
        }
      });
    }

    callGetGrammarRules();
  }, []);

  const onAddGrammarClick = () => {
    setAddGrammar(true);
  };

  return (
    <div id="grammar-library-page">
      <BackButton />

      <div className="library-option-btn-container" style={{ width: "400px" }}>
        <button onClick={onAddGrammarClick}>Add Grammar Rule</button>
        <button>Learn New Grammar</button>
      </div>

      {rules !== undefined && (
        <List id="grammar-list">
          {rules.map((rule, index) => (
            <Fragment key={index}>
              {rule.value !== undefined && (
                <ListItem>
                  {rule.value.map((element, index) => (
                    <ListItemText primary={element.screenText} key={index} />
                  ))}
                </ListItem>
              )}

              {index !== rules.length - 1 && <Divider variant="middle" />}
            </Fragment>
          ))}
        </List>
      )}

      <Modal open={addGrammar} id="add-grammar-popup">
        <Zoom in={addGrammar}>
          <div
            id="add-grammar-zoom-container"
            className="mui-modal-component-wrapper"
          >
            <NewGrammarCard cancelAdd={onCloseAddGrammarClick} />
            {/* <NewWordForm
              cancelAdd={onCloseAddWordClick}
              language={userPreference["target-language"]}
            /> */}
          </div>
        </Zoom>
      </Modal>
    </div>
  );
}

export default GrammarLibrary;
