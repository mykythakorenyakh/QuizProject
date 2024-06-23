import React, { useRef } from 'react'

const CreateQuizPopup = ({ Create, Show }) => {

    const title = useRef('')

    function OnSubmit() {


        Create(title.current.value);
        title.current.value = '';
        Show(false);
    }

    return (
        <div className="popup">
            <form className='popup-form'>
                <h2>Create new Quiz</h2>
                <p>Title: </p>
                <input type="text" defaultValue='' ref={title} required />
                <button type='button' onClick={()=>OnSubmit()}>Create</button>
            </form>
        </div>
    )
}

export default CreateQuizPopup
