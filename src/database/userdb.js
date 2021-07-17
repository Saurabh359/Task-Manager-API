const User= require('./Models/userModel')

const readable='firstname middle lastname age email city'

exports.addUser= (data)=>{
    return new Promise((resolve, reject)=>{
        const usertemp= new User(data)
        usertemp.save().then((result)=> {
                        if(!result)
                            reject("Invalid Credentials") 
                        const res=User.generateJwtToken(result._id)
                        resolve(res)
                    })
                    .catch((e)=> reject(e))
    })
}

exports.getAllUsers=()=>{
    return new Promise((resolve,reject)=>{
        User.find({},readable).then((users)=> resolve(users))
                        .catch((e)=> reject(e))
    })
}

exports.getUser=(data)=>{
    const proj= readable.concat(' avatar')
    return new Promise((resolve,reject)=>{
        User.findById(data,proj)
                    .then((result)=> resolve(result))
                    .catch((e)=> reject(e))
    })
}

exports.removeUser=(data)=>{
    return new Promise((resolve, reject)=>{
        User.confirmUser(data)
                            .then((res)=>{
                                if(res){
                                    User.findByIdAndRemove(res)
                                    .then((result)=> resolve(result))
                                    .catch((e)=> reject(e)) 
                                }
                                else                    
                                    reject("Invalid Credentials")
                            })
                            .catch((e)=> reject(e))
    })
}

exports.updateUser=(data)=>{
    return new Promise((resolve, reject)=>{
       if(!Object.keys(data[1]).includes('password')){
            User.findByIdAndUpdate(data[0], data[1])
            .then((result)=> resolve(result))
            .catch((e)=> reject(e))   
       }
       else{
            User.hashPassword(data[1].password).then((res)=>{
                data[1].password= res
                User.findByIdAndUpdate(data[0], data[1])
                                    .then((result)=> resolve(result))
                                    .catch((e)=> reject(e)) 
            }).catch((e)=> reject(e))
       }  
    })
}

exports.signIn=(data)=>{
    return new Promise((resolve, reject)=>{
        User.confirmUser(data).then((result)=>{
                                        if(!result)
                                             reject("Invalid Credentials")     
                                        const res=User.generateJwtToken(result)
                                        resolve(res)
                                    }).catch((e)=> reject(e))
    })
}

exports.signOut=(data)=>{
    return new Promise((resolve, reject)=>{
        const res= User.expireJwtToken(data)
        if(res) resolve(res)
        reject(res)
    })
}

exports.isTokenValid=(data)=>{
    return new Promise((resolve, reject)=>{
        User.findById(data.id).then((res)=>{
            resolve(res.tokens.includes(data.token))
        })
        .catch((e)=>reject(e))
    })
}