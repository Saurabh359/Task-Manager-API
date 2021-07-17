const mongoose= require('mongoose')
const validator= require('validator')

const taskSchema= new mongoose.Schema({
    title:{
        type: String,
        required: [true,' Title is Required ']
    },
    description:{
        type: String,
        required: [true,'Description is Mandatory']
    },
    completed:{
        type: Boolean,
        default: false
    },
    _user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},
{
    timestamps: true
})

const Task= mongoose.model('task',taskSchema)

module.exports= Task