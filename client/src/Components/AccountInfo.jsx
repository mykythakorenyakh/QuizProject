import React, { useEffect, useRef, useState } from 'react'


import useUser from '../Hooks/useUser'
import useApiPrivate from '../Hooks/useApiPrivate'
import { RotatingLines } from 'react-loader-spinner'

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { IoMdCloseCircleOutline } from 'react-icons/io'

const AccountInfo = () => {
    const api = useApiPrivate()
    const [loading, setLoading] = useState(true)
    const [email, setEmail] = useState('')
    const nameRef = useRef('')
    const numberRef = useRef('')
    const [avatar,setAvatar] = useState('')

    const [scores, setScores] = useState(null)

    useEffect(() => {
        async function fetchData() {
            const data = (await api.get('/api/user')).data

            const scores = (await api.get('/api/results')).data

            setEmail(data.email);
            nameRef.current = data.name;
            numberRef.current = data.phone;
            setAvatar(data.avatar);

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

    const updateAccount = async (name, phone, avatar) => {
        console.log(phone)
        const data = (await api.put('/api/user/update', {
            name: name,
            phone: phone,
            avatar: avatar,
        })).data


        setAvatar(data.avatar)

    }

    const uploadImage = async (e) => {


        console.log(e.target.files[0])

        if(e.target.files[0].size>4194304){

            return;
        }

        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = async function (e) {
                const base64String = e.target.result;

                updateAccount(null,null,base64String)

                setAvatar(base64String);

            };
            reader.readAsDataURL(e.target.files[0]);
        }


    }
    const imageConvert = (image) => {
        if (typeof image === 'string') return image;
        return URL.createObjectURL(image);
    }


    return !loading ? (


        <div className="section selected">
            <div className="account-info">
                <div className="avatar-from">
                    
                    {(!avatar)
                        ?  <div className="avatar"> <input type="file" accept="image/*" className='image-input' onChange={(e)=>uploadImage(e)} />  </div>
                        :<div className="avatar" onClick={()=>updateAccount(null,null,{action:'delete',data:avatar})}> <img src={avatar}/> <IoMdCloseCircleOutline className='delete-avatar' size={50} /> </div>
                    }
                </div>
                <form className="details">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" readOnly={true} style={{ border: 'none', fontStyle: 'oblique', marginBottom: '20px', color: '#2239' }} placeholder="Email" defaultValue={email} />

                    <label htmlFor="name">Change Name</label>
                    <input type="text" name="name" placeholder="Name" defaultValue={nameRef.current} onBlur={(e) => updateAccount(e.target.value, null, null)} />

                    <label htmlFor="number">Change Number</label>

                    <PhoneInput
                        className="phone-input"
                        placeholder="Enter phone number"
                        value={numberRef.current}
                        onChange={(e) => updateAccount(null, e, null)} />

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
