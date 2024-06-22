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
router.post('/qestion/create/:type')
router.put('/qestion/update/:id')
router.delete('/qestion/delete/:id')

router.get('/qestions/:quizid')




module.exports = router;