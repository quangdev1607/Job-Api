const User = require('../model/User')
const jwt = require('jsonwebtoken')
const { UnAuthenticatedError } = require('../errors')


const auth = async (req, res, next) => {
    //Check header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnAuthenticatedError('Authentication invalid')
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN)
        // Attach the user to the job routes
        req.user = { userId: payload.userId, username: payload.username }
        next()
    } catch (error) {
        throw new UnAuthenticatedError('Authentication invalid')
    }
}

module.exports = {
    auth
}