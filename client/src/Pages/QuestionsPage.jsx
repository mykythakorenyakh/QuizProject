import React from 'react'
import style from './styles/questions.css'

import { RotatingLines } from 'react-loader-spinner'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import RadioQuestion from '../Components/RadioQuestion'

import useApiPrivate from '../Hooks/useApiPrivate'
import CheckQuestion from '../Components/CheckQuestion'
import TextQuestion from '../Components/TextQuestion'
import NumberQuestion from '../Components/NumberQuestion'


const QuestionsPage = () => {

    const api = useApiPrivate()

    const { url } = useParams()
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [del, setDel] = useState(false)

    const Update = async () => {
        try {
            if (url) {
                const data = (await api.get(`/api/questions/${url}`)).data
                if (data) {
                    setQuestions(data)
                }
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        Update();

    }, [])

    const addNewQuestion = async (type) => {
        try {
            const data = (await api.post(`/api/question/create/${url}/${type}`)).data
            setQuestions(prev => { return [...prev, data] });

        } catch (error) {
            console.error(error)
        }
    }

    const remove = async (id) => {
        if (del) {
            try {
                const data = (await api.delete(`/api/question/delete/${id}`)).data
                let newQuestions = [...questions];
                newQuestions = newQuestions.filter(item => item._id !== id)
                setQuestions(newQuestions)

            } catch (error) {
                console.error(error)
            }
        }
    }

    const showQuestions = () => {
        return questions.map((item, index) => {
            console.log(item.type)
            if (item.type === 'radio') {
                return (<RadioQuestion remove={remove} isDelete={del} key={item._id} questionId={item._id} index={index} />)
            } else if (item.type === 'check') {
                return (<CheckQuestion remove={remove} isDelete={del} key={item._id} questionId={item._id} index={index} />)
            }
            else if (item.type === 'text') {
                return (<TextQuestion remove={remove} isDelete={del} key={item._id} questionId={item._id} index={index} />)
            }
            else if (item.type === 'number') {
                return (<NumberQuestion remove={remove} isDelete={del} key={item._id} questionId={item._id} index={index} />)
            }
        })
    }

    return (!loading) ? (
        <>

            <div className="turn-on-panel">
                <div className="edit-panel">
                    <div className="add-question" onClick={() => addNewQuestion('radio')}>Radio</div>
                    <div className="add-question" onClick={() => addNewQuestion('check')} >Checkbox</div>
                    <div className="add-question" onClick={() => addNewQuestion('text')} >Text</div>
                    <div className="add-question" onClick={() => addNewQuestion('number')} >Number</div>
                    <div className="division-line"> </div>
                    <div className="delete-question" onClick={() => setDel(prev => !prev)}>{del?'Stop':'Delete'}</div>
                </div>
                <button disabled>▶</button>
            </div>

            <div className={`question-container`}>



                {showQuestions()}
            </div>
        </>
    )
        : <div className='container'> <RotatingLines style={{ margin: `auto` }} /></div>
}

export default QuestionsPage
