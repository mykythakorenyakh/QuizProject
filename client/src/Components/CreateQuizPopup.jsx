import React, { useRef } from 'react'

const CreateQuizPopup = ({ Create, Show,isShow }) => {

    const title = useRef('')

    function OnSubmit(e) {
        e.preventDefault()

        Create(title.current.value);
        title.current.value = '';
        Show(false);
    }

    //const popups = [...document.getElementsByClassName('popup-form')];

    const closePopup = (e)=>{
        const popup = e.target.closest('.popup-form');
        const clickedOnClosedPopup = popup;
        
        
        
        
        if(!clickedOnClosedPopup && isShow) Show(false)
        
    }

    return (
        <div className="popup" onClick={(e)=>closePopup(e)} >
            <form className='popup-form'>
                <h2>Create new Quiz</h2>
                <p>Title: </p>
                <input type="text" defaultValue='' ref={title} required />
                <button type='button' onClick={(e)=>OnSubmit(e)}>Create</button>
            </form>
        </div>
    )
}

export default CreateQuizPopup
