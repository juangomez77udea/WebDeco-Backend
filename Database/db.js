const mongoose = require('mongoose')
const colors = require('colors')

const connectDB = async () => {
      try {
            const { connection } = await mongoose.connect(process.env.MONGO_URI)
            const url = `${connection.host}:${connection.port}`
            console.log(colors.bgGreen.white.bold(`MongoDB Connected: ${url}`))
      } catch (error) {
            console.log(colors.bgRed.white.bold(error.message))
            process.exit(1)
      }
}

module.exports = { connectDB }