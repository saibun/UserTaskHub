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

router.get('/task', auth,async(req,res)=>{
    let match = {};
    if(req.query.isCompleted){
        match.isCompleted = req.query.isCompleted === 'true';
    }

    try{
        const user = await req.user.populate({
            path:'tasks',
            match
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