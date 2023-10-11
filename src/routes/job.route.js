// const jobController = require('../controllers/jobController')
const { getAllJob, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobController')
const router = require('express').Router()



router.route('/').get(getAllJob).post(createJob)
router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob)

module.exports = router