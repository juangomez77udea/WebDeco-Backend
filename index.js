const express = require('express')
const cors = require('cors')
const { connectDB } = require('./Database/db')

require('dotenv').config()

connectDB()

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Cargar las rutas
const UserRoutes = require('./routes/userRoutes')

//ruta de prueba
app.get('/ruta-prueba', (req, res) => {
      return res.status(200).json({
            "id": 1,
            "nombre": "Juan",
            "web": "juan.gomezweb.co"
      })
})

app.use('/api/user/', UserRoutes)


app.listen(port, () => {
      console.log(`Servidor conectado en puerto ${port}`)
})