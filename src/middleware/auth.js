const jwt = require('jsonwebtoken')
const Reporter = require('../models/reporter')

const auth = async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        //console.log(token)
        const decode = jwt.verify(token,'publicKey')
        //console.log(decode)
        const reporter = await Reporter.findOne({_id:decode._id,'tokens.token':token})
       // console.log(reporter)
        if(!reporter){
            throw new Error()
        }
        req.reporter= reporter
        req.token=token
        //req._id = decode._id
        next()
    }
    catch(e){
           res.status(400).send({Error:'Please authenticate'})
    }
}

module.exports = auth