import React from 'react'

const QuizIntro = ({name,questionAmount,onStart}) => {
  return (
    <div className="intro-container">

            <div className="quiz-header">
                {name}
            </div>

            <div className="info">
                <p>This test consist of <span>{questionAmount}</span> questions.</p>
                <p>You have unlimited amount of time to pass it.</p>
                <p className="warning">Closeing the test will cause to fail!</p>

            </div>

            <button onClick={()=>onStart()}>Start Test</button>

        </div>
  )
}

export default QuizIntro
