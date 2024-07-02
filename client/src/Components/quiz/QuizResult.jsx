import React from 'react'

const QuizResult = () => {
  return (
    <div className="results-container">
            <div class="results-header">
                Results
            </div>

            <div class="info">
                <p>You passed this test in 12:00 / 30:00</p>
                <p class="errors">You made <span>1</span> mistake!</p>
                <p> <span>3 of 4 </span> correct asnwers!</p>
                <p class="result">Result: <span>75%</span></p>
            </div>

            <div class="footer">

                <button>Exit</button>
            </div>

        </div>
  )
}

export default QuizResult
