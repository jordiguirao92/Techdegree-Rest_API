const express = require('express');
const router = express.Router();
const User = require('../models').User;
const authenticateUser = require('./authenticate');
const bcryptjs = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');


//https://express-validator.github.io/docs/validation-chain-api.html
//https://github.com/validatorjs/validator.js#validators
//Validators
const firstNameValidationChain = check('firstName').exists({checkNull: true, checkFalsy: true}).withMessage('Please check your first name');
const lastNameValidationChain = check('lastName').exists({checkNull: true, checkFalsy: true}).withMessage('Please check your last name');
const emailAddressValidationChain = check('emailAddress').exists({checkNull: true, checkFalsy: true}).withMessage('Please check your email').isEmail().withMessage('Please check your email');
const passwordValidationChain = check('password').exists({checkNull: true, checkFalsy: true}).withMessage('Please introduce a valid password').isLength({min: 6, max: undefined}).withMessage('Please your password need at least 6 characters');


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


//GET /api/users 200 - Returns the currently authenticated user
router.get('/', authenticateUser, asyncHandler(async(req, res) => {
    try {
        const user = req.currentUser;
        res.json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddress
        });
    } catch (error) {
    res.status(404).json({message: "User not found."});
    }
}));


//POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/',firstNameValidationChain, lastNameValidationChain, emailAddressValidationChain, passwordValidationChain, asyncHandler(async(req, res) => {
    try{
        //Attempt to get the validation result from the Request object.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Use the Array `map()` method to get a list of error messages.
            const errorMessages = errors.array().map(error => error.msg);
            // Return the validation errors to the client.
            res.status(400).json({ errors: errorMessages });
          }

        //Get the user from the request body.
        const user = req.body;
        //Checking if the user currently exist in the user table database. 
        const existUser = await User.findOne({where: {emailAddress: user.emailAddress}});

        //Creating a new user is the user not exist. 
        if(!existUser) {
            //Hashing the user password
            user.password = bcryptjs.hashSync(user.password);
            //Creating a new user
            User.create({
                firstName:user.firstName,
                lastName: user.lastName,
                emailAddress: user.emailAddress,
                password: user.password
            });

            //Sets the Location header to "/". Set the status to 201 Created and end the response.
            res.location('/').status(201).end();
        } else {
            res.status(400).json({ message: 'This user already exists'});
        }
    } catch (error) {
        res.status(404).json({message: "Problem"});
    }
}));


module.exports = router;

