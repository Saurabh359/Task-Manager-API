const Task= require('./Models/taskModel')

const projection= ['title', 'completed', 'createdAt','updatedAt']

exports.addTask=(data)=>{
        return new Promise((resolve,reject)=>{
                const tempTask= new Task(data)
                tempTask.save().then((res)=>resolve(res))
                                .catch((e)=>reject(e))
        })
}

exports.getAllTasks=(data)=>{
        return new Promise((resolve,reject)=>{
                Task.find(data[0],
                            projection,
                            {
                                limit: data[1].range.limit,
                                skip: data[1].range.skip,
                                sort: data[1].sort
                            })
                            .then((res)=> resolve(res))
                            .catch((e)=> reject(e))
        })
}

exports.getTask=(data)=>{
        return new Promise((resolve,reject)=>{
                Task.findOne({_id: data.taskId, _user: data.userId}).then((res)=> resolve(res))
                                                                     .catch((e)=> reject(e))
        })
}

exports.updateTask=(data)=>{
        return new Promise((resolve, reject)=>{
                Task.findOneAndUpdate({_id: data[0].taskId, _user: data[0].userId},data[1])
                                                                        .then((res)=> resolve(res))
                                                                        .catch((e)=> reject(e))
        })
}

exports.removeTask=(data)=>{
        return new Promise((resolve, reject)=>{
                Task.findOneAndRemove({_id: data.taskId, _user: data.userId}).then((res)=> resolve(res))
                                                                                .catch((e)=> reject(e))
        })
}

exports.removeAllTask=(data)=>{
        return new Promise((resolve,reject)=>{
                Task.deleteMany({_user: data.userId}).then((res)=> resolve(res))
                                                        .catch((err)=> reject(err))
        })
}
