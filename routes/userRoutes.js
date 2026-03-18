const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')
const check = require('../middlewares/auth')

router.get('/prueba-usuario',  UserController.testUser)
router.post('/createUser', UserController.createUser)
router.post('/login', UserController.login)
router.get('/list', check.auth, UserController.listUsers)

module.exports = router