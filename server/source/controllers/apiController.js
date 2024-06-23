const quizDB = require('../models/quiz.js')
const userDB = require('../models/user.js')
const questionDB = require('../models/question.js')
const statusService = require('../services/statusService.js')
const tokenService = require('../services/tokenService.js')
const uuid = require('uuid')


//User Crud
const getUser = async (req,res)=>{
    try {   
        const userId = tokenService.verifyRefresh(req.cookies.token)?.id
        if(!userId) return statusService.forbidden(res);
        const data = await userDB.findById(userId)
        
        if(!data)  return statusService.forbidden(res);

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
        const quiz = await quizDB.findOne({urlid:quizid})

        return res.json(quiz)

    } catch (error) {
        console.error(`get quiz error`)
        return statusService.forbidden(res);
    }
}
const getQuizes = async (req, res) => {
    try {
        const userId = tokenService.verifyRefresh(req.cookies.token)?.id;

        if(!userId) return statusService.forbidden(res);

        const quizes = await quizDB.find({userId:userId})

        return res.json(quizes);
        
    } catch (error) {
        console.error(`get quiz error`)
        return statusService.forbidden(res);
    }
}


module.exports = {
    getUser,
    createQuiz, updateQuiz, deleteQuiz, getQuiz, getQuizes,

}