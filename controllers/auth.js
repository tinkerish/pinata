const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

exports.signup = async (req, res, next) => {
    
    const errors = validationResult(req);
    console.log(errors);
    
    if (!errors.isEmpty()) {
        const err = new Error('Validation failed');
        err.statusCode = 422;
        err.data = errors.array();
        throw err;
    }

    const { email, password, name } = req.body;

    try {
        const doc= await User.findOne({ email });
        if(doc){
            const err = new Error('Email already exists');
            err.statusCode = 422;
            throw err;
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email,
            password: hashedPassword,
            name
        });

        const result = await user.save();
        res.status(201).json({ message: 'User created', userId: result._id });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error('Validation failed');
        err.statusCode = 422;
        err.data = errors.array();
        throw err;
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 401;
            throw err;
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const err = new Error('Wrong password');
            err.statusCode = 401;
            throw err;
        }
        const expiresIn = '1h';
        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString()
            },
            'your_secret_key',
            { expiresIn: '1h' }
        );
        const expirationTime = new Date().getTime() + 60 * 60 * 1000;
        res.status(200).json({ token, userId: user._id.toString(), expiresIn: expirationTime  });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};