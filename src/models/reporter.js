const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
//const multer = require('multer')


const reporterSchema = new mongoose.Schema(
    {
    name:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        validate(value){
          if(!validator.isEmail(value)){
              throw new Error()
          }
        }
    },
    age:{
        type:Number,
        default:24,
        validate(value){
            if( value <= 0){
                throw new Error()
            }
        }

    },
    phone:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isMobilePhone(value,'ar-EG'))
            {
                throw new Error('invalid')
            }
        }
         },
    password:{
        type:String,
        required:true,
        minlength:6,

    },     
        tokens:[
            {
                token:{
                    type:String,
                    required:true
                }
            }
        ],

        avatar:{
            type:Buffer
        }
        
},{timestamps: true })


//relation
reporterSchema.virtual('news',{
    ref:'News',
    localField:'_id',
    foreignField:'owner'
})
reporterSchema.pre('save',async function(next){
    const reporter = this
    if(reporter.isModified('password')){
         reporter.password = await bcrypt.hash(reporter.password,8)
    }
    next()

})

//check user credentials
reporterSchema.statics.findByCredentials = async (email,password)=>{
    //console.log(email + password)
    const reporter = await Reporter.findOne({email})
    //console.log(reporter)
    if(!reporter){
        throw new Error('Please Sign Up')
    }
    const isMatched = await bcrypt.compare(password,reporter.password)
    if( !isMatched){
        throw new Error('Invalid Password')
    }
    return reporter
       
}

// we should use function() --> because of "THIS"
reporterSchema.methods.generateToken = async function(){
    const reporter = this
    //console.log(this)
    const token = await jwt.sign({_id:reporter._id.toString()},process.env.JWT_KEY)
    //console.log(token)
    reporter.tokens = reporter.tokens.concat({token})
    //reporter.tokens.push({token})

    //console.log(reporter.tokens)
    //console.log(reporter)

    await reporter.save()
    return token
}

//hide data
reporterSchema.methods.toJSON = function(){
    const reporter = this
    const repoObject = reporter.toObject()

    delete repoObject.password
    delete repoObject.tokens
    //delete TimeSTAMP
    delete repoObject.createdAt
    delete repoObject.updatedAt
    
    return repoObject
}

const Reporter = mongoose.model('Reporter',reporterSchema)


module.exports = Reporter