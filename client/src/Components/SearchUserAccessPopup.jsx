import React, { useEffect, useState } from 'react'
import useApiPrivate from '../Hooks/useApiPrivate'

import styles from './styles/searchuserpopup.css'
import { FaCheck, FaUserMinus } from 'react-icons/fa';



const SearchUserAccessPopup = ({ isShow, Show, accesses, setAccesses, quizId }) => {

    const api = useApiPrivate();

    const [users, setUsers] = useState();



    const makeResearch = async (tag) => {
        try {
            const data = (await api.get(`/api/user/search/${tag}`)).data
            setUsers(data)

        } catch (error) {
            setUsers(null)
        }

    }

    const updateAccess = async (userId,access) => {
        try {
            const updated = (await api.put(`api/quiz/access`, {
                quizId,
                userId,
                access: access,
            })).data

            const data = (await api.get(`api/quiz/accessed/${quizId}`)).data;

            setAccesses(data);

        } catch (error) {
            alert('error')
        }

    }

    const showUsers = () => {
        return (users) ? users.map((item) => {
            return (
                <div className='popup-user' key={item._id}>
                    <img className="popup-user-avatar" src={item.avatar} />
                    <div className="popup-user-name">{item.name}</div>
                    <div className="popup-user-email">{item.email}</div>
                    <div className="popup-user-option" >
                        {accesses.find(i => i._id === item._id)
                            ? <FaUserMinus onClick={() => updateAccess(item._id,false)}></FaUserMinus>
                            : <FaCheck onClick={() => updateAccess(item._id,true)}></FaCheck>
                        }
                    </div>
                </div>

            )

        }) : ''
    }
    const showAccesses = () => {
        return accesses.map((item) => {
            return (
                <div className='popup-access' key={item._id}>
                    <div className="popup-access-email">{item.email}</div>
                    <div className="popup-access-option" onClick={()=>updateAccess(item._id,false)}>
                        <FaUserMinus></FaUserMinus>
                    </div>
                </div>

            )

        })

    }


    const closePopup = (e) => {
        const popup = e.target.closest('.popup-form');
        const clickedOnClosedPopup = popup;

        if (!clickedOnClosedPopup && isShow) Show(false)
    }

    return (
        <div className="popup" onClick={(e) => closePopup(e)} >
            <form className='popup-form'>
                <h2>Add New Members</h2>
                <div className="popup-user-search-panel">
                    <input type="text" className='search-input' placeholder='search...' onChange={(e) => makeResearch(e.target.value)} />

                    <div className="popup-users" style={{ boxShadow: (users) ? '0px 3px 3px #2239' : 'none' }}>
                        {showUsers()}
                    </div>
                </div>
                <div className="popup-accesses">
                    {showAccesses()}
                </div>

                <button type='button' onClick={(e) => Show(false)}>Close</button>
            </form>
        </div>
    )
}

export default SearchUserAccessPopup
