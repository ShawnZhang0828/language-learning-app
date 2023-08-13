import React, { useState } from 'react'
import Modal from '@mui/material/Modal';

import "../styles/MainPage.css"
import { features } from '../controllers/FeatureController'

import IconGrid from './IconGrid'
import SubfeatureList from './SubfeatureList';

function MainPage() {
    
    const [selectedFeature, setSelectedFeature] = useState("");

    const handleFeatureSelected = (feature) => {
        setSelectedFeature(feature);
    }

    const handleFeatureUnselected = () => {
        setSelectedFeature("");
    }

    return (
        <div className='all-feature-container'>
            <IconGrid options={features} handleCellSelected={handleFeatureSelected}/>
            {features.map(feature => (
                <Modal
                    open={selectedFeature === feature.value}
                    onClose={handleFeatureUnselected}
                    // hideBackdrop={true}
                    id='subfeature-popup'
                    key={feature.value}>
                        <div id='subfeature-list-container'>
                            <SubfeatureList subfeatures={feature.subfeature}/>
                        </div>
                </Modal>
            ))}
            
        </div>
    )
}

export default MainPage