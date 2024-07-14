import React, { useEffect, useRef, useState } from 'react'


import useUser from '../Hooks/useUser'
import useApiPrivate from '../Hooks/useApiPrivate'
import { RotatingLines } from 'react-loader-spinner'


const AccountInfo = () => {
    const api = useApiPrivate()
    const [loading, setLoading] = useState(true)
    const [email, setEmail] = useState('')
    const nameRef = useRef('')
    const numberRef = useRef('')
    const avatarRef = useRef('')

    const [scores, setScores] = useState(null)

    useEffect(() => {
        async function fetchData() {
            const data = (await api.get('/api/user')).data

            const scores = (await api.get('/api/results')).data



            setEmail(data.email);
            nameRef.current = data.name;
            numberRef.current = data.phone;
            avatarRef.current = data.avatar;

            setScores(scores);

            setLoading(prev => false)
        }
        fetchData()
    }, [])


    const showScores = () => {
        return scores.map((item) => {
            return (
                <div className='account-score' key={item.id}>
                    <div className="title">{item.title}</div>
                    <div className="result">{item.score}</div>
                    <div className="date">{new Date(item.passedDate).toDateString()}</div>
                </div>
            )
        })

    }

    const updateAccount = async (name,phone,avatar) => {
        console.log(name)
        const data = (await api.put('/api/user/update',{
            name:name,
            phone:phone,
            avatar:avatar,
        }))
    }



    return !loading ? (


        <div className="section selected">
            <div className="account-info">
                {(!avatarRef.current)
                    ?<img src="./assets/no-image.jpg" className="avatar" />
                    :<img src={avatarRef.current} className="avatar" />
                }
                <form className="details">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" readOnly={true} style={{ border: 'none', fontStyle: 'oblique', marginBottom: '20px', color: '#2239' }} placeholder="Email" defaultValue={email} />

                    <label htmlFor="name">Change Name</label>
                    <input type="text" name="name" placeholder="Name" defaultValue={nameRef.current}  onBlur={(e)=>updateAccount(e.target.value,null,null)} />

                    <label htmlFor="number">Change Number</label>
                    <input type="number" name="number" placeholder="Number" defaultValue={nameRef.current} onBlur={(e)=>updateAccount(null,e.target.value,null)} />


                    <button type="submit">Change Password</button>



                </form>
            </div>

            <div className="stats">
                <div className="header">Scores</div>
                <div className="account-scores">
                    {showScores()}
                </div>
            </div>
        </div>



    ) : <div style={{ margin: 'auto' }}><RotatingLines></RotatingLines></div>
}

export default AccountInfo
