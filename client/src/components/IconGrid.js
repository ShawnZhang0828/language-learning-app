import React, { useState } from 'react';

// each option need an icon and a value, and it CAN have other customized attributes
function IconGrid({ options, handleCellSelected }) {

    const [selectedCell, setSelectedCell] = useState("");

    const onPrefSelected = (cellValue) => {
        handleCellSelected(cellValue);
        setSelectedCell(cellValue);
    }

    return (
        <div className='icon-grid'>
            {options.map(option => (
                <div className={'option-container'} key={option.value}>
                    <img  
                      src={option.icon} 
                      alt={option.value} 
                      className={`preference-icon ${option.value === selectedCell ? 'selected' : ''}`}
                      onClick={() => onPrefSelected(option.value)}/>
                    <div>{option.value}</div>
                </div>
            ))}
        </div>
    )
}

export default IconGrid;

