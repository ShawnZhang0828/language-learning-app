import React from 'react'
import { useNavigate  } from 'react-router-dom';

import './styles/BackButton.css'

function BackButton() {

    const navigate = useNavigate();

    const onPreviousPageClick = () => {
        navigate(-1);
    }

    return (
        <button className='previous-page-button' onClick={onPreviousPageClick}>
            <img src='/common-icons/back.png' />
        </button>
    )
}

export default BackButton