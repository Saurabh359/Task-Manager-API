const mongoose=require('mongoose')

const conn=process.env.CONNECTION_STRING

mongoose.connect(conn,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then((res) => console.log("Success : "+res.connections))
.catch(err => console.log("Server not able to connect"))