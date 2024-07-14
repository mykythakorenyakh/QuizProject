import React, { useRef, useState } from 'react'
import style from './styles/login.css'
import { useNavigate } from 'react-router-dom'

import api from '../Axios/axios'


const RegisterForm = () => {

    const navigate = useNavigate()

    const email = useRef()
    const password = useRef()
    const confirm = useRef();

    const [error, setError] = useState('')


    const submit = async (e) => {
        e.preventDefault();

        try {
            if(password.current.value !== confirm.current.value) {
                setError('Passwords do not match')
            }


            const data = (await api.post(`/auth/register`,{
                email:email.current.value,
                password:password.current.value,
            })).data
            console.log(data)
            if(data){
                setError('')
                navigate('/auth/verification')
            }

        } catch (error) {
            console.error(error)
            setError('Registration Failed')
        }
        


    }

    return (
        <form onSubmit={(e)=>submit(e)}>
            <label for="email">Enter email</label>
            <input type="email" ref={email} name="email" required />
            <div className="requirement">

            </div>
            <br />
            <label for="password">Enter password</label>
            <input type="password" ref={password} name="password" required minlength="8" maxlength="16" />
            <input className="requirement" />

            <br />
            <label for="confirm">Confirm password</label>
            <input type="password" ref={confirm} name="confirm" required minlength="8" maxlength="16" />
            <input className="requirement" />

            <br />


            <button>Sign In</button>

            <div className="link" onClick={() => { navigate('/auth/login', { replace: true }) }} >Already have an account?</div>

            {error ?
                <div className='errors'>
                    <div className="error"> {error}</div>
                </div> : ''
            }

        </form>


    )
}

export default RegisterForm
