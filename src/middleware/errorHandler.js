// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {

    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong try again later',
        signUpError: { username: "", email: "", password: "" }
    }

    // Validation Error
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            customError.signUpError[properties.path] = properties.message
            customError.statusCode = 400
        })
        return res.status(customError.statusCode).json({ msg: customError.signUpError })

    }

    // Duplicate Error
    if (err.code && err.code === 11000) {
        customError.msg = `This ${Object.keys(err.keyValue)} is already taken, please choose another ${Object.keys(err.keyValue)} `
        customError.statusCode = StatusCodes.BAD_REQUEST
    }

    // Cast Error
    if (err.name === 'CastError') {
        customError.msg = `No item found with id ${err.value}`
        customError.statusCode = StatusCodes.NOT_FOUND
    }
    // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
    return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware