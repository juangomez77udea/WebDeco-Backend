const UserModel = require('../models/userModel')
const bcrypt = require('bcrypt')

const testUser = (req, res) => {
      return res.status(200).json({
            message: 'Mensaje enviado desde controllers/userController.js',
            usuario: {
                  id: 1,
                  nombre: 'Admin de prueba',
                  role: 'admin'
            }
      })
}

const createUser = async (req, res) => {
      let params = req.body

      if (!params.name || !params.email || !params.password) {
            return res.status(400).json({
                  status: 'error',
                  message: 'Faltan datos obligatorios: name, email y password son requeridos'
            })
      }

      try {
            const existingUser = await UserModel.findOne({ email: params.email })

            if (existingUser) {
                  return res.status(409).json({
                        status: 'error',
                        message: 'El usuario ya está registrado'
                  })
            }

            params.password = await bcrypt.hash(params.password, 10)

            const user_to_save = new UserModel(params)
            await user_to_save.save()

            return res.status(201).json({
                  status: 'success',
                  message: 'Usuario creado correctamente',
                  user: user_to_save
            })

      } catch (error) {
            console.log('Error al crear el usuario:', error)
            return res.status(500).json({
                  status: 'error',
                  message: 'Error al crear el usuario',
                  error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
            })
      }
}

module.exports = { 
      testUser, 
      createUser 
}
