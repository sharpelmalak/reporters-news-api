const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
//const validator = require('validator')
const reporterRouter = require('./routers/reporter')
const newsRouter = require('./routers/news')
const port = process.env.PORT 





//this line is veryyyyyyy important
require('./db/mongoose')
app.use(express.json())
app.use(cors())
app.use(reporterRouter)
app.use(newsRouter)

//console.log(validator.isMobilePhone('0110760281','ar-EG'))
//console.log(Date.now())
app.listen(port,()=>{console.log('server is running')})