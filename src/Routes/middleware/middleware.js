const jwt= require('jsonwebtoken')
const User= require('../../database/userdb')
const userdb= require('../../database/userdb')
const multer= require('multer')

const secretCode= process.env.PRIVATEKEY

exports.configuration= async(req, res, next)=>{
        res.header({"Access-Control-Allow-Origin": "http://localhost:4200",
                    'Access-Control-Allow-Methods': 'GET',
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"})
        
        next()
}


exports.authorization= async(req, res, next)=>{
    try{
        const token= req.header('Authorization').replace('Bearer ','')
        const decrypt= jwt.verify(token,secretCode)
        const tempUser= await userdb.isTokenValid({id: decrypt._id, token: token })
        req.headers._id= decrypt._id
    
        if(!tempUser)
            throw new Error('Unauthorized Access')
        
        next()
    }catch(e){
        res.status(401).send(e)
    }
}

exports.mainRoute= async(req, res, next)=>{
    console.log('Main Route')
    next()
}

exports.userRoute= async(req, res, next)=>{
    console.log('User Route')
    next()
}

exports.taskRoute= async(req, res, next)=>{
    console.log('Task Route')
    next()
}

exports.upload= multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please Upload an Image with jpg, jpeg or png format'))
        }

        cb(undefined, true)
    }
})
