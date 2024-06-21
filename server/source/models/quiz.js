const {Schema,model} = require('mongoose')

const quizSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    urlid:{
        type:String,
        required:true,
    },
    created:{
        type:Date,
        default:()=>Date.now(),
        
    },
    updated:{
        type:Date,
        default:()=>Date.now(),
    },
    private:{
        type:Boolean,
        default:true,
    },

    repeat:{
        type:Number,
        default:null,
    },
    timeLimit:{
        type:Number,
        default:null,
    },
    dateLimit:{
        type:Date,
        default:null,
    },
    mixed:{
        type:Boolean,
        default:true,
    },


})

module.exports = model('quiz',quizSchema)