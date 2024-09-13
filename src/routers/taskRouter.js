const taskModel = require('../models/task');
const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");

router.post('/task',auth, async(req,res)=>{
    try{
        let task = new taskModel(req.body);
        task.author = req.user._id;
        const new_task = await task.save();
        res.status(200).send(new_task);

    }catch(err){
        res.status(400).send();

    }
})

// GET /task?isCompleted=true - give all completed task
// GET /task?limit=5&skip=0 - give first 5 result with no skipping any result, limit-5&skip=5 skip first 5 result and start from second 5 results
// GET /task?sortBy=createdAt_asc - give result where all task are in asending order as per their createAt property value.
router.get('/task', auth,async(req,res)=>{
    //----Filtering task as per completed or not-----
    let match = {};
    let sort = {};
    if(req.query.sortBy){
        let key =req.query.sortBy.split("_")[0];
        let value = req.query.sortBy.split("_")[1] === 'desc' ? -1:1;
        sort[key] = value; 

    }
      

    
    if(req.query.isCompleted){
        match.isCompleted = req.query.isCompleted === 'true';
    }

    try{
        const user = await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        });
        res.status(200).send(user.tasks)

    }catch(err){
        res.status(500).send(err);

    }
})

router.get("/task/:id", auth,async (req,res)=>{
    try{
        const task = await taskModel.findOne({_id:req.params.id, author:req.user._id});
        if(!task){
            return res.status(404).send();
        }
        res.status(200).send(task);

    }catch(err){
        res.status(500).send();

    }
})

router.patch("/task/:id" ,auth,async(req,res)=>{
    try{
        const update_properties = ['description','isCompleted'];
        const request_update = Object.keys(req.body);
        const isValid = request_update.every((value)=> { return update_properties.includes(value)});
        const task = await taskModel.findOne({_id:req.params.id, author:req.user._id});
        if(!isValid || !task){
            return res.status(404).send()
        }
        
        request_update.forEach((value)=>{
            task[value] = req.body[value];
            

        })
        await task.save();
        res.status(200).send(task);

    

    }catch(err){
        res.status(500).send(err.message);

    }
})

router.delete("/task/:id",auth,async(req,res)=>{
    try{
        const task = await taskModel.deleteOne({_id:req.params.id, author:req.user._id});
        console.log(task);
        if(!task){
            return res.status(404).send();
        }
        res.status(200).send(task)

    }catch(err){
        res.status(500).send("Server Error");

    }
})



module.exports = router;