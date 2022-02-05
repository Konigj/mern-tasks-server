const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const {check} = require('express-validator')

//Create Projects
//api/projects
router.post('/',
auth,
[
    check('name', 'Name is required').not().isEmpty()
],
projectController.CreateProject
);

//get user's projects
router.get('/',
auth,
projectController.getProjects
)

//UpdateProjects via ID
router.put('/:id',
auth, 
[
    check('name', 'Name is required').not().isEmpty()
],
projectController.updateProject
)

//Delete a project
router.delete('/:id',
auth, 
projectController.deleteProject
)

module.exports = router;