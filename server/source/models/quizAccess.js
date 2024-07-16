const {model,Schema} = require('mongoose')
const { ObjectId } = require('bson')

const quizAccessSchema = new Schema({
    quizId:{
        type:ObjectId,
        required:true,
    },
    userId:{
        type:ObjectId,
        required:true,
    },


})


module.exports = model('quizAccess',quizAccessSchema)