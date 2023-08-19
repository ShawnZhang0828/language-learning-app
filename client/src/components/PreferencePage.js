import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import "../styles/PreferencePage.css"
import { updatePreference, preferences } from '../controllers/PreferenceController'; 

import IconGrid from './IconGrid';
import { userPreferenceContext } from '../controllers/PreferenceController';

const PreferencePage = ({ prefName, nextPage }) => {
    const navigate = useNavigate();

    const [prefValue, setPrefValue] = useState('');

    const { userPreference, setUserPreference } = useContext(userPreferenceContext);

    const onPreferenceSubmit = () => {
        updatePreference(prefName, prefValue);

        // Update preference context
        var updatedPreference = {...userPreference};
        updatedPreference[prefName] = prefValue;
        setUserPreference(updatedPreference);

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
