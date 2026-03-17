const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')

router.get('/prueba-usuario',  UserController.testUser)
router.post('/createUser', UserController.createUser)


module.exports = router