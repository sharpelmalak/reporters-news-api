const express = require('express')
const router = express.Router()
const Reporter = require('../models/reporter')
const auth = require('../middleware/auth')
const multer =require('multer')

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
         res.status(500).send(e)
     }
})

//login
router.post('/login',async(req,res)=>{
    try{
        //console.log(req.body.email + req.body.password)
        const reporter = await Reporter.findByCredentials(req.body.email,req.body.password)
        //console.log(reporter)
        const token = await reporter.generateToken()
        if(!reporter){
           return res.status(404).send('User Not Found')
        }
        res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(500).send(e)
    }
})

//profile
router.get('/profile',auth,async(req,res)=>{
    res.send(req.reporter)
})

//edit profile
router.patch('/editprofile',auth,async(req,res)=>{
    try{
        //store keys in array
        const updates = Object.keys(req.body)
        const allowed = ['name','phone','password']
        
        const isValid = updates.every((update)=>allowed.includes(update))
        if(!isValid){
          return  res.status(400).send('cannot perform update')
        }
        //console.log(req._id)
        //const reporter = await Reporter.findById(req.reporter._id)
        // if(!reporter){
        //   return  res.status(400).send('please authinticate')
        // }
        updates.forEach((e)=>{req.reporter[e]=req.body[e]})
        await req.reporter.save()
        res.status(200).send(req.reporter)


    }
    catch(e){
        res.status(500).send(e)
    }
})

// upload profile pic
// const uploads = multer({
    
//     limits:{
//         fileSize:1000000
//     },
//     fileFilter(req,file,cb){
//         if(! file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
//             cb(new Error('you must upload image'))
//         }
//         cb(null,true)
//     }
// })

// router.post('/profile/photo',auth,uploads.single('avatar'),async(req,res)=>{
//     try{
//                req.reporter.avatar = req.file.buffer
//                await req.reporter.save()
//                res.send('done')
//     }
//     catch(e){
//         res.status(400).send('error'+e)
//     }
// })
const uploads = multer({
    limits:{
        // 1MG
        //fileSize:1000000 
    },

    fileFilter(req,file,cb){
        //dhfdurrty475----6.png
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
            cb(new Error('Sorry you must upload image'))
        }
        cb(null,true)
    }
})

router.post('/profile/avatar',auth,uploads.single('avatar'),async(req,res)=>{
   try{
       req.reporter.avatar = req.file.buffer
       await req.reporter.save()
       res.send()
   }
   catch(e){
       res.status(500).send("Error"+e)
   }
})

//delete account
router.delete('/removeaccount',auth,async(req,res)=>{
    try{
        const reporter = await Reporter.findByIdAndDelete(req._id)
        if(!reporter){
            throw new Error('Invalid Operation')
        }
        res.status(200).send(reporter)
    }
    catch(e){
        res.status(400).send(e)
    }
})

//logout from this device
router.delete('/logout',auth,async(req,res)=>{
    try{
        req.reporter.tokens = req.reporter.tokens.filter((e)=>{
            return e.token != req.token
        })
        await req.reporter.save()
        res.send()
    }
    catch(e){
        res.status(400).send(e)
    }
})

//logout from all devices
router.delete('/logoutall',auth,async(req,res)=>{
    try {
        req.reporter.tokens = []
        await req.reporter.save()
        res.send('Loged Out From All devices')
    }
    catch(e){
        res.status(400).send(e)
    }
})



module.exports = router