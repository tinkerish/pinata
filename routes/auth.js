const express=require('express');
const {body}=require('express-validator');
const User = require('../model/user');
const router=express.Router();
const authController=require('../controllers/auth')
router.post('/signup',[
    body('email').isEmail().withMessage('Enter valid email').normalizeEmail(),
    body('password').trim().isLength({min: 5}),
    body('name').trim().not().isEmpty()
],authController.signup);

router.post('/login',[
    body('email').isEmail().withMessage('Enter valid email').normalizeEmail(),
    body('password').trim().isLength({min: 5}),
],authController.login); 
module.exports=router;