import React, { useEffect, useState } from 'react'


import useUser from '../Hooks/useUser'
import useApiPrivate from '../Hooks/useApiPrivate'


const AccountInfo = () => {
    const api = useApiPrivate()
    const [loading,setLoading] = useState(true)
    const [email, setEmail] = useState('')
    
    useEffect(()=>{
        async function fetchData(){
            const data = (await api.get('/api/user')).data
            setEmail(data.email);
        }
        fetchData()
    },[])


    return (
        

            <div className="section selected">
                <div className="info">
                    <img src="./assets/no-image.jpg" className="avatar" />
                    <form className="details">
                        <label htmlFor="email">Change Email</label>
                        <input type="email" name="email" placeholder="Email" defaultValue={email}/>

                        <label htmlFor="name">Change Name</label>
                        <input type="text" name="name" placeholder="Name" defaultValue=''/>

                        <label htmlFor="number">Change Number</label>
                        <input type="number" name="number" placeholder="Number" defaultValue=''/>


                        <button type="submit">Change Password</button>



                    </form>
                </div>

                <div className="stats">
                    <div className="header">Scores</div>

                </div>
            </div>

        

    )
}

export default AccountInfo
