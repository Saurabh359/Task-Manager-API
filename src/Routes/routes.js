const express= require('express')
const userRoute= require('./subRoutes/userRoutes')
const taskRoute=require('./subRoutes/taskRoutes')
const authRoute=require('./subRoutes/authRoutes')
const middleware=require('./middleware/middleware')

const router=express.Router()

router.use(middleware.mainRoute)

router.route('/user*').all(userRoute)
router.route('/task*').all(taskRoute)
router.route('/auth*').all(authRoute)

module.exports=router