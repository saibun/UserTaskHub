const mongooes = require('mongoose');
const schemaStructure = require("../Schema_Structure/taskStructure")
//create schema
const taskSchema = new mongooes.Schema(schemaStructure,{timestamps:true});

//create model
const taskModel = new mongooes.model('Task',taskSchema);

module.exports =taskModel;