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
import { useNavigate, useParams } from 'react-router-dom'
import QuizNotAllowed from '../Components/QuizNotAllowed'

const QuizPage = () => {

    const [loading, setLoading] = useState(true);
    const [stage, setStage] = useState('intro');

    const [questions, setQuestions] = useState([])
    const [quiz, setQuiz] = useState({});

    const [answers, setAnswers] = useState([])

    const [current, setCurrent] = useState(0)

    const [score, setScore] = useState(0)
    const [correctAmount, setCorrectAmount] = useState(0)

    const [timer,setTimer] = useState(0)
    const [startTimer,setStartTimer] = useState(false)

    const navigate = useNavigate()

    const { url } = useParams()

    const api = useApiPrivate();


    const getData = async () => {
        try {

            const data = (await api.post('/api/quiz/start', {
                urlid: url,
            })).data


            if(data.quiz.private){
            const access = (await api.get(`/api/quiz/haveaccess/${data.quiz._id}`)).data
           
                if(!access){

                    return setStage('notallowed')
                }

            }

            setQuiz(prev => data.quiz)

            setQuestions(prev => {
                return [...data.questions];
            })
            console.log(data.quiz.timeLimit)
            setTimer(prev=>Number(data.quiz.timeLimit)*60)


            const res = (await api.get(`/api/results/${url}`)).data
            
            
            if(Number(res.length)>=Number(data.quiz.repeat) || new Date(data.quiz.dateLimit) < Date.now()){
                
                setStage(prev=>'notallowed')
                
            }


        } catch (error) {
            navigate('/error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getData()
    }, [])
    useEffect(() => {
        getData();

    }, [current])

    useEffect(()=>{
        if(startTimer && stage!='result'){
            console.log(timer)

            if(timer<=0){
                setStartTimer(prev=>false);
                failResult();
                setStage(prev=>'result');
            }

            const interval = setInterval(() => {
                setTimer(prev=>Number(prev-1));
              }, 1000);
          
              return () => clearInterval(interval);

        }

    },[startTimer,timer])

    const onStart = () => {
        if(timer!=0){
            setStartTimer(true)
        }
        setStage((prev) => 'walkthrough')
    }
    const calcResult = async (answ) => {
        if (answers) {
            const data = (await api.post('/api/quiz/result', {
                urlid: quiz.urlid,
                passedDate: Date.now(),
                duration: 1,
                answers: answ

            })).data
            console.log(data);

            setCorrectAmount(prev => data.correct);
            setScore(prev => data.score);

            setStage(prev => 'result')

            setLoading(prev => false);
        }
    }
    const failResult = async()=>{
        const data = (await api.post('/api/quiz/result', {
            urlid: quiz.urlid,
            passedDate: Date.now(),
            duration: 1,
            answers: null

        })).data
        console.log(data);

        setCorrectAmount(prev => data.correct);
        setScore(prev => data.score);

        setStage(prev => 'result')

        setLoading(prev => false);
    }
    const next = (id, options) => {
        console.log(quiz)

        setCurrent(prev => prev + 1);


        setAnswers(prev => {
            if (!prev.find(item => item.id === id)) return [...prev, { id, options }]
            else {
                const newAnswers = [...prev];
                return newAnswers.map(item => {
                    if (item.id === id) {
                        return { id, options }
                    } else {
                        return item;
                    }
                })
            }
        })


        if (questions && questions.length >= 0) {
            if (current + 1 >= questions.length) {
                setLoading(prev => true);
                setStage((prev) => 'result')
                calcResult([...answers, { id, options }]);
                return;
            }

        }




    }
    const previuos = () => {
        setCurrent(prev => prev - 1);
    }


    const secondsToMMSS=(seconds) => {
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = seconds % 60;
    
        // Add leading zero if seconds or minutes are less than 10
        minutes = minutes < 10 ? '0' + minutes : minutes;
        remainingSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    
        return minutes + ':' + remainingSeconds;
    }
    const showQuestion = () => {

        const opts = answers.find(itm => itm.id === questions[current]._id);
        if (questions[current].type === 'radio') {
            return (<RadioQuestion
                index={current + 1}
                questionsAmount={questions.length}
                question={questions[current]}
                onNext={next}
                onPrevious={previuos}
                opts={opts ? opts : null}
                timer={timer?secondsToMMSS(timer):null}
                key={questions[current]._id}
            />)
        }else if(questions[current].type === 'check'){
            return (<CheckQuestion
                index={current + 1}
                questionsAmount={questions.length}
                question={questions[current]}
                onNext={next}
                onPrevious={previuos}
                opts={opts ? opts : null}
                timer={timer?secondsToMMSS(timer):null}
                key={questions[current]._id}
            />)
        }
        else if(questions[current].type === 'number'){
            return (<NumberQuestion
                index={current + 1}
                questionsAmount={questions.length}
                question={questions[current]}
                onNext={next}
                onPrevious={previuos}
                opts={opts ? opts : null}
                timer={timer?secondsToMMSS(timer):null}
                key={questions[current]._id}
            />)
        }
        else if(questions[current].type === 'text'){
            return (<TextQuestion
                index={current + 1}
                questionsAmount={questions.length}
                question={questions[current]}
                onNext={next}
                onPrevious={previuos}
                opts={opts ? opts : null}
                timer={timer?secondsToMMSS(timer):null}
                key={questions[current]._id}
            />)
        }
        /*return data.questions.map((item, index) => {

            

            if (item.type === 'radio') return (<RadioQuestion
                index={index + 1}
                questionsAmount={data.questions.length}
                question={item}
                onNext={next}
                onPrevious={previuos}
                opts={opts ? opts : null}
                key={index}
            />)
            else if (item.type === 'check') return (<CheckQuestion key={index} />)
            else if (item === 'number') return (<NumberQuestion key={index} />)
            else if (item === 'text') return (<TextQuestion key={index} />)

        })*/

    }



    const show = () => {
        if (loading) return (<div className='container'><RotatingLines></RotatingLines></div>);

        if (stage === 'intro') return (<QuizIntro name={quiz.title} timeLimit={quiz.timeLimit} questionAmount={questions.length} onStart={onStart} />)
        else if (stage === 'walkthrough') return showQuestion()
        else if (stage === 'result') return (<QuizResult score={score} correctAmount={correctAmount} questionsAmount={questions.length}></QuizResult>)
        else if(stage === 'notallowed') return (<QuizNotAllowed/>)
    }

    return show()
}

export default QuizPage
