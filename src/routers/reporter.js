const express = require('express')
const router = express.Router()
const Reporter = require('../models/reporter')

//signup reporters
router.post('/signup',async(req,res)=>{
     try{
       const reporter = new Reporter(req.body)
      // console.log(reporter)
       const token = await reporter.generateToken()
       await reporter.save()
       res.status(200).send({reporter,token})
     }

     catch(e){
         res.status(500).send('Error' + e)
     }
})


router.post('/login',async(req,res)=>{
    try{

        const reporter = await Reporter.findByCredentials(req.body.email,req.body.pass)
        const token = await reporter.generateToken()
        if(!reporter){
            res.status(404).send('User Not Found')
        }
        res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(500).send('Error'+e)
    }
})




module.exports = router