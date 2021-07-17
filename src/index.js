require('./database/setDatabase')
const express=require('express')
const router=require('./Routes/routes')
const middleware=require('./Routes/middleware/middleware')

const app=express()

app.use(express.json())
app.use(middleware.configuration)
app.use(router)

app.listen(process.env.PORT,()=>{
    console.log('Server is listening ',process.env.PORT)
})
