const express = require('express');
const router = express.Router();
const User = require('../models').User;
const Course = require('../models').Course;
const authenticateUser = require('./authenticate');
const { check, validationResult } = require('express-validator/check');

//Validators
const titleValidationChain = check('title').exists({checkNull: true, checkFalsy: true}).withMessage('Please check your course title');
const descriptionValidationChain = check('description').exists({checkNull: true, checkFalsy: true}).withMessage('Please check your course description');


//Handler function to wrap each route.
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        res.status(500).send(error);
      }
    }
  }


//GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
router.get('/', asyncHandler(async(req, res) => {
    //Searching all the courses and adding the User model table. 
    const courses = await Course.findAll({attributes:{exclude:['createdAt', 'updatedAt']}, include:[{model: User, attributes:{exclude:['createdAt', 'updatedAt']}}]});
    res.status(200).json(courses);
}));


//GET /api/courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID
router.get('/:id', asyncHandler(async(req, res) => {
    //Searching the id course and adding the User model table. 
    const courses = await Course.findByPk(req.params.id, {attributes:{exclude:['createdAt', 'updatedAt']} ,include:[{model: User, attributes:{exclude:['createdAt', 'updatedAt']}}]});
    res.status(200).json(courses);
}));


//POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/',titleValidationChain, descriptionValidationChain, authenticateUser, asyncHandler(async(req, res) => {
    try{
         //Attempt to get the validation result from the Request object.
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
             // Use the Array `map()` method to get a list of error messages.
             const errorMessages = errors.array().map(error => error.msg);
             // Return the validation errors to the client.
             res.status(400).json({ errors: errorMessages });
           } else {
                 //Create a new course
                 const course = await Course.create(req.body);
                 //Sets the Location header. Set the status to 201 Created and end the response.
                 res.location(`courses/${course.id}`).status(201).end();
           }
    } catch(error){
        if (error.name === "SequelizeValidationError") {
            res.status(400).json({message: 'Please enter a title and description', error});
        }
    }
}));


//PUT /api/courses/:id 204 - Updates a course and returns no content. routes to check if the course for the provided :id route parameter value is owned by the currently authenticated user.
router.put('/:id', titleValidationChain, descriptionValidationChain, authenticateUser, asyncHandler(async(req, res) => {
    try {
         //Attempt to get the validation result from the Request object.
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
             // Use the Array `map()` method to get a list of error messages.
             const errorMessages = errors.array().map(error => error.msg);
             // Return the validation errors to the client.
             res.status(400).json({ errors: errorMessages });
           } else {
                 //Find the :id course
                 const course = await Course.findByPk(req.params.id);
                 if(course) {
                     //Checking if the currentUser is the owner of the course. 
                     if(course.userId == req.currentUser.id){
                         //Update the course
                         const updateCourse = await course.update(req.body);
                         if(updateCourse){
                             res.status(204).end();
                         }
                     } else {
                         res.status(403).json({message:'Sorry, you are not the owner of the course.'});
                     }
                 } else {
                     res.status(404).json({message:'Sorry, course not found.'});
                 }
           }
    } catch(error){
        res.status(404).json({message:'Sorry, a problem has occurred.'});
    }
}));


//DELETE /api/courses/:id 204 - Deletes a course and returns no content
router.delete('/:id', authenticateUser, asyncHandler(async(req, res) => {
    try {
        //Find the :id course
        const course = await Course.findByPk(req.params.id);
        if(course) {
            //Checking if the currentUser is the owner of the course. 
            if(course.userId == req.currentUser.id) {
                //Delete the course
                const deleteCourse = await course.destroy(req.params.id);
                if(deleteCourse){
                    res.status(204).end();
                    }
            } else {
                res.status(403).json({message:'Sorry, you are not the owner of the course.'});
            }
        } else {
            res.status(404).json({message:'Sorry, course not found.'});
        }
    } catch(error) {
        res.status(404).json({message:'Sorry, a problem has occurred.'});
       }
}));

module.exports= router;