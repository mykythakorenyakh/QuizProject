import React from 'react'

const CheckQuestion = () => {
    return (
        <div className="quiz-container">
            <div className="test-header">
                <div className="timer">
                    <span>12:00</span>
                </div>
                <p>
                    <span>1/4</span>
                </p>
            </div>

            <div className="question">
                <div className="question-text">
                    
                </div>
                <img
                    src="https://static.posters.cz/image/1300/art-photo/%D0%92%D0%BE%D0%BB%D0%BE%D0%B4%D0%B0%D1%80-%D0%BF%D0%B5%D1%80%D1%81%D0%BD%D1%96%D0%B2-gandalf-i132723.jpgs" />
            </div>
            <div className="answers">
                <table>
                    <tr>
                        <td class="answer-number">1</td>
                        <td class="answer-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore nesciunt pariatur consequatur dolore doloremque repellat natus adipisci nemo dolor quam.</td>
                        <td class="answer-answer"><input type="checkbox" name="answer" /></td>
                    </tr>
                    <tr>
                        <td class="answer-number">2</td>
                        <td class="answer-text">This is him?</td>
                        <td class="answer-answer"><input type="checkbox" name="answer" /></td>
                    </tr>
                </table>
            </div>

            <div className="buttons">
                <button className="next">Next</button>
            </div>
        </div>
    )
}

export default CheckQuestion
