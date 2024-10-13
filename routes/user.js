const express=require('express');
const {body}=require('express-validator');
const User = require('../model/user');
const router=express.Router();
router.get('/getUser',async(req,res,next)=>{
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userObj = {
            name: user.name,
            email: user.email,
            rating: user.rating
        };
        res.status(200).json({ user: userObj });
    } catch (err) {
        next(err);
    }
});  
module.exports=router;