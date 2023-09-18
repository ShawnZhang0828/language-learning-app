import React, { useState, useEffect, useContext } from 'react'
import { Skeleton, ToggleButton } from '@mui/material'
import RedoIcon from '@mui/icons-material/Redo';
import BorderColorIcon from '@mui/icons-material/BorderColor';

import { requestStory } from '../../controllers/ReadingController'

import '../../styles/StoryPage.css'
import BackButton from '../common/BackButton';
import { userPreferenceContext } from '../../controllers/PreferenceController';

function StoryPage() {

    const [storyLoading, setStoryLoading] = useState(false);
    const [storyContent, setStoryContent] = useState("");
    const [textSelection, setTextSelection] = useState(false);

    const { userPreference, setUserPreference } = useContext(userPreferenceContext);

    const onRegenerateClick = async () => {
        requestNewStory();
    }

    const onTextSelectClick = async () => {
        setTextSelection(!textSelection);
    }

    const requestNewStory = async () => {
        setStoryLoading(true);
        var storyResponse = await requestStory(userPreference['target language']);
        setStoryLoading(false);
        setStoryContent(storyResponse.story)
        return storyResponse;
    }

    useEffect(() => {
        requestNewStory();
    }, []);

    return (
        <div id='story-page-container'>
            <BackButton />
            <div id='story-feature-container'>
                <ToggleButton 
                    className='story-feature-button'
                    value='text-select'
                    selected={textSelection}
                    onClick={onTextSelectClick}
                    sx={{ padding: '5px' }}
                >
                    <BorderColorIcon sx={{ fontSize: '35px' }} />
                </ToggleButton>
                <button className='story-feature-button' onClick={onRegenerateClick}>
                    <RedoIcon sx={{ fontSize: '35px' }} />
                </button>
            </div>
            <div id='story-content-container'>
                { storyLoading && <Skeleton variant='rounded' width={1228} height={400} animation="wave" /> }
                { !storyLoading && <div id='story-content' className={textSelection ? 'text-select' : ''}>{storyContent}</div> }
            </div>
            
        </div>
    )
}

export default StoryPage