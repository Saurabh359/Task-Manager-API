const express= require('express')
const userController=require('../../controller/userController')
const middleware= require('../middleware/middleware')

const router= express.Router()

router.use(middleware.userRoute)
router.use(middleware.authorization)

router.route('/user')
        .get(userController.getAllUser)
        .delete(userController.removeUser)
        .patch(userController.updateUser)

router.route('/user/:id')
        .get(userController.getUser)

router.route('/user/avatar/:id')
        .get(userController.getAvatar)
        
router.route('/user/avatar')
        .delete(userController.removeAvatar)

router.use(middleware.upload.single('avatar')).route('/user/avatar')
                                                .patch(userController.uploadAvatar)


module.exports= router