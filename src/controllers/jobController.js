const Job = require('../model/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

class JobController {
    // [GET] /api/jobs
    async getAllJob(req, res) {
        const jobs = await Job.find({ createdBy: req.user.userId }).sort('-createdAt')
        res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
    }


    // [GET] /api/jobs/:id
    async getJob(req, res) {
        // const { user: { userId }, params: { id } } = req
        const { userId } = req.user
        const { id } = req.params
        const job = await Job.findOne({ _id: id, createdBy: userId })
        if (!job) {
            throw new NotFoundError(`No job with id: ${id}`)
        }
        res.status(StatusCodes.OK).json({ job })
    }

    // [POST] /api/jobs
    async createJob(req, res) {
        req.body.createdBy = req.user.userId
        const job = await Job.create(req.body)
        res.status(StatusCodes.CREATED).json({ job })
    }

    //[PATCH] /api/jobs/:id
    async updateJob(req, res) {
        const { id } = req.params
        const { userId } = req.user
        const { position, company } = req.body

        if (company === '' || position === '') {
            throw new BadRequestError('Company or Position fields cannot be blank')
        }
        const updatedJob = await Job.findByIdAndUpdate({ _id: id, createdBy: userId }, req.body, { new: true, runValidators: true })
        if (!updatedJob) {
            throw new NotFoundError(`No job with id: ${id}`)
        }
        res.status(StatusCodes.OK).json({ job: updatedJob })
    }

    // [DELETE] /api/jobs/:id
    async deleteJob(req, res) {
        const { id } = req.params
        const { userId } = req.user

        const job = await Job.findOneAndRemove({
            _id: id,
            createdBy: userId
        })
        if (!job) {
            throw new NotFoundError(`No job with id: ${id}`)
        }
        res.status(StatusCodes.OK).send(`Job with id ${id} is removed`)
    }
}

module.exports = new JobController()