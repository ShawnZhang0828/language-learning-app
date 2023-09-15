import React, { useState, useEffect } from 'react'
import { Slider, ToggleButtonGroup, ToggleButton } from '@mui/material'
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import Looks4Icon from '@mui/icons-material/Looks4';
import Looks5Icon from '@mui/icons-material/Looks5';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import LoopIcon from '@mui/icons-material/Loop';

function VocabPlaybackControl({ words }) {

    const [selectedLevels, setSelectedLevels] = useState(['1', '2', '3', '4', '5']);
    const [playbackOn, setPlaybackOn] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [filteredWords, setFilteredWords] = useState([]);
 
    const onSelectedLevelChange = (_, newLevels) => {
        setSelectedLevels(newLevels);
    }

    const togglePlayback = () => {
        setPlaybackOn(!playbackOn);
    }

    const onSliderChanged = (_, newIndex) => {
        setCurrentIndex(newIndex);
    }

    const valueLabelFormat = (value) => {
        if (filteredWords.length === 0) {
            return words[0].word;
        } else {
            return filteredWords[value].word;
        }
    }

    useEffect(() => {
        var newWords = words.filter(word => selectedLevels.includes(word.level));
        setFilteredWords(newWords);
    }, [words, selectedLevels]);

    return (
        <div id='playback-controller'>
            <div id='level-filter-container'>
                <span id='level-filter-title'>Level Filter</span>
                <ToggleButtonGroup value={selectedLevels} onChange={onSelectedLevelChange} sx={{ gap: '5px' }}>
                    <ToggleButton value='1' aria-label='1' sx={{ padding: '5px' }}>
                        <LooksOneIcon />
                    </ToggleButton>
                    <ToggleButton value='2' aria-label='2' sx={{ padding: '5px' }}>
                        <LooksTwoIcon />
                    </ToggleButton>
                    <ToggleButton value='3' aria-label='3' sx={{ padding: '5px' }}>
                        <Looks3Icon />
                    </ToggleButton>
                    <ToggleButton value='4' aria-label='4' sx={{ padding: '5px' }}>
                        <Looks4Icon />
                    </ToggleButton>
                    <ToggleButton value='5' aria-label='5' sx={{ padding: '5px' }}>
                        <Looks5Icon />
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <Slider 
                value={currentIndex}
                max={words.length - 1}
                onChange={onSliderChanged}
                valueLabelDisplay="on"
                valueLabelFormat={valueLabelFormat}
                sx={{ paddingTop: '8px' }}
            />
            <div id='playback-control-button-group'>
                <button>
                    <FastRewindIcon />
                </button>
                <button>
                    <ArrowLeftIcon />
                </button>
                <button onClick={togglePlayback}>
                    {playbackOn ? <PauseIcon /> : <PlayArrowIcon />}
                </button>
                <button>
                    <ArrowRightIcon />
                </button>
                <button>
                    <FastForwardIcon />
                </button>
                <button id='playback-loop-button'>
                    <LoopIcon />
                </button>
            </div>
        </div>
    )
}

export default VocabPlaybackControl