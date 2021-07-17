const express= require('express')
const authController= require('../../controller/authController')
const middleware= require('../middleware/middleware')

const router= express.Router()

router.use((req,res,next)=>{
    console.log('Auth Routes')
    next()
})

router.route('/auth/signup').post(authController.signUp)
router.route('/auth/signin').post(authController.signIn)

router.use(middleware.authorization)
router.route('/auth/signout').get(authController.signOut)

module.exports= router