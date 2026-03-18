const jwt = require('jwt-simple')
const moment = require('moment')

const secret = process.env.SECRET_KEY

const createToken = (user) => {
      const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            iat: moment().unix(),
            exp: moment().add(7, 'days').unix()
      }
      return jwt.encode(payload, secret)
}

module.exports = {
      secret,
      createToken
}