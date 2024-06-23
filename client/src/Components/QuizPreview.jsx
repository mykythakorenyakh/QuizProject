import React from 'react'
import { useNavigate } from 'react-router-dom'


const QuizPreview = ({urlid,title, status, created, updated}) => {

    const navigate = useNavigate()

    return (
        <div className="test" onClick={()=>{navigate(`/dashboard/${urlid}`)}}>
            <div className="title">{title}</div>
            <div className="status">{status}</div>
            <div className="created">{created}</div>
            <div className="updated">{updated}</div>
        </div>
    )
}

export default QuizPreview
