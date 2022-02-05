const Task = require('../models/Task');
const Project = require('../models/Project');
const {validationResult} = require('express-validator');

//create a new task
exports.createTask = async (req, res) => {
    //check errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    //extract project and check if exists
    
    
    
    try {
        const {project} = req.body;
        const existingProject = await Project.findById(project)
        if(!existingProject) {
            return res.status(404).json({msg: "Project not found"})
        }

        // check if the project belongs to the user
        if(existingProject.creator.toString() !== req.user.id) {
            return res.status(400).json({msg:'Not authorized'})
        }

        //Create Task
        const task = new Task(req.body);
        await task.save();
        res.json({task});


    } catch (error) {
        console.log(error)
        res.status(500).send('There is a mistake')
    }
}

// Get tasks by project

exports.getTasks = async (req, res) => {
    //extract the project

    try {
        const {project} = req.query;
        const existingProject = await Project.findById(project)
        if(!existingProject) {
            return res.status(404).json({msg: "Project not found"})
        }

        // check if the project belongs to the user
        if(existingProject.creator.toString() !== req.user.id) {
            return res.status(400).json({msg:'Not authorized'})
        }

        //Get Task
        const tasks = await Task.find({ project}).sort({created: -1});
        res.json({tasks})



    } catch (error) {
        console.log(error)
        res.status(500).send('There is a mistake')
    }
}


//update task

exports.updateTask = async (req, res) => {
    try {
        const {project, name, state} = req.body;

        let task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(400).json({msg:'Not authorized'})
        }
        
        //extract project
        const existingProject = await Project.findById(project)

        // check if the project belongs to the user
        if(existingProject.creator.toString() !== req.user.id) {
            return res.status(400).json({msg:'Not authorized'})
        }

        //create object with new data
        const newTask = {};

        newTask.name = name;
        newTask.state = state;state

        //Update Task
        task = await Task.findOneAndUpdate({_id: req.params.id}, newTask, {new: true});
        res.json({task})
        

    } catch (error) {
        console.log(error)
        res.status(500).send('There is a mistake')
    }
}

exports.deleteTask = async (req, res) => {

    try {
        const {project} = req.query;

        let task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(400).json({msg:'Not authorized'})
        }
        
        //extract project
        const existingProject = await Project.findById(project)

        // check if the project belongs to the user
        if(existingProject.creator.toString() !== req.user.id) {
            return res.status(400).json({msg:'Not authorized'})
        }

        //delete
        await Task.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Task Deleted'})
        
        

    } catch (error) {
        console.log(error)
        res.status(500).send('There is a mistake')
    }

}