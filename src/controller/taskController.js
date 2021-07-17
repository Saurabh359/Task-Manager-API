const taskdb= require('../database/taskdb')
const mongoose= require('mongoose')

exports.addTask= async(req,res)=>{
    try{
        let input= req.body
        input._user= req.header('_id')
        const result=await taskdb.addTask(input)
        if(result){
            res.status(201)
                .json(result)
        }
        else{
            res.status(502)
                .json(result)
        }
    }catch(e){
        res.status(500).send(e)
    }
}

exports.getAllTasks= async(req,res)=>{
    try{
        const match={ _user: req.header('_id')}
        const sort={}
        const range= { limit: parseInt(req.query.limit), skip: parseInt(req.query.skip) }

        if(req.query.completed){
            match.completed= req.query.completed === 'true'
        }

        if(req.query.sortBy){
            const opt= req.query.sortBy.split(',')
            opt.forEach(ele => {
                const parts= ele.split(':')
                sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
            });
        }

        const data=[ match, { sort, range }]

        const result=await taskdb.getAllTasks(data)
        if(result){
            res.status(200)
                .json(result)
        }
        else{
            res.status(404)
                .json(result)
        }
    }catch(e){
        res.status(500).send(e)
    }
}

exports.getTask= async(req,res)=>{
    try{
        const input={ taskId: req.params.id, userId: req.header('_id') }
        const result=await taskdb.getTask(input)
        if(result){
            res.status(200)
                .json(result)
        }
        else{
            res.status(404)
                .json(result)
        }
    }catch(e){
        res.status(500).send(e)
    }
}

exports.updateTask= async(req,res)=>{
    try{
        const input=[ { taskId: req.params.id, userId: req.header('_id') } , req.body]

        const updates= Object.keys(input[1])
        const allowedUpdates=['title','description','completed']
        const isValid= updates.every((update)=> allowedUpdates.includes(update))
        
        if(!isValid)
            return res.status(400).send({error : 'Invalid Updates'})

        const result=await taskdb.updateTask(input)
        
        if(result){
            res.status(200)
                .json(result)
        }
        else{
            res.status(404)
                .json(result)
        }
    }catch(e){
        res.status(500).send(e)
    }
}

exports.removeTask= async(req,res)=>{
    try{
        const input={ taskId: req.params.id, userId: req.header('_id') }
        const result=await taskdb.removeTask(input)
        if(result){
            res.status(200)
                .json(result)
        }
        else{
            res.status(404)
                .json(result)
        }
    }catch(e){
        res.status(500).send(e)
    }
}