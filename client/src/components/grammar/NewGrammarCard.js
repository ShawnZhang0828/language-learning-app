import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Avatar,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import {
  GrammarRule,
  Verb,
  Noun,
  Adverb,
  Adjective,
  FixedString,
} from "../../models/grammar";

import { addGrammarRule } from "../../controllers/GrammarController";

function NewGrammarCard({ cancelAdd }) {
  const [notification, setNotification] = useState("");
  const [warning, setWarning] = useState("");
  const [addProgress, setAddProgress] = useState([]);
  const [editNewElement, setEditNewElement] = useState(false);
  const [editFixed, setEditFixed] = useState("");
  const [editScreenText, setEditScreenText] = useState("");
  const [editType, setEditType] = useState("");

  const onGrammarRuleSubmit = async (e) => {
    e.preventDefault();

    var newRule = new GrammarRule(...addProgress);

    var grammarString = addProgress.map((element) => {return element.screenText})
    console.log(`adding grammar ${grammarString.join(' - ')}`);

    setAddProgress([]);
    setEditFixed("");
    setEditScreenText("");
    setEditType("");

    var result = await addGrammarRule(newRule.convertToDictList());
    if (result.status === 0) {
      setWarning(result.message);
    } else {
      setNotification(`New grammar rule is successfully added!`);
    }
  };

  const addNewElement = () => {
    setNotification("");
    setWarning("");
    setEditNewElement(true);
  };

  const submitNewElement = () => {
    var newElement;
    switch (editType) {
      case "verb":
        newElement = new Verb(editScreenText, editFixed);
        break;
      case "noun":
        newElement = new Noun(editScreenText, editFixed);
        break;
      case "adverb":
        newElement = new Adverb(editScreenText, editFixed);
        break;
      case "adjective":
        newElement = new Adjective(editScreenText, editFixed);
        break;
      case "fixedString":
        newElement = new FixedString(editScreenText, editFixed);
        break;
      default:
        newElement = null;
        break;
    }
    addProgress.push(newElement);

    setEditFixed(false);
    setEditType("");
    setEditScreenText("");
    setEditNewElement(false);
  };

  const onDragElementEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === "recycle-bin") {
      setAddProgress((prevItems) =>
        prevItems.filter((_, idx) => idx !== source.index)
      );
    } else if (destination.droppableId === "add-grammar-list") {
      const newItems = Array.from(addProgress);
      const [reorderedItem] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, reorderedItem);
      setAddProgress(newItems);
    } else {
      return;
    }
  };

  return (
    <form id="add-grammar-form" className="common-form" onSubmit={onGrammarRuleSubmit}>
      {notification && (
        <div
          className="notification"
          style={{ color: "#36a61f", fontSize: "14" }}
        >
          {notification}
        </div>
      )}
      {warning && (
        <div className="warning" style={{ color: "#940027", fontSize: "14" }}>
          {warning}
        </div>
      )}
      <div className="common-form-header">
        <span className="common-form-title">Add A New Grammar</span>
        <div className="common-form-header-btns">
          <button type="submit" className="common-form-header-btn">
            <img src="/common-icons/submit.png" alt="Submit" />
          </button>
          <button
            type="button"
            className="common-form-header-btn"
            onClick={cancelAdd}
          >
            <img src="/common-icons/cancel.png" alt="Cancel" />
          </button>
        </div>
      </div>

      <div id="add-progress-container">
        <DragDropContext onDragEnd={onDragElementEnd}>
          <Droppable droppableId="add-grammar-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                id="add-progress"
              >
                {addProgress.map((item, index) => (
                  <Draggable
                    key={item.screenText}
                    draggableId={item.screenText}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="add-progress-item"
                      >
                        <Avatar sx={{ bgcolor: "#3d5a80", width: 28, height: 28, fontSize: 15 }}>{item.abbreviation}</Avatar>
                        {item.screenText}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="recycle-bin">
            {(provided, snapshot) => (
              <div
                className="common-form-header-btn"
                id="recycle-bin-container"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <img
                  src="/common-icons/recycle-bin.png"
                  alt="Delete"
                  style={{
                    transition: "transform 0.5s ease",
                    width: snapshot.isDraggingOver ? 25 : 20,
                  }}
                />
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div id="new-grammar-element-editor-container">
        {!editNewElement && (
          <img src="/common-icons/add.png" alt="Add" onClick={addNewElement} />
        )}
        {editNewElement && (
          <Grid container spacing={1} id="new-grammar-element-editor">
            <Grid item xl={6}>
              <FormControl variant="standard" sx={{ width: "100%" }}>
                <InputLabel>Fixed</InputLabel>
                <Select
                  label="Fixed"
                  value={editFixed}
                  onChange={(event) => {
                    setEditFixed(event.target.value);
                  }}
                >
                  <MenuItem value="True">True</MenuItem>
                  <MenuItem value="False">False</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xl={6}>
              <FormControl variant="standard" sx={{ width: "100%" }}>
                <InputLabel>Type</InputLabel>
                <Select
                  label="Type"
                  value={editType}
                  onChange={(event) => {
                    setEditType(event.target.value);
                  }}
                >
                  <MenuItem value="verb">Verb</MenuItem>
                  <MenuItem value="noun">Noun</MenuItem>
                  <MenuItem value="adjective">Adjective</MenuItem>
                  <MenuItem value="adverb">Adverb</MenuItem>
                  <MenuItem value="fixedString">FixedString</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xl={11}>
              <TextField
                id="standard-basic"
                label="Screen Text"
                variant="standard"
                value={editScreenText}
                onChange={(event) => {
                  setEditScreenText(event.target.value);
                }}
                sx={{ gridColumn: "span 2", width: "80%" }}
              />
            </Grid>

            <Grid item xl={1} sx={{ position: "relative" }}>
              <img
                src="/common-icons/checkmark.png"
                alt="Submit"
                style={{ position: "absolute", bottom: "0", right: "0" }}
                onClick={submitNewElement}
              />
            </Grid>
          </Grid>
        )}
      </div>
    </form>
  );
}

export default NewGrammarCard;
