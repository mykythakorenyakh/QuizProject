import React, { useEffect, useState } from 'react'

const RadioQuestion = ({ questionsAmount, index, question, onNext, onPrevious, opts, timer }) => {

    const [options, setOptions] = useState([]);

    useEffect(() => {
        setOptions(prev => {
            if (opts) return opts.options;

            return question.options.map(item => {
                return {
                    id: item.id,
                    selected: false,
                }
            });


        })
    }, [])

    const isOptionSelected = () => {
        return options.find(item => item.selected);
    }

    const changeOption = (index) => {
        setOptions(prev => {
            return question.options.map(item => {
                return {
                    id: item.id,
                    selected: (index === item.id),
                }
            })


        })
    }

    const showQuestions = () => {
        return question.options.map((item, i) => {
            return (
                <tr key={i}>
                    <td className="answer-number">{i + 1}</td>
                    {item.image ? <td> <img className="answer-image" src={`${item.image}`} />  </td> : ''}
                    <td className="answer-text">{item.text}</td>
                    <td className="answer-answer"><input type="radio" name={`answer${index}`} defaultChecked={options[i]?.selected} onClick={() => changeOption(item.id)} /></td>
                </tr>
            );
        });
    }


    return (
        <div className="quiz-container">
            <div className="test-header">
                {
                    timer?
                    (<div className="timer">
                        <span>{timer}</span>
                    </div>)
                    :''
                }
                <p>
                    <span>{index}/{questionsAmount}</span>
                </p>
            </div>

            <div className="question-panel">
                <div className="question-text">
                    {question.text}
                </div>
                {question.image ? <img src={question.image} /> : ''}
            </div>

            <div className="answers">
                <table>
                    <tbody>
                        {showQuestions()}
                    </tbody>
                </table>
            </div>

            <div className="buttons">
                {index>1 ? <button className="prev" onClick={() => onPrevious()}>Back</button> : ''}
                <button className="next" onClick={() => {
                    if (question.required) {
                        if (!isOptionSelected()) return;
                    }
                    onNext(question._id, options)
                }}>{(index >= questionsAmount) ? 'Finish' : 'Next'}</button>
            </div>



        </div>

    )
}

export default RadioQuestion
