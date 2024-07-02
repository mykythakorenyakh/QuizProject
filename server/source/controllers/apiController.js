const quizDB = require('../models/quiz.js')
const userDB = require('../models/user.js')
const questionDB = require('../models/question.js')
const transitQuizDB = require('../models/transitQuiz.js')
const resultsDB = require('../models/transitQuiz.js')

const { Answer } = require('../models/answer.js')

const statusService = require('../services/statusService.js')
const tokenService = require('../services/tokenService.js')
const uuid = require('uuid')

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

//Quiz CRUD
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
        console.log(req.body)
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
const startQuiz=async(req,res)=>{
    try {
        const { urlid } = req.body;

        
        const quiz = await quiz.findOne({urlid:urlid})
        if(!quiz) statusService.forbidden(res);

        const questions = await questionDB.findOne({quizId:quiz._id})
        if(!questions) statusService.forbidden(res);



        return res.json(questions)


    } catch (error) {
        return statusService.forbidden(res);
    }


}
const setResult=async (req,res)=>{
    try {
        const { urlid } = req.body;
       
        const quiz = await quiz.findOne({urlid:urlid})
        if(!quiz) statusService.forbidden(res);

        const userId = tokenService.verifyRefresh(req.cookies.token)?.id
        if (!userId) return statusService.forbidden(res);

        const {passedDate,duration,score} = req.body;

        const result = await resultsDB.create({
            quizId:quiz._id,
            userId:userId,
            passedDate:passedDate,
            duration:duration,
            score:score,
        })

        return res.json(result);
        
    } catch (error) {
        return statusService.forbidden(res);
    }
}



module.exports = {
    getUser,
    createQuiz, updateQuiz, deleteQuiz, getQuiz, getQuizes,
    createQuestion, updateQuestion, deleteQuestion, getQuestions, getQuestion,
    startQuiz,setResult
}