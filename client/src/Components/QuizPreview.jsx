import React from 'react'
import { useNavigate } from 'react-router-dom'


const QuizPreview = ({urlid,title, status, created, updated}) => {

    const navigate = useNavigate()

    return (
        <div className="test-preview" onClick={()=>{navigate(`/dashboard/${urlid}`)}}>
            <div className="title">{title}</div>
            <div className="status" style={{color:(status==='Open')?'#128':'#8219'}}>{status}</div>
            <div className="created">{created}</div>
            <div className="updated">{updated}</div>
        </div>
    )
}

export default QuizPreview
