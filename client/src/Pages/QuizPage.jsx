import React from 'react'
import useApiPrivate from '../Hooks/useApiPrivate'
import { useState, useEffect } from 'react'

import QuizIntro from '../Components/QuizIntro'

import styles from './styles/quiz.css'

import { RotatingLines } from 'react-loader-spinner'

import RadioQuestion from '../Components/quiz/RadioQuestion'
import CheckQuestion from '../Components/quiz/CheckQuestion'
import TextQuestion from '../Components/quiz/TextQuestion'
import NumberQuestion from '../Components/quiz/NumberQuestion'

import QuizResult from '../Components/quiz/QuizResult'

const QuizPage = () => {

    const [loading, setLoading] = useState(true)
    const [stage, setStage] = useState('intro');


    useEffect(() => {
        setTimeout(1000)

        setLoading(false)
    }, [])


    const onStart=()=>{
        setStage((prev)=>'result')
    }

    const show = () => {
        if (loading) return (<div className='container'><RotatingLines></RotatingLines></div>);

        if(stage==='intro') return ( <QuizIntro name={'Kaballas'} questionAmount={22} onStart={onStart} />)
        else if(stage === 'walkthrough') return (<NumberQuestion></NumberQuestion>)
        else if(stage === 'result') return (<QuizResult></QuizResult>)
    }

    return show()
}

export default QuizPage
