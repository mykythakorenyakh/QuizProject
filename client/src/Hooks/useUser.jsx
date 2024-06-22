import React from 'react'
import { UserContext } from '../Context/UserContext'
import { useContext } from 'react'

const useUser = () => {
    return useContext(UserContext);
}

export default useUser
