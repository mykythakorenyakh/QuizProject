const { ObjectId } = require('bson')
const {Schema,model} = require('mongoose')

const activationSchema = new Schema({
    userId:{
        type:ObjectId,
        required:true,
    },
    url:{
        type:String,
        required:true,
    }

})

module.exports = model('activation',activationSchema)