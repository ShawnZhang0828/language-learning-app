import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import BackButton from '../common/BackButton'
import '../../styles/ScenarioSelectionPage.css'

function ScenarioSelectionPage() {

    const availableScanerios = [
        { name: 'Restaurant', icon: '/chat-icons/restaurant.png' },
        { name: 'Clinic', icon: '/chat-icons/clinic.png' },
        { name: 'School', icon: '/chat-icons/school.png' },
        { name: 'Market', icon: '/chat-icons/market.png' },
        { name: 'Hotel-Booking', icon: '/chat-icons/hotel.png' },
        { name: 'Airport', icon: '/chat-icons/airport.png' },
        { name: 'Interview', icon: '/chat-icons/interview.png' },
    ]

    const navigate = useNavigate();

    const onScenarioSelected = (scenario) => {
        navigate(`/chatbot-chat/${scenario}`);
    }

    return (
        <div id='scenarios-grid-container'>
            <BackButton />
            <h1 id='scenario-selection-header'>Select A Scenario</h1>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} id='scenarios-grid'>
                {availableScanerios.map((scenario, index) => (
                    <Grid 
                        xs={2} sm={4} md={4} 
                        key={index} 
                        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
                    >
                        <div className='scenario-container' onClick={() => {onScenarioSelected(scenario.name)}}>
                            <Avatar src={scenario.icon} />
                            <span className='scenario-name'>{scenario.name.replace('-', ' ')}</span>
                        </div>
                    </Grid>
                ))}
            </Grid>
        </div>
        
    )
}

export default ScenarioSelectionPage