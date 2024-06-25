import React from 'react'

import useApiPrivate from '../Hooks/useApiPrivate'
import { useEffect, useRef, useState } from 'react'
import { IoImageOutline } from "react-icons/io5";

const RadioQuestion = ({ remove, isDelete, questionId, index }) => {

    const api = useApiPrivate()


    const text = useRef()
    const weight = useRef();
    const timeLimit = useRef()
    const required = useRef()

    const [image, setImage] = useState(null)

    const [options, setOptions] = useState([]);

    const Update = async () => {
        const data = (await api.get(`/api/question/${questionId}`)).data;

        text.current.value = data[0].text ? data[0].text : '';
        setOptions(data[0].options);
        const w = data[0].options.find(item => item.weight > 0)?.weight || 1
        weight.current.value = w;

        timeLimit.current.value = data[0].timeLimit
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
            options: options,
            timeLimit: timeLimit.current?.value || 0,
            required: (required.current?.checked ? true : false),
        }))
        console.log(required.current?.checked);

    }
    const changeOptions = async (newOptions) => {
        const data = (await api.put(`/api/question/update`, {
            _id: questionId,
            text: text.current.value,
            image: '',
            options: newOptions,
            timeLimit: 0,
            required: true,
        }))
        setOptions(newOptions)
    }

    const addOption = () => {
        let newId = options.at(-1).id + 1;
        setOptions(prev => { return [...prev, { id: newId, text: "Option", image: '', weight: 0 }] })

        changeOptions([...options, { id: newId, text: "Option", image: '', weight: 0 }])
    }
    const deleteOption = (index) => {
        var newOptions = [...options];
        newOptions = newOptions.filter((item, i) => i !== index)
        changeOptions(newOptions)

    }
    const updateOption = (e, index) => {
        var newOptions = [...options];
        newOptions[index].text = e.target.value;
        changeOptions(newOptions)

    }

    const changeCorrect = (index) => {
        if (!weight.current.value) {
            weight.current.value = 1;
        }
        let newOptions = [...options]
        newOptions = newOptions.map((item, i) => {
            if (i === index) {
                return { ...item, weight: weight.current.value }
            }
            return { ...item, weight: 0 }
        })
        changeOptions(newOptions)
    }

    const changeWeight = () => {
        if (!weight.current.value) {
            weight.current.value = 1;
        }
        let newOptions = [...options]
        newOptions = newOptions.map((item, i) => {
            if (item.weight > 0) {
                return { ...item, weight: weight.current.value }
            }
            return { ...item, weight: 0 }
        })
        changeOptions(newOptions)
    }

    const uploadImage = async (e) => {
        const image = URL.createObjectURL(e.target.files[0]);
        console.log(image)
        setImage(image)
    }

    return (
        <div className={`question ${isDelete ? 'delete' : ''}`} onClick={() => remove(questionId)}>
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
                        {!image ?
                            <div type='file' className="empty-image " >
                                <input type='file' accept="image/*" onChange={(e) =>uploadImage(e) }/>
                                <IoImageOutline size={100} />
                            </div>
                            : <img className="image"
                                src={image} />
                        }
                    </div>
                </div>
                <div className="quote-header">
                    Answers
                </div>
                <div className="pass-weight">
                    <p>Weight for correct answer: </p>
                    <input type="number" defaultValue={1} ref={weight} onBlur={() => { changeWeight() }} />
                </div>
                <div className="actions">
                    <table className="options">
                        <thead>
                            <tr className="radio-header">
                                <th className="answer-number">№</th>
                                <th className="answer-image">Image</th>
                                <th className="answer-text">Text</th>
                                <th className="answer-answer">Answer</th>
                                <th className="asnwer-delete"></th>
                            </tr>
                        </thead>
                        <tbody className="radio-option">
                            {options.map((item, index) => (
                                <tr className="radio-option" key={item.id}>
                                    <td className="answer-number">{index + 1}</td>
                                    <td className="answer-image"><img className="answer-no-image"
                                        src="https://cdn-icons-png.flaticon.com/256/1160/1160358.png" alt="" /></td>
                                    <td className="answer-text"><textarea placeholder="Enter answer..." onBlur={(e) => updateOption(e, index)} defaultValue={item.text}></textarea></td>
                                    <td className="answer-answer"><input type="radio" name={questionId} defaultChecked={item.weight > 0} onClick={() => changeCorrect(index)} /></td>
                                    <td className="asnwer-delete" onClick={() => deleteOption(index)} style={{ display: (options.length <= 2) ? 'none' : 'block' }}>🗑</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="add-button" onClick={() => addOption()} style={{ display: (options.length >= 10) ? 'none' : 'block' }}>Add Answer</button>
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

export default RadioQuestion
