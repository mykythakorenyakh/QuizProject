const express = require('express')
const mongoose = require('mongoose')

const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

require('dotenv').config()




const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors({
    origin: '*',
}))









mongoose.connect(process.env.DATABASE).then(() => {
    console.log('Database is ready!')
}).catch(err => {
    console.error(`Can't connect to database!`)
})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {

    console.log(`SERVER WORKS: http://localhost:${PORT} `)
})