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
        type:Object,
        required:true,
    },
    timeLimit:{
        type:Number,
    },
    required:{
        type:Boolean,
    },
})

module.exports = model('question',questionSchema)