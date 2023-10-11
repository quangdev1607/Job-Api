const User = require('../model/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnAuthenticatedError } = require('../errors')

//----------Controller---------------------------
class AuthController {
    async register(req, res) {
        const user = await User.create({ ...req.body })
        const accessToken = user.createAccessToken()
        const { password, email, ...others } = user._doc
        res.status(StatusCodes.CREATED).json({ others, accessToken })
    }

    async login(req, res) {
        const { email, password } = req.body
        if (!email || !password) {
            throw new BadRequestError('Email and password cannot be blank')
        }
        const user = await User.findOne({ email })
        if (!user) {
            throw new UnAuthenticatedError('Invalid Credentials')
        }
        const isPasswordCorrect = await user.comparePassword(password)
        if (!isPasswordCorrect) {
            throw new UnAuthenticatedError('Invalid Credentials')
        }
        const accessToken = user.createAccessToken()
        res.status(StatusCodes.OK).json({ username: user.username, accessToken })

    }
}

module.exports = new AuthController()