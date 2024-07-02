const { ObjectId } = require('bson')
const {Schema,model} = require('mongoose')

const transitQuizSchema = new Schema({
    quizId:{
        type:ObjectId,
        required:true,
    },
    userId:{
        type:ObjectId,
        required:true,
    },
    answers:{
        type:{
            type:Object,
            required:true,
        }
    }
});


module.exports = model('transitQuiz',transitQuizSchema)