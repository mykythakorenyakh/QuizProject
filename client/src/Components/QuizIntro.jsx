import React from 'react'

const QuizIntro = ({name,questionAmount,timeLimit,onStart}) => {
  return (
    <div className="intro-container">

            <div className="quiz-header">
                {name}
            </div>

            <div className="info">
                <p>This test consist of <span>{questionAmount}</span> questions.</p>
                <p>{ !timeLimit? 'You have unlimited amount of time to pass it.': `You have ${timeLimit} minutes to pass it.`}</p>
                <p className="warning">Closeing the test will cause to fail!</p>

            </div>

            <button onClick={()=>onStart()}>Start Test</button>

        </div>
  )
}

export default QuizIntro
