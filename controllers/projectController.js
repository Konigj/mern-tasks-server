const Project = require('../models/Project');
const {validationResult} = require('express-validator')

exports.CreateProject = async (req, res) => {

    //check errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    try {
        //create project
        const project = new Project(req.body);

        //save the creator via JWT
        project.creator = req.user.id

        //save project

        project.save();
        res.json(project)
        
    } catch (error) {
        console.log(error)
        res.status(500).send('There is a mistake')
    }
}

//get all user's projects

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({creator:req.user.id}).sort({created:-1})
        res.json({projects});
                
    } catch (error) {
        console.log(error);
        res.status(500).send('There is a mistake')
    }
}

exports.updateProject = async (req, res) => {
    //check errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    // extract projects data
    const {name} = req.body
    const newProject = {};

    //if there is name, that name is the project's name

    if(name) {
        newProject.name = name;
    }

    //update project
    
    try {
        //check id
        let project = await Project.findById(req.params.id)
        //check if exists\
        if (!project) {
            return res.status(404).json({msg: "Project not found"})
        }
        //check creator
        if(project.creator.toString() !== req.user.id) {
            return res.status(400).json({msg:'Not authorized'})
        }
    
        //update
        project = await Project.findByIdAndUpdate({_id:req.params.id}, {$set: newProject}, {new: true})
        res.json({project})
        
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
}

//delete project

exports.deleteProject = async (req, res) => {

    try {
        //check id
        let project = await Project.findById(req.params.id)
        //check if exists\
        if (!project) {
            return res.status(404).json({msg: "Project not found"})
        }
        //check creator
        if(project.creator.toString() !== req.user.id) {
            return res.status(400).json({msg:'Not authorized'})
        }

        //delete project

        await Project.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Project Deleted'})
        
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error')
    }
    
}