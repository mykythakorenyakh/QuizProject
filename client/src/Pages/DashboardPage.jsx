import React, { useEffect, useState } from 'react'

import style from './styles/dashboard.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { RotatingLines } from 'react-loader-spinner'
import useApiPrivate from '../Hooks/useApiPrivate'
import { GiConsoleController } from 'react-icons/gi'
import { FaLock, FaUnlock } from "react-icons/fa";
import { LineChart } from '@mui/x-charts'
import { IoClose, IoCopy } from 'react-icons/io5'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchUserAccessPopup from '../Components/SearchUserAccessPopup'

const DashboardPage = () => {

    const [loading, setLoading] = useState(true)
    const { url } = useParams()
    const navigate = useNavigate()
    const api = useApiPrivate()

    const [quiz, setQiuz] = useState()
    const [questions, setQuestions] = useState()

    const [scores, setScores] = useState([])
    const [access, setAccess] = useState([])

    const [showUsersPopup, setShowUsersPopup] = useState(false)

    const Update = async () => {

        try {
            if (!url) navigate('/editor')

            const data = (await api.get(`/api/quiz/${url}`)).data;

            const quests = (await api.get(`/api/questions/${url}`)).data;

            const res = (await api.get(`/api/results/${url}`)).data

            const acc = (await api.get(`api/quiz/accessed/${data._id}`)).data

            setQiuz(data)
            setQuestions(quests)
            setScores(res)
            setAccess(acc)

        } catch (error) {
            navigate('/editor')
        } finally {
            setLoading(prev => false)
        }


    }

    useEffect(() => {
        Update();

    }, [])

    const changeTitle = async (newTitle) => {
        try {
            const data = (await api.put(`/api/quiz/update/${quiz._id}`, {
                ...quiz,
                title: newTitle
            })).data;
            setQiuz(prev => { return { ...prev, title: newTitle } })
        } catch (error) {
            console.error('Something went wrong')
        }
    }
    const changeStatus = async () => {
        try {
            const data = (await api.put(`/api/quiz/update/${quiz._id}`, {
                ...quiz,
                private: !quiz.private
            })).data;
            setQiuz(prev => { return { ...prev, private: !quiz.private } })
        } catch (error) {
            console.error('Something went wrong')
        }
    }
    const changeRepeat = async (newRepeat) => {
        try {
            const data = (await api.put(`/api/quiz/update/${quiz._id}`, {
                ...quiz,
                repeat: newRepeat
            })).data;
            setQiuz(prev => { return { ...prev, repeat: newRepeat } })
        } catch (error) {
            console.error('Something went wrong')
        }
    }
    const changeLimit = async (newLimit) => {
        try {
            const data = (await api.put(`/api/quiz/update/${quiz._id}`, {
                ...quiz,
                timeLimit: newLimit
            })).data;
            setQiuz(prev => { return { ...prev, timeLimit: newLimit } })
        } catch (error) {
            console.error('Something went wrong')
        }
    }
    const changeDateLimit = async (newDate) => {
        try {
            const data = (await api.put(`/api/quiz/update/${quiz._id}`, {
                ...quiz,
                dateLimit: newDate
            })).data;
            setQiuz(data)
        } catch (error) {
            console.error('Something went wrong')
        }
    }
    const changeMixed = async (checked) => {
        try {
            const isChecked = checked ? true : false;

            const data = (await api.put(`/api/quiz/update/${quiz._id}`, {
                ...quiz,
                mixed: checked
            })).data;
            setQiuz(prev => { return { ...prev, mixed: checked } })
        } catch (error) {
            console.error('Something went wrong')
        }
    }


    const removeResult = async (id) => {
        try {
            const data = await api.delete(`/api/results/delete/${id}`)
            console.log(data);
            Update();
        } catch (error) {
            console.error(error)
        }
    }
    const removeUser = async (id) => {
        try {
            const updated = (await api.put(`api/quiz/access`, {
                quizId: quiz._id,
                userId: id,
                access: false,
            })).data

            const data = (await api.get(`api/quiz/accessed/${quiz._id}`)).data;

            setAccess(data);

        } catch (error) {
            alert('error')
        }
    }

    const showResults = () => {
        if (scores) {



            console.log(scores)
            return scores.map((item) => {
                let scoreColor = '#2389'
                if (Number(item._doc.score) < 75) {
                    if (Number(item._doc.score) < 30) scoreColor = '#8329'
                    else scoreColor = '#aa39'

                }
                return (
                    <div className="score" key={item._id}>
                        <div className="email">{item.user.email}</div>
                        <div className="result" style={{color:scoreColor}}>{item._doc.score}%</div>
                        <div className="remove" onClick={() => removeResult(item._doc._id)}>⨯</div>
                    </div>
                )
            })
        }
        return <RotatingLines></RotatingLines>
    }
    const showUsers = () => {
        if (access) {
            console.log(access)
            return access.map((item) => (
                <div className="user" key={item._id}>
                    <div className="email">{item.email}</div>
                    <div className="remove" onClick={() => removeUser(item._id)}>⨯</div>
                </div>
            ))
        }
        return ''
    }


    const formatDateToDDMM = (date) => {
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        return `${day}/${month}`;
    }

    const showGraph = () => {
        const dates = [];
        const tries = [];
        const now = new Date();
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(now.getDate() - 10);

        for (let d = twoWeeksAgo; d <= now; d.setDate(d.getDate() + 1)) {

            tries.push(scores.filter(item => formatDateToDDMM(new Date(item._doc.passedDate)) === formatDateToDDMM(d))?.length)
            dates.push(new Date(d));

        }

        if (tries.filter((item) => item > 0).length === 0) {
            return <h2>No Data...</h2>;
        }

        return (
            <LineChart
                xAxis={[
                    {
                        id: 'Years',
                        data: dates,
                        scaleType: 'time',
                        valueFormatter: (date) => formatDateToDDMM(date),
                    },
                ]}
                series={[
                    {
                        id: 'Tires',
                        label: 'Number of tries',

                        data: tries,

                        area: true,
                        showMark: false,

                    },
                ]}

                height={300}
                margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
                grid={{ vertical: false, horizontal: false }}

            />
        )
    }

    const deleteQuiz = async () => {
        try {
            if (window.confirm('Are you sure?')) {
                await api.delete(`/api/quiz/delete/${quiz._id}`)
                navigate('/editor', { replace: true })
            }

        } catch (error) {

        }
    }

    const copyLink = () => {
        navigator.clipboard.writeText(`${window.location.host}/quiz/${url}`)
        toast.info('Link Saved', {
            position: "bottom-center",
            autoClose: 500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    const toQuestions = () => {
        navigate(`/questions/${quiz.urlid}`)
    }

    const toQuiz = (url) => {
        navigate(`/quiz/${url}`)
    }

    return (

        !loading ?
            <>

                {showUsersPopup ? <SearchUserAccessPopup accesses={access} setAccesses={setAccess} isShow={showUsersPopup} Show={setShowUsersPopup} quizId={quiz._id}></SearchUserAccessPopup> : ''}
                <div style={style} className="container">
                    <div className="dash-panel">
                        <div className="initials">
                            <div className="section-title">
                                General
                            </div>
                            <div className="edit-title">
                                <div className="edit-icon">✎</div>
                                <input className="test-title" onBlur={(e) => changeTitle(e.target.value)} defaultValue={quiz.title} />
                            </div>
                            <div className="created">
                                {new Date(quiz.created).toLocaleDateString()}
                            </div>
                            <div className="quiz-link" >
                                <div className="quiz-link-url" onClick={() => toQuiz(quiz.urlid)}>{quiz.urlid}</div>
                                <IoCopy size={30} style={{ cursor: 'pointer' }} onClick={() => copyLink()}></IoCopy>
                            </div>
                            <div className="status" onClick={() => changeStatus()}>

                                {quiz.private ? <FaLock className="status-icon" /> : <FaUnlock className="status-icon" />}
                                <div className="status-text private">{quiz.private ? 'Private' : 'Open'}</div>
                            </div>
                        </div>
                        <div className="graph">
                            <div className="section-title">
                                Attendance
                            </div>
                            <div className="graph-area">
                                {showGraph()}
                            </div>
                        </div>
                    </div>

                    <div className="dash-panel">


                        <div className="questions">
                            <div className="section-title">
                                Questions
                            </div>
                            <div className="horizontal-container">
                                <div className="amount">{questions.length}</div>
                                <button className="to-questions" onClick={() => toQuestions()}>Go to Questions Editor</button>
                            </div>
                        </div>

                        <div className="settings">
                            <div className="section-title">
                                Settings
                            </div>
                            <div className="options">
                                <div className="option">
                                    <div className="option-text">Repeat</div>
                                    <input type="number" min="0" placeholder=" -" className="option-number" defaultValue={new Number(quiz.repeat)} onBlur={(e) => changeRepeat(e.target.value)} />
                                </div>
                                <div className="option">
                                    <div className="option-text">Time Limit(In Minutes)</div>
                                    <input type="number" min="0" placeholder=" ∞" className="option-number" defaultValue={new Number(quiz.timeLimit)} onBlur={(e) => changeLimit(e.target.value)} />
                                </div>
                                <div className="option">
                                    <div className="option-text">Pass Date Limit</div>
                                    <input type="date" className="option-date" style={{ width: (quiz.dateLimit) ? 'auto' : '20px', cursor: 'pointer' }} value={quiz.dateLimit ? new Date(quiz.dateLimit).toISOString().split('T')[0] : null} onChange={(e) => changeDateLimit(e.target.value)} />
                                    {(quiz.dateLimit) ? <IoClose size={20} onClick={() => changeDateLimit(null)}></IoClose> : ''}
                                </div>
                                <div className="option">
                                    <div className="option-text">Mixed Order</div>
                                    {quiz.mixed
                                        ? <input type="checkbox" min="0" className="option-checkbox" checked='on' onClick={(e) => changeMixed(e.target.checked)} />
                                        : <input type="checkbox" min="0" className="option-checkbox" onClick={(e) => changeMixed(e.target.checked)} />
                                    }
                                </div>
                                <div className="option">
                                    <div className="delete-quiz-btn" onClick={() => { deleteQuiz() }}>Delete Quiz</div>
                                </div>
                            </div>

                        </div>

                        {(quiz.private) ?
                            <div className="users">
                                <div className="section-title">
                                    Access
                                </div>
                                <div className="user-list">
                                    {showUsers()}
                                </div>
                                <div className="add-access-btn" onClick={() => setShowUsersPopup(true)}>Add Users</div>
                            </div>

                            : ''}

                        <div className="scores">
                            <div className="section-title">
                                Scores
                            </div>
                            <div className="score-header">
                                <div className="email">Email</div>
                                <div className="result">Score</div>
                                <div className="remove"></div>
                            </div>
                            <div className="score-list">
                                {showResults()}
                            </div>
                        </div>
                    </div>

                </div>
            </>
            : <div style={{ margin: `auto` }}><RotatingLines /></div>
    )
}

export default DashboardPage
