import React, { useState } from 'react'
import Modal from '@mui/material/Modal';
import Zoom from '@mui/material/Zoom';

import "../styles/MainPage.css"
import { features } from '../controllers/FeatureController'

import IconGrid from './IconGrid'
import SubfeatureList from './SubfeatureList';

function MainPage() {
    
    const [selectedFeature, setSelectedFeature] = useState("");
    const [zoom, setZoom] = useState(false);

    const handleFeatureSelected = (feature) => {
        setSelectedFeature(feature);
        setZoom(true);
    };

    const handleFeatureUnselected = () => {
        setSelectedFeature("");
        setZoom(false);
    };

    return (
        <div className='all-feature-container'>
            <h1>Unlock Your Potential</h1>
            <div 
                className='icon-grid-container'
                style={{ opacity: selectedFeature == "" ? 1 : 0.3}}>
                <IconGrid options={features} handleCellSelected={handleFeatureSelected}/>
            </div>
            {features.map(feature => (
                <Modal
                    open={selectedFeature === feature.value}
                    onClose={handleFeatureUnselected}
                    id='subfeature-popup'
                    key={feature.value}>
                        <Zoom in={zoom}>
                            <div id='subfeature-list-container'>
                                <SubfeatureList subfeatures={feature.subfeature}/>
                            </div>
                        </Zoom>
                </Modal>
            ))}
        </div>
    )
}

export default MainPage