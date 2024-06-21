const {Schema,model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type:String,
        required:true,
    },
    password: {
        type:String,
        required:true,
    },
    activated:{
        type:Boolean,
        default:false,
    },

    phone: {
        type:String, 
        default:'',
    },
    name: {
        type:String, 
        default:'',
    },
    avatar:{
        type:String,
        default:'',
    },

});


module.exports = model('user',userSchema);