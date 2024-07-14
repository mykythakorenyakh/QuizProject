import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import styles from './styles/verification.css'
import { RotatingLines } from 'react-loader-spinner'

import api from '../Axios/axios'


const ActivationPage = () => {
    const [loading, setLoading] = useState(true)
    const { code } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const check = async () => {
            try {
                const data = (await api.get(`/auth/activate/${code}`)).data

                console.log(data)
            } catch (error) {
                console.error(error)
            }
            finally {
                setLoading(false)
            }

        }

        check()

    }, [])


    const display = () => {
        if (loading) {
            return (
                <div style={{ margin: 'auto' }}>
                    <RotatingLines></RotatingLines>
                </div>
            )
        } else {
            return (
                <div class="verification-board">
                    <h2>You registered successfully!</h2>
                    <p>Now you can log into your account.</p>

                    <div className="link" onClick={() => { navigate('/auth/login', { replace: true }) }}>Got to Login</div>
                </div>
            )
        }

    }

    return display()
}

export default ActivationPage
