import React from 'react'
import style from './styles/login.css'
import { useNavigate } from 'react-router-dom'
import api from '../Axios/axios'
import useUser from "../Hooks/useUser";

import { useRef } from 'react'

const LoginFrom = () => {

    const {user,setUser} = useUser()

    const navigate = useNavigate()

    const emailRef = useRef()
    const passwordRef = useRef()
    const keeploggedRef = useRef()


    const submit = async (e) => {
        e.preventDefault();

        try {



            const email = emailRef.current.value;
            const password = passwordRef.current.value;

            const keeplogged = keeploggedRef.current.checked;

            localStorage.setItem('KeepLogged',keeplogged)

            if (email && password) {
                const data = (await api.post('/auth/login', {
                    email: email,
                    password: password
                })).data;
                if (data) {
                    setUser(data);
                    navigate('/account')
                }

                console.log(data)
                return;
            }

        } catch (error) {

            console.log(error)
        }

    }

    return (

        <form onSubmit={(e) => { submit(e) }}>
            <label htmlFor="email">Enter email</label>
            <input type="email" name="email" ref={emailRef} required />
            <div className="requirement">

            </div>
            <br />
            <label htmlFor="password">Enter password</label>
            <input type="password" name="password" ref={passwordRef} required />
            <input className="requirement" />

            <br />
            <div className="save">
                <input type="checkbox" name="KeepLogged" ref={keeploggedRef}/>
                <p>Keep Logged In</p>
            </div>
            <br />


            <button>Log In</button>

            <div className="link" onClick={() => { navigate('/auth/register', { replace: true }) }}>Don't have an account?</div>



        </form>


    )
}

export default LoginFrom
