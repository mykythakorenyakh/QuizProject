import React from 'react'
import { useState, useEffect } from 'react'

const TextQuestion = ({ questionsAmount, index, question, onNext, onPrevious, opts, timer }) => {

    const [options, setOptions] = useState([]);

    useEffect(() => {
        setOptions(prev => {
            if (opts) return opts;

            return {
                value: null,
            }

        })
    }, [])

    const isOptionEntered = () => {
        return options.value!=null;
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
                <textarea placeholder="Enter here..." defaultChecked={options?.value}  onChange={(e)=>changeOption(e)}></textarea>
            </div>

            );

    }


    return (
        <div className="quiz-container">
            <div className="test-header">
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

export default TextQuestion
