import React from 'react'

import useApiPrivate from '../Hooks/useApiPrivate'
import { useEffect, useRef, useState } from 'react'

import { IoImageOutline } from "react-icons/io5";
import { IoMdCloseCircleOutline } from "react-icons/io";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NumberQuestion = ({ remove,isDelete,questionId, index }) => {

    const api = useApiPrivate()


    const text = useRef()

    const answer = useRef()
    const weight = useRef()

    const timeLimit = useRef()
    const required = useRef()

    
    const [image, setImage] = useState(null)


    const Update = async () => {
        const data = (await api.get(`/api/question/${questionId}`)).data;

        text.current.value = data[0].text ? data[0].text : '';

        answer.current.value = data[0].options.text;
        weight.current.value = data[0].options.weight || 0;

        timeLimit.current.value = data[0].timeLimit;
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

        
    const uploadImage = async (e) => {


        console.log(e.target.files[0])

        if(e.target.files[0].size>4194304){
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
                    options: {
                        id:0,
                        text:answer.current.value || "",
                        image:'',
                        weight:weight.current.value || 0
                    },
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
            options: {
                id:0,
                text:answer.current.value || "",
                image:'',
                weight:weight.current.value || 0
            },
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
                <div className="pass-weight">
                        <p>Weight for correct answer: </p>
                        <input type="number" ref={weight} onBlur={()=>{change()}}/>
                    </div>
                    <div className="actions">
                        <div className="single-answer">
                            <p>Enter Correct Answer</p>
                            <input type="number" ref={answer}  onBlur={()=>{change()}}/>
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

export default NumberQuestion
