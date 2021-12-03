const mongoose = require('mongoose')


const newsSchema = mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true
    },
    description:{
        type:String,
        trim:true,
        required:true
    },
    avatar:{
        type:Buffer
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
},{timestamps:true})

newsSchema.methods.toJSON = function(){
    const news = this
    const newsObject = news.toObject()

    
    
    return newsObject
}

const News = mongoose.model('News',newsSchema)

module.exports = News