import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "../styles/PreferencePage.css"
import { updatePreference, preferences } from '../controllers/PreferenceController'; 

import IconGrid from './IconGrid';

const PreferencePage = ({ prefName, nextPage }) => {
    const navigate = useNavigate();

    const [prefValue, setPrefValue] = useState('');

    const onPreferenceSubmit = () => {
        updatePreference(prefName, prefValue);
        navigate(nextPage);
    }

    const handlePrefSelected = (selectedPref) => {
        setPrefValue(selectedPref);
    }

    return (
        <div className="preference-selection">
            <div className='preference-title'>{preferences[prefName].text}</div>
            <IconGrid options={preferences[prefName].options} handleCellSelected={handlePrefSelected}/>
            <button onClick={onPreferenceSubmit} className='preference-btn'>
                Next
            </button>
        </div>
    );
};

export default PreferencePage;
