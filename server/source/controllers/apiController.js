const quizDB = require('../models/quiz.js')
const userDB = require('../models/user.js')
const questionDB = require('../models/question.js')
const resultsDB = require('../models/results.js')
const quizAccessDB = require('../models/quizAccess.js')

const { Answer } = require('../models/answer.js')

const statusService = require('../services/statusService.js')
const tokenService = require('../services/tokenService.js')
const uuid = require('uuid')
const bcrypt = require('bcrypt')

const imageService = require('../services/imageService.js')
const quiz = require('../models/quiz.js')
const { request } = require('http')


//User Crud
const getUser = async (req, res) => {
    try {
        const userId = tokenService.verifyRefresh(req.cookies.token)?.id
        if (!userId) return statusService.forbidden(res);
        const data = await userDB.findById(userId)

        if (!data) return statusService.forbidden(res);

        return res.json(data)

    } catch (error) {
        console.error(`get user error`)
        return statusService.forbidden(res);
    }
}
const updateUser = async (req, res) => {
    try {
        const userId = tokenService.verifyRefresh(req.cookies.token)?.id
        if (!userId) return statusService.forbidden(res);

        const user = await userDB.findOne({ _id: userId });

        const { name, phone, avatar } = req.body;
        console.log(avatar)

        name ? user.name = name : '';
        phone ? user.phone = phone : '';

        if (avatar) {
            user.avatar = imageService.initImage(avatar)
        }




        await user.save();

        return res.json(user);

    } catch (error) {
        return statusService.forbidden(res);
    }
}
const changePassword = async (req, res) => {
    try {
        const {newpass} = req.body;

        console.log(newpass)

        const userId = tokenService.verifyRefresh(req.cookies.token)?.id
        if (!userId) return statusService.forbidden(res);

        const user = await userDB.findById(userId);

        const encrypted = await bcrypt.hash(newpass, bcrypt.genSaltSync(10))

        user.password = encrypted;

        user.save()

        return res.json('changed')
    
    } catch (error) {
        return statusService.forbidden(res);
    }
}
const searchUsers = async (req, res) => {
    try {

        const { tag } = req.params;

        const userId = tokenService.verifyRefresh(req.cookies.token)?.id
        if (!userId) return statusService.forbidden(res);

        const users = await userDB.find();


        return res.json(users.filter((item) => {
            return item._id != userId && String(item.email).includes(tag);
        }))

    } catch (error) {
        return statusService.forbidden(res);
    }
}
const getAccessedUsers = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await quizAccessDB.find({ quizId: id })

        let users = []
        for (let i = 0; i < data.length; i++) {
            const user = await userDB.findById(data[i].userId)
            users.push(user)
        }

        return res.json(users)

    } catch (error) {
        return statusService.forbidden(res);
    }
}
const haveAccess = async (req, res) => {
    try {
        const { id } = req.params;

        const userId = tokenService.verifyRefresh(req.cookies.token)?.id
        if (!userId) return statusService.forbidden(res);

        const isAdmin = await quizDB.findOne({ userId: userId, _id: id })
        const quiz = await quizDB.findById(id);


        if (quiz.dateLimit) {
            if (new Date(Date.now()).getDate() > new Date((quiz.dateLimit)).getDate()) {
                return res.json(null)
            }
        }

        if (quiz.repeat > 0) {
            const userResults = await resultsDB.find({ quizId: id, userId: userId })
            if (Number(userResults.length) >= Number(quiz.repeat)) {
                return res.json(null)

            }
        }


        if (isAdmin) {
            return res.json("admin")
        }


        if (quiz.private) {
            const data = await quizAccessDB.find({ quizId: id, userId: userId })
            return res.json(data.length);
        }

        return res.json('allowed');

    } catch (error) {
        return statusService.forbidden(res);
    }
}

//Quiz CRUD
const setQuizAccess = async (req, res) => {
    try {
        const { userId, quizId, access } = req.body;

        if (access) {
            const data = await quizAccessDB.create({ quizId, userId });


            return res.json(data)
        }

        const del = await quizAccessDB.findOneAndDelete({ quizId, userId })
        return res.json(del)



    } catch (error) {
        return statusService.forbidden(res);
    }

}

const createQuiz = async (req, res) => {
    try {


        const { title } = req.body;
        const userId = tokenService.verifyRefresh(req.cookies.token)?.id
        const url = uuid.v1();

        if (!title || !userId || !url) return statusService.forbidden(res);

        const newQuiz = await quizDB.create({
            userId: userId,
            title: title,
            urlid: url,
        });

        return res.json(newQuiz);

    } catch (error) {
        console.error(`create quiz error`)
        return statusService.forbidden(res);
    }
}
const updateQuiz = async (req, res) => {

    try {
        const quizid = req.params?.id;
        const { title, private, repeat, timeLimit, dateLimit, mixed } = req.body;

        const quiz = await quizDB.findOne({ _id: quizid });


        if (!quiz) return statusService.forbidden(res);



        quiz.title = title;
        quiz.private = private;
        quiz.repeat = repeat;
        quiz.timeLimit = timeLimit;
        quiz.dateLimit = dateLimit;
        quiz.mixed = mixed;

        quiz.updated = Date.now();


        await quiz.save();

        return res.json(quiz)

    } catch (error) {
        console.error(`update quiz error`)
        return statusService.forbidden(res);
    }
}
const deleteQuiz = async (req, res) => {
    try {
        const quizid = req.params?.id;
        const quiz = await quizDB.findByIdAndDelete(quizid)
        return res.json(quiz)

    } catch (error) {
        console.error(`delete quiz error`)
        return statusService.forbidden(res);
    }
}
const getQuiz = async (req, res) => {
    try {
        const quizid = req.params?.id;
        const quiz = await quizDB.findOne({ urlid: quizid })

        return res.json(quiz)

    } catch (error) {
        console.error(`get quiz error`)
        return statusService.forbidden(res);
    }
}
const getQuizes = async (req, res) => {
    try {
        const userId = tokenService.verifyRefresh(req.cookies.token)?.id;

        if (!userId) return statusService.forbidden(res);

        const quizes = await quizDB.find({ userId: userId })

        return res.json(quizes);

    } catch (error) {
        console.error(`get quiz error`)
        return statusService.forbidden(res);
    }
}

//Questions CRUD
const createQuestion = async (req, res) => {
    try {
        const { url, type } = req.params;

        if (!url || !type) statusService.forbidden(res);

        const quiz = await quizDB.findOne({ urlid: url })
        if (!quiz) statusService.forbidden(res);

        let options = {}
        if (type === 'radio' || type === 'check') {
            options = [
                {
                    id: 0,
                    text: 'option 1',
                    image: '',
                    weight: '1'
                },
                {
                    id: 1,
                    text: 'option 2',
                    image: '',
                    weight: '0'
                },
            ]

        }
        if (type === 'text' || type === 'number') {
            options = {
                id: 0,
                text: '',
                image: '',
                weight: ''
            }
        }

        const newQuestion = await questionDB.create({
            quizId: quiz._id,
            type: type,
            options: options,
            timeLimit: 0,
            required: true,
        });


        return res.json(newQuestion)

    } catch (error) {
        return statusService.forbidden(res);
    }
}


const getQuestions = async (req, res) => {
    try {
        const { url } = req.params;
        if (!url) return statusService.forbidden(res);

        const quiz = await quizDB.findOne({ urlid: url })
        if (!quiz) statusService.forbidden(res);

        const data = await questionDB.find({ quizId: quiz._id });

        return res.json(data);


    } catch (error) {
        return statusService.forbidden(res);
    }
}

const updateQuestion = async (req, res) => {
    try {
        const question = req.body;

        //console.log(req.body.image)


        if (!question) statusService.forbidden(res);


        const oldQuestion = await questionDB.findById(question._id);

        if (!oldQuestion) return statusService.forbidden(res);

        var image = imageService.initImage(req.body.image)

        var options = req.body.options;
        if (oldQuestion.type === 'radio' || oldQuestion.type === 'check') {
            var options = req.body.options.map((item) => {
                item.image = imageService.initImage(item.image)
                return item;
            })
        }

        oldQuestion.text = question.text;
        oldQuestion.image = image;
        oldQuestion.options = question.options;
        oldQuestion.timeLimit = question.timeLimit ? question.timeLimit : 0;
        oldQuestion.required = question.required;

        await oldQuestion.save();

        return res.json(oldQuestion);

    } catch (error) {
        console.log(error)
        return statusService.forbidden(res);
    }

}

const deleteQuestion = async (req, res) => {
    try {
        const id = req.params?.id;

        if (!id) return statusService.forbidden(res);

        const data = await questionDB.findByIdAndDelete(id);
        if (!data) return statusService.forbidden(res);

        return res.json(data);

    } catch (error) {
        return statusService.forbidden(res);
    }
}

const getQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return statusService.forbidden(res);


        const data = await questionDB.find({ _id: id });
        if (!data) return statusService.forbidden(res);

        return res.json(data);


    } catch (error) {
        return statusService.forbidden(res);
    }
}


//Quiz Results
const startQuiz = async (req, res) => {
    try {
        const { urlid } = req.body;


        const quiz = await quizDB.findOne({ urlid: urlid })
        if (!quiz) statusService.forbidden(res);



        let questions = await questionDB.find({ quizId: quiz._id })
        if (!questions) statusService.forbidden(res);


        if (quiz.mixed) {
            questions = questions.sort((item) => {
                return Math.random() * 100 - 50;
            });

        }

        return res.json({
            quiz,
            questions
        })


    } catch (error) {
        return statusService.forbidden(res);
    }


}
const setResult = async (req, res) => {
    try {
        const { urlid } = req.body;

        const quiz = await quizDB.findOne({ urlid: urlid })
        if (!quiz) statusService.forbidden(res);


        const userId = tokenService.verifyRefresh(req.cookies.token)?.id
        if (!userId) return statusService.forbidden(res);

        const questions = await questionDB.find({ quizId: quiz._id })
        if (!questions) statusService.forbidden(res);


        const { passedDate, duration, answers } = req.body;

        let score = 0;
        let correctAmount = 0;
        let maxWeight = 0;

        if (answers) {
            questions.map((quest) => {
                if (quest.type === 'radio') {
                    let answ = answers.find(item => item.id == quest._id)
                    //console.log(answ)

                    if (answ) {
                        let correctOption = quest.options.find(item => item.weight > 0);
                        maxWeight = Number(maxWeight) + Number(correctOption.weight);
                        if (answ.options.find(item => item.id === correctOption.id)?.selected) {
                            correctAmount = correctAmount + 1;
                            score = Number(score) + Number(correctOption.weight);
                        }
                    }
                } else if (quest.type === 'check') {
                    let answ = answers.find(item => item.id == quest._id)

                    if (answ) {
                        let correctOptions = quest.options.filter(item => item.weight > 0);

                        correctOptions.map(item => {
                            maxWeight = Number(maxWeight) + Number(item.weight);
                        });

                        if (correctOptions.length < answ.options.filter(item => item.selected).length) {
                            return;
                        }


                        let correctCount = 0;

                        correctOptions.map(item => {

                            if (answ.options.find(a => a.id === item.id)?.selected) {
                                score = Number(score) + Number(item.weight);
                                correctCount = Number(correctCount) + 1
                            }
                            return item;
                        })
                        if (correctCount === correctOptions.length) {
                            correctAmount = correctAmount + 1;
                        }


                    }
                } else if (quest.type === 'number') {
                    let answ = answers.find(item => item.id == quest._id)
                    if (answ) {
                        maxWeight = Number(maxWeight) + Number(quest.options.weight);
                        if (Number(quest.options.text) === Number(answ.options.value)) {
                            correctAmount = Number(correctAmount) + 1;
                            score = Number(score) + Number(quest.options.weight);

                        }
                    }
                } else if (quest.type === 'text') {
                    let answ = answers.find(item => item.id == quest._id)
                    if (answ) {
                        maxWeight = Number(maxWeight) + Number(quest.options.weight);
                        if (quest.options.text === answ.options.value) {
                            correctAmount = Number(correctAmount) + 1;
                            score = Number(score) + Number(quest.options.weight);

                        }
                    }
                }
            })
        }

        const result = await resultsDB.create({
            quizId: quiz._id,
            userId: userId,
            passedDate: passedDate,
            duration: duration,
            score: ((score / maxWeight) * 100).toFixed(1),
        })


        return res.json({
            score: (score / maxWeight) * 100,
            correct: correctAmount,
        });

    } catch (error) {
        console.log(error)
        return statusService.forbidden(res);
    }
}

const getResults = async (req, res) => {
    try {
        const { url } = req.params;
        if (!url) return statusService.forbidden(res);

        const quiz = await quizDB.findOne({ urlid: url })
        if (!quiz) statusService.forbidden(res);

        const results = await resultsDB.find({ quizId: quiz._id });

        let data = []



        for (let i = 0; i < results.length; i++) {

            let user = await userDB.findOne({ _id: results[i].userId })
            data.push({
                ...results[i],
                user,
            });
        }



        return res.json(data)


    } catch (error) {
        return statusService.forbidden(res);
    }
}
const getResultsByUserId = async (req, res) => {
    try {

        const userId = tokenService.verifyRefresh(req.cookies.token)?.id
        if (!userId) return statusService.forbidden(res);

        const scores = await resultsDB.find({ userId: userId })

        let set = []
        for (let i = 0; i < scores.length; i++) {
            let quiz = await quizDB.findOne({ _id: scores[i].quizId })

            set.push({
                id: scores[i]._id,
                title: quiz.title,
                score: scores[i].score,
                passedDate: scores[i].passedDate,
            })

        }

        return res.json(set)


    } catch (error) {
        return statusService.forbidden(res);
    }
}

const deleteResult = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await resultsDB.deleteOne({ _id: id })


        return res.json(data);

    } catch (error) {
        return statusService.forbidden(res);
    }
}

const getUsersResults = async (req, res) => {
    try {
        const { url } = req.params;
        const userId = tokenService.verifyRefresh(req.cookies.token)?.id
        if (!userId) return statusService.forbidden(res);

        const quiz = await quizDB.findOne({ urlid: url })
        if (!quiz) statusService.forbidden(res);

        const data = await resultsDB.find({ userId: userId, quizId: quiz._id })



        console.log(data)

        return res.send(data.length);


    } catch (error) {
        return statusService.forbidden(res);
    }
}

module.exports = {
    getUser, updateUser, searchUsers, getAccessedUsers, haveAccess, changePassword,
    createQuiz, updateQuiz, deleteQuiz, getQuiz, getQuizes, setQuizAccess,
    createQuestion, updateQuestion, deleteQuestion, getQuestions, getQuestion,
    startQuiz, setResult, getResults, deleteResult, getUsersResults, getResultsByUserId
}