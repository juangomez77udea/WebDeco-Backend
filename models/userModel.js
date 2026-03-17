const { Schema, model } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const UserSchema = new Schema({
      name: {
            type: String,
            trim: true,
            default: ''
      },
      email: {
            type: String,
            required: [true, 'El email es obligatorio'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  'El formato del email no es válido'
            ]
      },
      password: {
            type: String,
            required: [true, 'La contraseña es obligatoria'],
            minlength: [8, 'La contraseña debe tener al menos 8 caracteres']
      },
      role: {
            type: String,
            enum: {
                  values: ['admin', 'user'],
                  message: 'El rol "{VALUE}" no es válido. Use "admin" o "user"'
            },
            default: 'user'
      },
      created_at: {
            type: Date,
            default: Date.now
      }
})

UserSchema.plugin(mongoosePaginate)

module.exports = model('User', UserSchema, 'users')