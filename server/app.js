const express = require('express')
const mongoose = require('mongoose')

const cors = require('cors')

const cookieParser = require('cookie-parser')

const authRouter = require('./source/routers/authRouter.js')
const apiRouter = require('./source/routers/apiRouter.js')

const bodyParser = require('body-parser')

require('dotenv').config()

const app = express()

const path = require('path');



app.use(bodyParser.json({limit:'50mb'}))
app.use(express.urlencoded())
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND,
    credentials:true,
}))


app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/auth',authRouter);
app.use('/api',apiRouter);








mongoose.connect(process.env.DATABASE).then(() => {
    console.log('Database is ready!')
}).catch(err => {
    console.error(`Can't connect to database!`)
})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {

    console.log(`SERVER WORKS: http://localhost:${PORT} `)
})