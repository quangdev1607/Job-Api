const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { isEmail } = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        validate: [isEmail, 'Please provide a valid email'],
        unique: [true, 'This email is already taken'],
        lowercase: true

    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "Password character must be more than 6"],
    }

})

// Hash passowrd before saving to db
UserSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.createAccessToken = function () {
    return jwt.sign({ userId: this._id, username: this.username }, process.env.SECRET_ACCESS_TOKEN, {
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME
    })
}

UserSchema.methods.comparePassword = async function (inputPassword) {
    const isMatch = await bcrypt.compare(inputPassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)