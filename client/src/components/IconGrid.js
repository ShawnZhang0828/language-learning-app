import React, { useState } from 'react';

function IconGrid({ options, handleCellSelected }) {

  const [selectedCell, setSelectedCell] = useState("");

  const onPrefSelected = (cellValue) => {
    handleCellSelected(cellValue);
    setSelectedCell(cellValue);
  }

  return (
    <div className='icon-grid'>
        {options.map(option => (
            <div className={'option-container'}>
                <img  
                  src={option.icon} 
                  alt={option.value} 
                  className={`preference-icon ${option.value == selectedCell ? 'selected' : ''}`}
                  onClick={() => onPrefSelected(option.value)}/>
                <div>{option.value}</div>
            </div>
        ))}
    </div>
  )
}

export default IconGrid;

