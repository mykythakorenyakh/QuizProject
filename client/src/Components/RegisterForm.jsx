import React from 'react'
import style from './styles/login.css'
import { useNavigate } from 'react-router-dom'


const RegisterForm = () => {

    const navigate = useNavigate()

    return (
        <form>
            <label for="email">Enter email</label>
            <input type="email" name="email" required />
            <div className="requirement">

            </div>
            <br />
            <label for="password">Enter password</label>
            <input type="password" name="password" required minlength="8" maxlength="16" />
            <input className="requirement" />

            <br />
            <label for="confirm">Confirm password</label>
            <input type="password" name="confirm" required minlength="8" maxlength="16" />
            <input className="requirement" />

            <br />


            <button>Sign In</button>

            <div className="link" onClick={()=>{navigate('/auth/login',{replace:true})}} >Already have an account?</div>

        </form>


    )
}

export default RegisterForm
