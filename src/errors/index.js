const CustomAPIError = require('./custom-api')
const UnAuthenticatedError = require('./unAuthenticated')
const NotFoundError = require('./notFound')
const BadRequestError = require('./badRequest')

module.exports = {
    CustomAPIError,
    UnAuthenticatedError,
    NotFoundError,
    BadRequestError
}