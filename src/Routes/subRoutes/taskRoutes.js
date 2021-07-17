const express= require('express')
const taskController= require('../../controller/taskController')
const middleware= require('../middleware/middleware')

const router= express.Router()

router.use(middleware.taskRoute)
router.use(middleware.authorization)

router.route('/task')
        .get(taskController.getAllTasks)
        .post(taskController.addTask)

router.route('/task/:id')
        .get(taskController.getTask)
        .patch(taskController.updateTask)
        .delete(taskController.removeTask)

module.exports= router