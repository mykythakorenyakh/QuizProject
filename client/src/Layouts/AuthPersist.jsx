import React, { useEffect, useState } from 'react'
import useUser from '../Hooks/useUser'
import useRefresh from '../Hooks/useRefresh'
import { useNavigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { RotatingLines } from 'react-loader-spinner'


const container = {
    display:'flex',
    margin:'auto',
}


const AuthPersist = () => {
    const { user, persist } = useUser();
    const refresh = useRefresh();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const setup = async () => {
            try {
                if (persist==='true') {
                    
                    await refresh();
                }
            }catch(err){
                navigate('/auth/login')
            }finally{
                setLoading(false)
            }
        }
    
        setup();

    },[])

    

    return loading ? <div style={container}><RotatingLines /></div> : <Outlet />
}

export default AuthPersist
