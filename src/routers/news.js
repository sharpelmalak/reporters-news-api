const express = require('express')
const router = express.Router()
const News =  require('../models/news')
const auth = require('../middleware/auth')
const multer = require('multer')


//create News
router.post('/addnews',auth,async(req,res)=>{
    try{
        const news = new News({...req.body,owner:req.reporter._id})
        await news.save()
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send('Error'+e)
    }
})


//show reporter news
router.get('/news',auth,async(req,res)=>{
    try{
        const news = await News.find({owner:req.reporter._id})
        if(!news){
            return res.status(404).send('No tasks to show')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send('Error'+e)
    }
})


//show reporter news another way using populate
router.get('/mynews',auth,async(req,res)=>{
    try{
      await  req.reporter.populate('news')
      res.status(200).send(req.reporter.news)
    }
    catch(e){
        res.status(400).send('Error'+e)
    }

})

//show news by id 
router.get('/targetnews/:id',auth,async(req,res)=>{
    try{
        const news = await News.findOne({_id:req.params.id,owner:req.reporter._id})
        if(!news){
            return res.status(404).send('Task Not Found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send('Error'+e)
    }
})

//update news by id 

router.patch('/editnews/:id',auth,async(req,res)=>{
    try{
        const updates = Object.keys(req.body)
        const news = await News.findOneAndUpdate({_id:req.params.id,owner:req.reporter._id},req.body,{
            new:true,
            runValidators:true
        })
        
        if(!news){
            return res.status(404).send('Task Not Found')
        }
       // updates.forEach((e)=>news[e]=req.body[e])
        //await news.save()
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send('Error'+e)
    }
})

//add pic to news

const uploads = multer({
    
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(! file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
            cb(new Error('you must upload image'))
        }
        cb(null,true)
    }
})

router.post('/newsphoto/:id',auth,uploads.single('postPic'),async(req,res)=>{
    try{
        const news = await News.findOne({_id:req.params.id,owner:req.reporter._id})
        if(!news){
            return res.status(404).send('TaskNotFound')
        }
        news.postPic =  req.file.buffer
        await news.save()
        res.send('uploaded')
    }
    catch(e){
        res.status(400).send(e)
    }
})



//delete news by id

router.delete('/deletenews/:id',auth,async(req,res)=>{
    try{
        const news = await News.findOneAndDelete({_id:req.params.id,owner:req.reporter._id})
        if(!news){
            return res.status(404).send('TaskNotFound')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e)
    }
})



module.exports = router