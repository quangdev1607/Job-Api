//----------------------REQUIRE------------------------------
require('dotenv').config()
require('express-async-errors')

// Extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')


const express = require('express')
const app = express()
const jobRouter = require('./src/routes/job.route')
const authRouter = require('./src/routes/auth.route')
const { auth } = require('./src/middleware/authMiddleware')

const notFoundMiddleware = require('./src/middleware/notFoundMiddleware')
const errorHandlerMiddleware = require('./src/middleware/errorHandler')
//----------------------DB---------------------------
const { connectDB } = require('./src/db/connect')
//----------------------General---------------------------
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, //15 mins
    limit: 100, // Limit each IP to 100 req per windowMs
}))
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())


//------------------------Routes------------------------
app.get('/', (req, res) => {
    res.send("Job api homepage")
})
app.use('/api/auth', authRouter)
app.use('/api/jobs', auth, jobRouter)

//-------------------------Error handler--------------------------
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

//-------------------------PORT------------------------
const port = process.env.PORT || 8080
const start = async () => {
    try {
        connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Listening on port ${port}`)
        });
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
start()
