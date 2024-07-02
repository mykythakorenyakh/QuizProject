const {Router} = require('express')

const controller = require('../controllers/apiController.js')
const {isAuthorized} = require('../controllers/authController.js')

const router = Router();


router.use(isAuthorized)

//User CRUD
router.get('/user',controller.getUser)


//Quiz CRUD
router.post('/quiz/create',controller.createQuiz)
router.put('/quiz/update/:id',controller.updateQuiz)
router.delete('/quiz/delete/:id',controller.deleteQuiz)

router.get('/quiz/:id',controller.getQuiz)
router.get('/quizes',controller.getQuizes)

//Questions CRUD
router.post('/question/create/:url/:type',controller.createQuestion)
router.put('/question/update',controller.updateQuestion)
router.delete('/question/delete/:id',controller.deleteQuestion)
router.get('/question/:id',controller.getQuestion)

router.get('/questions/:url',controller.getQuestions)

router.post('/quiz/start',controller.startQuiz)
router.post('/quiz/result',controller.setResult)


module.exports = router;