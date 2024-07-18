import React, { useRef } from 'react'

const ChangePasswordPopup = ({ Change, Show, isShow }) => {

    const pass = useRef('')
    const confirm = useRef('')

    function OnSubmit(e) {
        e.preventDefault()

        if (pass.current.value == confirm.current.value && pass.current.value.length>=8) {
            Change(pass.current.value);
            pass.current.value = '';
            confirm.current.value = '';
            Show(false);
        }
    }

    //const popups = [...document.getElementsByClassName('popup-form')];

    const closePopup = (e) => {
        const popup = e.target.closest('.popup-form');
        const clickedOnClosedPopup = popup;




        if (!clickedOnClosedPopup && isShow) Show(false)

    }



  return (
    <div className="popup" onClick={(e) => closePopup(e)} >
            <form className='popup-form' onSubmit={(e) => { e.preventDefault(); OnSubmit(e) }}>
                <h2>Change Password</h2>
                <p>New Password: </p>
                <input type="password" defaultValue='' minLength='8' ref={pass} required />
                <p>Confirm Password: </p>
                <input type="password" defaultValue='' minLength='8' ref={confirm} required />
                <button type='button' onClick={(e) => OnSubmit(e)}>Change</button>
            </form>
        </div>
  )
}

export default ChangePasswordPopup
