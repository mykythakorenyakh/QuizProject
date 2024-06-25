import React from 'react'

import useApiPrivate from '../Hooks/useApiPrivate'
import { useEffect, useRef, useState } from 'react'

const TextQuestion = ({ remove,isDelete,questionId, index }) => {

    const api = useApiPrivate()


    const text = useRef()

    const answer = useRef()
    const weight = useRef()

    const timeLimit = useRef()
    const required = useRef()


    const Update = async () => {
        const data = (await api.get(`/api/question/${questionId}`)).data;

        text.current.value = data[0].text ? data[0].text : '';

        answer.current.value = data[0].options.text;
        weight.current.value = data[0].options.weight || 0;

        timeLimit.current.value = data[0].timeLimit;
        required.current.checked = data[0].required;

    }

    useEffect(() => {

        Update();

    }, [])


    const change = async () => {
        const data = (await api.put(`/api/question/update`, {
            _id: questionId,
            text: text.current.value,
            image: '',
            options: {
                id:0,
                text:answer.current.value || "",
                image:'',
                weight:weight.current.value || 0
            },
            timeLimit: timeLimit.current?.value || 0,
            required: (required.current?.checked ? true : false),
        }))
        console.log(required.current?.checked);

    }


    return (
        <div className={`question ${isDelete?'delete':''}`} onClick={()=>remove(questionId)}>
            <div className="question-header">
                <div className="question-number">
                    <span>{index + 1}</span>
                </div>
            </div>
            <div className="question-body">
                <div className="quote-header">
                    Quote
                </div>
                <div className="quote">
                    <textarea placeholder="Enter question here..." ref={text} onBlur={() => change()}></textarea>
                    <div className="image-area">
                        <img className="empty-image " src="https://cdn-icons-png.flaticon.com/256/1160/1160358.png" />
                        <img className="image hide"
                            src="https://static.displate.com/270x380/displate/2024-02-01/ac39f43f05e45b9666e929ba83e6eba1_fe997e109168f39e6d3f4b20f20cf5e1.jpg" />
                    </div>
                </div>
                <div className="quote-header">
                    Answers
                </div>
                <div className="pass-weight">
                        <p>Weight for correct answer: </p>
                        <input type="number" ref={weight} onBlur={()=>{change()}}/>
                    </div>
                    <div className="actions">
                        <div className="single-answer">
                            <p>Enter Correct Answer</p>
                            <textarea placeholder="Enter..." ref={answer} onBlur={()=>{change()}}></textarea>
                        </div>
                    </div>
            </div>
            <div className="additional">
                <div className="quote-header">
                    Additional
                </div>
                <div className="additional-options">
                    <div className="additional-option">
                        <p>Limit Time (In Seconds)</p>
                        <input type="number" placeholder="None" defaultValue={null} ref={timeLimit} onBlur={() => change()} />
                    </div>
                    <div className="additional-option">
                        <p>Answer Required</p>
                        <input type="checkbox" defaultValue={null} ref={required} onClick={() => change()} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TextQuestion
