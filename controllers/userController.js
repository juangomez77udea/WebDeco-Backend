const UserModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('../services/jwt')

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

const login = async(req, res) => {
      let params = req.body

      if(!params.email || !params.password) {
            return res.status(400).send({
                  status: 'error',
                  message: 'Faltan datos por enviar'
            })
      }

      try {
            const user = await UserModel.findOne({ email: params.email })

            if(!user) {
                  return res.status(404).json({
                        status: 'error',
                  })
            }

            const pwd = bcrypt.compareSync(params.password, user.password)

            if(!pwd) {
                  return res.status(401).json({
                        status: 'error',
                        message: 'Credenciales incorrectas'
                  })
            }

            const token = jwt.createToken(user)

            return res.status(200).json({
                  status: 'success',
                  message: 'Login exitoso',
                  user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                  },
                  token
            })

      } catch (error) {
            console.error('Error en login de usuario: ', error)
            return res.status(500).json({
                  status: 'error',
                  message: 'Error al iniciar sesión',
                  error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'      
            })
      }
}

const listUsers = async (req, res) => {
      try {
            let page = req.params.page ? Number.parseInt(req.params.page) : 1
            let itemsPerPage = 3
            const options = {
                  page,
                  limit: itemsPerPage,
                  sort: { created_at: -1 }
            }

            const result = await UserModel.paginate({}, options)

            if(!result.docs || result.docs.length === 0) {
                  return res.status(404).json({
                        status: 'error',
                        message: 'No hay usuarios para mostrar'
                  })
            }

            return res.status(200).json({
                  status: 'success',
                  message: 'Usuarios obtenidos correctamente',
                  totalItems: result.totalDocs,
                  totalPages: result.totalPages,
                  currentPage: result.page,
                  itemsPerPage: result.limit,
                  users: result.docs
            })

      } catch (error) {
            return res.status(500).json({
                  status: 'error',
                  message: 'Error al obtner listado de usuarios'
            })
      }
} 

module.exports = { 
      testUser, 
      createUser,
      login,
      listUsers
}
