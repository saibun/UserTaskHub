const mongooes = require("mongoose");
const schemaStructure = {
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
}

module.exports = schemaStructure;