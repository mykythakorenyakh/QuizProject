import React from 'react'
import { useNavigate } from 'react-router-dom'

const QuizResult = ({score,correctAmount,questionsAmount}) => {
    const navigate = useNavigate()

  return (
    <div className="results-container">
            <div class="results-header">
                Results
            </div>

            <div class="info">
                <p>You passed this test in 12:00 / 30:00</p>
                <p class="errors">You made <span>{questionsAmount-correctAmount}</span> mistake!</p>
                <p> <span>{correctAmount} of {questionsAmount} </span> correct asnwers!</p>
                <p class="result">Result: <span>{score?score.toFixed(1)+'%':'Fail'}</span></p>
            </div>

            <div class="footer">

                <button onClick={()=>navigate('/')}>Exit</button>
            </div>

        </div>
  )
}

export default QuizResult
