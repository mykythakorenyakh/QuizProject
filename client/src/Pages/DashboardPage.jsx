import React, { useEffect, useState } from 'react'

import style from './styles/dashboard.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { RotatingLines } from 'react-loader-spinner'
import useApiPrivate from '../Hooks/useApiPrivate'
import { GiConsoleController } from 'react-icons/gi'
import { FaLock,FaUnlock } from "react-icons/fa";

const DashboardPage = () => {

    const [loading, setLoading] = useState(true)
    const { url } = useParams()
    const navigate = useNavigate()
    const api = useApiPrivate()

    const [quiz,setQiuz] = useState()

    const Update = async () => {

        try {
            if (!url) navigate('/editor')
            
            const data = (await api.get(`/api/quiz/${url}`)).data;
            
            setQiuz(data)

        } catch (error) {
            navigate('/editor')
        }finally{
            setLoading(prev=>false)
        }


    }

    useEffect(() => {
        Update();
        
    }, [])


    const changeTitle = async (newTitle)=>{
        try {
            const data = (await api.put(`/api/quiz/update/${quiz._id}`,{   
                ...quiz,
                title:newTitle
            })).data;
            setQiuz(prev=>{return {...prev,title:newTitle}})
        } catch (error) {
            console.error('Something went wrong')
        }
    }

    const changeStatus= async()=>{
        try {
            const data = (await api.put(`/api/quiz/update/${quiz._id}`,{   
                ...quiz,
                private:!quiz.private
            })).data;
            setQiuz(prev=>{return {...prev,private:!quiz.private}})
        } catch (error) {
            console.error('Something went wrong')
        }
    }

    const changeRepeat= async (newRepeat)=>{
        try {
            const data = (await api.put(`/api/quiz/update/${quiz._id}`,{   
                ...quiz,
                repeat:newRepeat
            })).data;
            setQiuz(prev=>{return {...prev,repeat:newRepeat}})
        } catch (error) {
            console.error('Something went wrong')
        }
    }

    const changeLimit = async (newLimit)=>{
        try {
            const data = (await api.put(`/api/quiz/update/${quiz._id}`,{   
                ...quiz,
                timeLimit:newLimit
            })).data;
            setQiuz(prev=>{return {...prev,timeLimit:newLimit}})
        } catch (error) {
            console.error('Something went wrong')
        }
    }
    const changeDateLimit = async (newDate)=>{
        try {
            const data = (await api.put(`/api/quiz/update/${quiz._id}`,{   
                ...quiz,
                dateLimit:newDate
            })).data;
            setQiuz(prev=>{return {...prev,dateLimit:newDate}})
        } catch (error) {
            console.error('Something went wrong')
        }
    }
    const changeMixed = async (checked)=>{
        try {
            const isChecked = checked?true:false;

            const data = (await api.put(`/api/quiz/update/${quiz._id}`,{   
                ...quiz,
                mixed:checked
            })).data;
            setQiuz(prev=>{return {...prev,mixed:checked}})
        } catch (error) {
            console.error('Something went wrong')
        }
    }

    return (
        
        !loading?
            <div style={style} className="container">
            <div className="panel">
                <div className="initials">
                    <div className="section-title">
                        General
                    </div>
                    <div className="edit-title">
                        <div className="edit-icon">✎</div>
                        <input className="test-title" onBlur={(e)=>changeTitle(e.target.value)}  defaultValue={quiz.title} />
                    </div>
                    <div className="created">
                        {new Date(quiz.created).toLocaleDateString()}
                    </div>
                    <div className="link">
                        {quiz.urlid}
                    </div>
                    <div className="status" onClick={()=>changeStatus()}>

                        {quiz.private?<FaLock className="status-icon" />:<FaUnlock className="status-icon" />}
                        <div className="status-text private">{quiz.private?'Private':'Open'}</div>
                    </div>
                </div>
                <div className="graph">
                    <div className="section-title">
                        Attendance
                    </div>
                </div>
            </div>

            <div className="panel">


                <div className="questions">
                    <div className="section-title">
                        Questions
                    </div>
                    <div className="horizontal-container">
                        <div className="amount">228</div>
                        <button className="to-questions">Go to Questions Editor</button>
                    </div>
                </div>

                <div className="settings">
                    <div className="section-title">
                        Settings
                    </div>
                    <div className="options">
                        <div className="option">
                            <div className="option-text">Repeat</div>
                            <input type="number" min="0" placeholder=" -" className="option-number" defaultValue={new Number(quiz.repeat)} onBlur={(e)=>changeRepeat(e.target.value)} />
                        </div>
                        <div className="option">
                            <div className="option-text">Time Limit(In Minutes)</div>
                            <input type="number" min="0" placeholder=" ∞" className="option-number" defaultValue={new Number(quiz.timeLimit)} onBlur={(e)=>changeLimit(e.target.value)} />
                        </div>
                        <div className="option">
                            <div className="option-text">Pass Date Limit</div>
                            <input type="date" min="0" className="option-date" defaultValue={quiz.dateLimit?new Date(quiz.dateLimit).toISOString().split('T')[0]:null} onChange={(e)=>changeDateLimit(e.target.value)} />
                        </div>
                        <div className="option">
                            <div className="option-text">Mixed Order</div>
                            {quiz.mixed
                            ?<input type="checkbox" min="0" className="option-checkbox" checked='on' onClick={(e) => changeMixed(e.target.checked)} />
                            :<input type="checkbox" min="0" className="option-checkbox"  onClick={(e)=>changeMixed(e.target.checked)} />
                            }
                        </div>
                    </div>

                </div>


                <div className="scores">
                    <div className="section-title">
                        Scores
                    </div>
                    <div className="score-header">
                        <div className="email">Email</div>
                        <div className="result">Score</div>
                        <div className="remove"></div>
                    </div>
                </div>
            </div>

        </div>
        :<div style={{margin:`auto`}}><RotatingLines/></div>
    )
}

export default DashboardPage
