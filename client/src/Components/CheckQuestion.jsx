import React from 'react'

import useApiPrivate from '../Hooks/useApiPrivate'
import { useEffect, useRef, useState } from 'react'


import { IoImageOutline } from "react-icons/io5";
import { IoMdCloseCircleOutline } from "react-icons/io";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CheckQuestion = ({ remove, isDelete, questionId, index }) => {

    const api = useApiPrivate()


    const text = useRef()
    const timeLimit = useRef()
    const required = useRef()

    const [options, setOptions] = useState([]);

    const [image, setImage] = useState(null)

    const Update = async () => {
        const data = (await api.get(`/api/question/${questionId}`)).data;

        text.current.value = data[0].text ? data[0].text : '';
        setOptions(data[0].options);

        timeLimit.current.value = data[0].timeLimit
        required.current.checked = data[0].required;

        setImage(data[0].image)
    }

    useEffect(() => {

        Update();

    }, [])


    const change = async () => {
        const data = (await api.put(`/api/question/update`, {
            _id: questionId,
            text: text.current.value,
            image: image,
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
        })).data
        setOptions(data.options)
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
    const changeWeight = (e, index) => {
        var newOptions = [...options];
        newOptions[index].weight = e.target.value;
        changeOptions(newOptions)
    }


    const uploadImage = async (e) => {


        console.log(e.target.files[0])

        if (e.target.files[0].size > 4194304) {
            toast.error('Media is to big! (4MB Maximum)', {
                position: "bottom-center",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }

        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = async function (e) {
                const base64String = e.target.result;

                const data = (await api.put(`/api/question/update`, {
                    _id: questionId,
                    text: text.current.value,
                    image: base64String,
                    options: options,
                    timeLimit: timeLimit.current?.value || 0,
                    required: (required.current?.checked ? true : false),
                })).data
                console.log(data.image)
                setImage(data.image)

                toast.success('Image has been uploaded!', {
                    position: "bottom-center",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

            };
            reader.readAsDataURL(e.target.files[0]);
        }


    }
    const imageConvert = (image) => {
        if (typeof image === 'string') return image;
        return URL.createObjectURL(image);
    }
    const deleteImage = async () => {
        const data = (await api.put(`/api/question/update`, {
            _id: questionId,
            text: text.current.value,
            image: {
                action: 'delete',
                data: image,
            },
            options: options,
            timeLimit: timeLimit.current?.value || 0,
            required: (required.current?.checked ? true : false),
        }))
        setImage(null)
        toast.info('Image has been deleted!', {
            position: "bottom-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }


    const uploadOptionImage = (index, e) => {
        if (e.target.files[0]) {

            if (e.target.files[0].size > 4194304) {
                toast.error('Media is to big! (4MB Maximum)', {
                    position: "bottom-center",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                return;
            }



            const reader = new FileReader();
            reader.onload = async function (e) {
                const base64String = e.target.result;

                var newOptions = options;

                newOptions[index].image = base64String;

                changeOptions(newOptions)

                toast.success('Image has been uploaded!', {
                    position: "bottom-center",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }
    const deleteOptionImage = (index) => {
        var newOptions = options;

        newOptions[index].image = {
            action: 'delete',
            data: newOptions[index].image,
        };

        changeOptions(newOptions)

        toast.info('Image has been deleted!', {
            position: "bottom-center",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
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
                            <div className="empty-image ">
                                <input type='file' accept="image/*" onChange={(e) => uploadImage(e)} />
                                <IoImageOutline size={100} />
                            </div>
                            : <div className="image" onClick={() => deleteImage()}>
                                <img src={imageConvert(image)} />
                                <IoMdCloseCircleOutline className='delete-image' size={100} />
                            </div>

                        }
                    </div>
                </div>
                <div className="quote-header">
                    Answers
                </div>
                <div className="actions">
                    <table className="options">
                        <thead>
                            <tr className="radio-header">
                                <th className="answer-number">№</th>
                                <th className="answer-image">Image</th>
                                <th className="answer-text">Text</th>
                                <th className="answer-answer">Answer</th>
                                <th className="asnwer-delete"> </th>
                            </tr>
                        </thead>
                        <tbody className="radio-option">
                            {options.map((item, index) => (
                                <tr className="radio-option" key={item.id}>
                                    <td className="answer-number">{index + 1}</td>
                                    <td className="answer-image">
                                        {!item.image ?
                                            <div className='answer-no-image'>
                                                <IoImageOutline className='answer-upload-image' />
                                                <input type='file' accept="image/*" onChange={(e) => { uploadOptionImage(index, e) }} />
                                            </div>
                                            :
                                            <div className='answer-regular-image' onClick={() => deleteOptionImage(index)}>
                                                <img src={imageConvert(item.image)} />
                                                <IoMdCloseCircleOutline className='answer-delete-image' size={50} />
                                            </div>
                                        }
                                    </td>
                                    <td className="answer-text"><textarea placeholder="Enter answer..." onBlur={(e) => updateOption(e, index)} defaultValue={item.text}></textarea></td>
                                    <td className="answer-weight"><input type="number" defaultValue={item.weight} onBlur={(e) => changeWeight(e, index)} /></td>
                                    <td className="asnwer-delete" onClick={() => deleteOption(index)} style={{ display: (options.length <= 2) ? 'none' : 'block' }} >🗑</td>
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

export default CheckQuestion
