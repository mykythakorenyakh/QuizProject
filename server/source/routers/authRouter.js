const { Router } = require('express');

const controller = require('../controllers/authController.js')

const router = Router();


router.post('/login', controller.login)
router.post('/register', controller.register)
router.post('/logout', controller.logout)

router.get('/activate/:code', controller.activate)
router.get('/refresh', controller.refresh)



module.exports = router;