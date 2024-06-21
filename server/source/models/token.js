const { ObjectId } = require('bson');
const {Schema,model, SchemaTypeOptions} = require('mongoose')


const tokenSchema = new Schema({
    token:{
        type:String,
        required:true,
    },
    userId:{
        type:ObjectId,
        required:true,
    }
});

module.exports = model('token',tokenSchema)