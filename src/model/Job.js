const mongoose = require('mongoose')
const Schema = mongoose.Schema

const JobSchema = new Schema({
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        maxlength: 50,
        lowercase: true
    },
    position: {
        type: String,
        required: [true, "Please provide position"],
        lowercase: true
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'

    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    }
}, { timestamps: true })

module.exports = mongoose.model('Job', JobSchema)