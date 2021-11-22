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
    postPic:{
        type:Buffer
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
},{timestamps:true})

const News = mongoose.model('News',newsSchema)

module.exports = News