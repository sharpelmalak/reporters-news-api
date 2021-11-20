const express = require('express')
//const validator = require('validator')
const reporterRouter = require('./routers/reporter')
const port = process.env.PORT || 3000



const app = express()
//this line is veryyyyyyy important
require('./db/mongoose')
app.use(express.json())
app.use(reporterRouter)

//console.log(validator.isMobilePhone('0110760281','ar-EG'))
//console.log(Date.now())
app.listen(port,()=>{console.log('server is running')})