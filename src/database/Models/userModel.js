const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')
const jwt= require('jsonwebtoken')
const taskdb=require('../taskdb')

const secretCode= process.env.PRIVATEKEY

const userSchema=new mongoose.Schema({
                firstname:{
                        type: String,
                        required: [true,'first name is Mandatory'],
                        trim: true
                    },
                middlename:{
                        type: String,
                        trim: true
                },
                lastname:{
                        type: String,
                        required: [true, 'last name is Mandatory'],
                        trim: true,
                    },
                age: {
                        type: Number,
                        required: [true,'Age is Mandatory'],
                        validate(value){
                            if(value < 0)
                                throw new Error('Age must be positive')
                        }
                    },
                email:{
                        type: String,
                        required: [true,'Email is Mandatory'],
                        trim: true,
                        lowercase: true,
                        unique: true,
                        validate(value){
                            if(!validator.isEmail(value))
                                throw new Error('Invalid email Id')
                        }
                },
                password:{
                        type: String,
                        required: [true,'Password is Mandatory'],
                        minlength: 8,
                        validate(value){
                            if(value.toLowerCase().includes('password')){
                                throw new Error('Password cannot contain "password"')
                            }
                        }
                },
                city: {
                        type: String,
                        required: [true,'City is Mandatory'],
                        trim: true
                    },
                tokens: [{
                        type: String
                }],
                avatar:{
                    type: Buffer
                }
    },{ timestamps: true });

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: '_user'
})

userSchema.statics.addOrRemoveToken= async(_id, token, check)=>{
    let tempUser= await User.findById(_id)
    if(!tempUser)
        return false
    
    if(check)
        tempUser.tokens.push(token)
    else
        tempUser.tokens= tempUser.tokens.filter((t)=> t!==token)
    
    await tempUser.save()
    return true
}

userSchema.statics.generateJwtToken= (_id)=>{
    const token= jwt.sign({ _id: _id.toString() },
                            secretCode, 
                            {expiresIn: '1 day'})

    const res= User.addOrRemoveToken(_id,token,true)
    if(!res) return null

    return token
}

userSchema.statics.expireJwtToken= (data)=>{
    return User.addOrRemoveToken(data.id, data.token, false)
}

userSchema.statics.confirmUser= async (userDetail)=>{
    try{
        let userCred=null

        if(userDetail.id!=null)
            userCred= await User.findById(userDetail.id)
        else
            userCred= await User.findOne({email: userDetail.email})
        
        if(!userCred) return null

        const isMatch= await bcrypt.compare(userDetail.password,userCred.password)

        if(!isMatch)  return null

        return userCred._id
    }catch(e){
        return null
    }
}

userSchema.statics.hashPassword=async (password)=>{
    try{
       const result= await bcrypt.hash(password,8)
       return result
    }catch(e){
        return null
    }
}

userSchema.pre('save',async function(next){
    const preUser= this
    if(preUser.isModified('password')){
        preUser.password= await User.hashPassword(preUser.password)
    }
    next()
})

userSchema.pre('remove',async function(next){
    console.log('remove - ',this)
    await taskdb.removeAllTask({userId: this._id})
})

const User= mongoose.model('user',userSchema);

module.exports= User