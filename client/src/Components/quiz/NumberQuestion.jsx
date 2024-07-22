import React from 'react'
import { useState, useEffect } from 'react'

const NumberQuestion = ({ questionsAmount, timeLimit, index, question, onNext, onPrevious, opts, timer }) => {

    const [options, setOptions] = useState([]);
    const [qtimer, setQTimer] = useState()

    useEffect(() => {
        setOptions(prev => {
            if (opts) return opts;

            return {
                value: null,
            }

        })
        setQTimer(timeLimit)
    }, [])
    useEffect(() => {

        if (timeLimit) {

            if (qtimer <= 0) {
                onNext(question._id, options)
                return
            }

            const interval = setInterval(() => {
                setQTimer(prev => Number(prev - 1));
            }, 1000);

            return () => clearInterval(interval);

        }

    }, [qtimer])

    const isOptionEntered = () => {
        return options.value != null;
    }

    const changeOption = (e) => {

        setOptions(prev => {
            return { value: prev.value = e.target.value }
        })
    }

    const showQuestions = () => {

        return (

            <div className="answers">
                <p>Enter Your Answer: </p>
                <input type='text' placeholder="0" defaultValue={options?.value} onChange={(e) => changeOption(e)}></input>
            </div>

        );

    }


    return (
        <div className="quiz-container">
            <div className="test-header">
                {qtimer ? (<div className="qtimer">
                    <span>{qtimer}</span>
                </div>) : ''}
                {
                    timer ?
                        (<div className="timer">
                            <span>{timer}</span>
                        </div>)
                        : ''
                }
                <p>
                    <span>{index}/{questionsAmount}</span>
                </p>
            </div>

            <div className="question-panel">
                <div className="question-text">
                    {question.text}
                </div>
                {question.image ? <img src={question.image} /> : ''}
            </div>

            {showQuestions()}

            <div className="buttons">
                {index > 1 ? <button className="prev" onClick={() => onPrevious()}>Back</button> : ''}
                <button className="next" onClick={() => {
                    if (question.required) {
                        if (!isOptionEntered()) return;
                    }
                    onNext(question._id, options)
                }}>{(index >= questionsAmount) ? 'Finish' : 'Next'}</button>
            </div>
        </div>
    )
}

export default NumberQuestion
