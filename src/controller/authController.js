const userdb= require('../database/userdb')

exports.signUp= async(req, res)=>{
    try{
        const input= req.body
        const result= await userdb.addUser(input)
        if(result){
            res.status(200).json({token: result})
        }
        else{
            res.status(403).json({'message': 'Something went Wrong'})
        }

    }catch(e){
        res.status(500)
            .send(e)
    }
}

exports.signIn= async(req,res)=>{
    try{
        const input= req.body
        const result= await userdb.signIn(input)
        if(result){
            res.status(200).json({token: result})
        }
        else{
            res.status(404).json({'message': 'User Not Found'})
        }
    }catch(e){
        res.status(500)
            .send(e)
    }
}

exports.signOut= async(req,res)=>{
    try{
        const input= {id: req.header('_id'), token: req.header('Authorization').replace('Bearer ','')}
        const result= await userdb.signOut(input)
        if(result){
            res.status(200).json(result)
        }
        else{
            res.status(404).json({'message': 'User Not Found'})
        }
    }catch(e){
        res.status(500)
            .send(e)
    }
}
