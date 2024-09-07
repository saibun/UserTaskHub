const mongooes = require('mongoose');

//create schema
const taskSchema = new mongooes.Schema({
    description:{
        type:'string',
        required:true,
        minLength:5,
        trim:true,
    },
    isCompleted:{
        type:'boolean',
        required:true,
        default:false,
    },
    author:{
        type:mongooes.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }
})

//create model
const taskModel = new mongooes.model('Task',taskSchema);

module.exports =taskModel;