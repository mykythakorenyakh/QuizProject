import React from 'react'

const RadioQuestion = () => {
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
                        <td className="answer-number">1</td>
                        <td><img className="answer-image" src="https://images.ontheedgebrands.com/cdn-cgi/image/f=auto,height=700,width=700,quality=90/images/E45-UC1386.jpg" /></td>
                        <td className="answer-text">This is him?</td>
                        <td className="answer-answer"><input type="radio" name="answer" /></td>
                    </tr>
                    <tr>
                        <td className="answer-number">2</td>
                        <td><img className="answer-image" src="https://images.ontheedgebrands.com/cdn-cgi/image/f=auto,height=700,width=700,quality=90/images/E45-UC1386.jpg" /></td>
                        <td className="answer-text">This is him?</td>
                        <td className="answer-answer"><input type="radio" name="answer" /></td>
                    </tr>
                </table>
            </div>

            <div className="buttons">
                <button className="next">Next</button>
            </div>
        </div>

    )
}

export default RadioQuestion
