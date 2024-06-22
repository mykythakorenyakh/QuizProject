import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import useUser from '../Hooks/useUser'

const AuthRequire = () => {
    const { user } = useUser();
    return (user) ? <Outlet></Outlet> : <Navigate to='/auth/login' />

    
}

export default AuthRequire
