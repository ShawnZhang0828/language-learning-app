import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Zoom, Avatar, Drawer, List, Divider } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";

import "../styles/MainPage.css";
import { auth } from "../controllers/FirebaseController";
import { features } from "../controllers/FeatureController";

import IconGrid from "./common/IconGrid";
import SubfeatureList from "./SubfeatureList";

function MainPage() {
  const [selectedFeature, setSelectedFeature] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);

  const navigate = useNavigate();

  const onAvatarClick = () => {
    setShowDrawer(true);
  };

  const onLogoutClick = async () => {
    try {
      await auth.signOut();
      console.log("user logged out");
      navigate("/");
    } catch (error) {
      console.error("error logging out: ", error);
    }
  };

  const handleFeatureSelected = (feature) => {
    setSelectedFeature(feature);
  };

  const handleFeatureUnselected = () => {
    setSelectedFeature("");
  };

  return (
    <div id="main-page-container">
      <button className="avatar-button" onClick={onAvatarClick}>
        <Avatar>
          <FaceIcon />
        </Avatar>
      </button>
      <Drawer
        anchor="left"
        open={showDrawer}
        onClose={() => {
          setShowDrawer(false);
        }}
      >
        <div className="avatar-container user-drawer-item-container">
          <Avatar sx={{}}>
            <FaceIcon />
          </Avatar>
        </div>
        <Divider />
        <List>
          <div className="user-drawer-item-container user-drawer-option">
            Favourites
          </div>
          <div className="user-drawer-item-container user-drawer-option">
            Progress
          </div>
        </List>
        <Divider />
        <List>
          <div className="user-drawer-item-container user-drawer-option">
            Account
          </div>
          <div className="user-drawer-item-container user-drawer-option">
            Setting
          </div>
          <div className="user-drawer-item-container user-drawer-option">
            Feedback
          </div>
        </List>
        <Divider />
        <List>
          <div
            className="user-drawer-item-container user-drawer-option"
            onClick={onLogoutClick}
          >
            Logout
          </div>
        </List>
        {/* TODO: MORE ITEMS */}
      </Drawer>
      <div id="all-feature-container">
        <h1>Unlock Your Potential</h1>
        <div
          className="icon-grid-container"
          style={{ opacity: selectedFeature === "" ? 1 : 0.3 }}
        >
          <IconGrid
            options={features}
            handleCellSelected={handleFeatureSelected}
          />
        </div>
        {features.map((feature) => (
          <Modal
            open={selectedFeature === feature.value}
            onClose={handleFeatureUnselected}
            id="subfeature-popup"
            key={feature.value}
          >
            <Zoom in={selectedFeature === feature.value}>
              <div id="subfeature-list-container">
                <SubfeatureList subfeatures={feature.subfeature} />
              </div>
            </Zoom>
          </Modal>
        ))}
      </div>
    </div>
  );
}

export default MainPage;
