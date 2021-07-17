const userdb= require('../database/userdb')
const taskdb= require('../database/taskdb')
const sharp= require('sharp')

exports.getAllUser= async(req,res)=>{
    try{
        const result= await userdb.getAllUsers()
        if(result){
            res.status(200)
                .json(result)
        }
        else{
            res.status(204)
                .json(result)
        }
    }catch(e){
        res.status(500)
    }
}

exports.getUser= async(req,res)=>{
    try{
        const data= req.params.id
        const temp= await userdb.getUser(data)
        if(temp){
            const result= temp.toObject()
            delete result.avatar
            res.status(200)
                .json(result)
        }
        else    
            res.status(404)
                .json({message : 'User not Found'})

    }catch(e){
        res.status(500)
    }
}

exports.updateUser= async(req,res)=> {
    try{
        const data=[req.header('_id'), req.body]

        const updates= Object.keys(data[1])
        const allowedUpdates= ['firstname', 'middlename', 'lastname', 'age', 'city','password']
        const isValidOps= updates.every((update)=> allowedUpdates.includes(update))

        if(!isValidOps)
            return res.status(400).send({error : 'Invalid Updates'})

        const result= await userdb.updateUser(data)

        if(!result)
            res.status(404)
                .json({message : 'User not Found'})
        else
            res.status(200)
                .json(result)

    }catch(e){
        res.status(500).send(e)
    }
}

exports.removeUser= async(req,res)=> {
    try{
        const data={id: req.header('_id'), password: req.body.password, email: null}
        await taskdb.removeAllTask({ userId: data.id})
        const result= await userdb.removeUser(data)
    
        if(!result){
            res.status(200)
                .json(result)
        }
        else{
            res.status(404)
                .json({message : 'Invalid user Credentials'})
        }
    }catch(e){
        res.status(500).send(e)
    }
}

exports.uploadAvatar=async(req,res)=>{
    try{
        const buffer= await sharp(req.file.buffer)
                                .resize({width: 250, height: 250})
                                .png().toBuffer()
        const img={
            avatar: buffer
        }
        const data=[req.header('_id'), img]

        const result= await userdb.updateUser(data)

        if(!result)
            res.status(404)
                .json({message : 'User not Found'})
        else
            res.status(200)
                .json(result)

    }catch(e){
        res.status(500).send(e)
    }
}

exports.removeAvatar=async(req,res)=>{
    try{
        const data=[req.header('_id'), { avatar: undefined }]
        const result= await userdb.updateUser(data)

        if(!result)
            res.status(404)
                .json({message : 'User not Found'})
        else
            res.status(200)
                .json(result)

    }catch(e){
        res.status(500).send(e)
    }
}

exports.getAvatar=async(req,res)=>{
    try{
        const data= req.params.id
        const result= await userdb.getUser(data)
        if(!result || !result.avatar){
            res.status(404).json({message : 'Image not found'})
        }
        else{
            res.set('Content-Type','image/jpg')
            res.status(200).send(result.avatar)
        }
    }catch(e){
        res.status(500).send(e)
    }
}