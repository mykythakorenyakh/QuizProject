const { ObjectId } = require('bson')
const {Schema,model} = require('mongoose')

const questionSchema = new Schema({
    quizId:{
        type:ObjectId,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    text:{
        type:String,
        default:'',
    },
    image:{
        type:String,
        default:'',
    },
    options:{
        type:Buffer,
        required:true,
    },
    timeLimit:{
        string:Number,
    },
    required:{
        string:Boolean,
    },
})

module.exports = model('question',questionSchema)