import React from 'react'
import useApiPrivate from './useApiPrivate'
import { useNavigate } from 'react-router-dom';

const useLogout = () => {

    const api = useApiPrivate();
    const navigate = useNavigate();

    const logout = ()=>{
        api.post('/auth/logout')
        navigate('/auth/login',{replace:true})
    }

    return logout;
}

export default useLogout
