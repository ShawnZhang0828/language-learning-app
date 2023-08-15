import React from 'react'
import { useNavigate } from 'react-router-dom';

function SubfeatureList({ subfeatures }) {

    const navigate = useNavigate();

    const onSubfeatureSelected = (link) => {
        navigate(link);
    }

    return (
        <div className='subfeature-list'>
            {subfeatures.map(subfeature => (
                <div 
                    key={subfeature.value} 
                    className='subfeature-container' 
                    style={{borderBottom: "2px solid black"}} 
                    onClick={() => {onSubfeatureSelected(subfeature.link)}}
                >
                    <img 
                        src={subfeature.icon} 
                        alt={subfeature.value} 
                        className='subfeature-icon'/>
                    <div style={{fontSize: 20}}>
                        {subfeature.value}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SubfeatureList