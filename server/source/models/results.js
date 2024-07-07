const { ObjectId } = require('bson')
const {Schema,model} = require('mongoose')


const resultSchema = new Schema({
    quizId:{
        type:ObjectId,
        required:true,
    },
    userId:{
        type:ObjectId,
        required:true,
    },
    passedDate:{
        type:Date,
        default:()=>Date.now(),
    },
    duration:{
        type:Number,
        required:true,
    },
    score:{
        type:Number,
        required:true,
    }
});


module.exports = model('result',resultSchema)
