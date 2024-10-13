const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const recipeRoutes = require('./routes/recipe');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./controllers/authAllRoutes');
const userRoutes = require('./routes/user');
const cors=require('cors');
require("dotenv").config();
const app = express();

app.use(cors());

app.use(bodyParser.json()); 

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin",'*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, DELETE, PUT, PATCH');
    res.setHeader('Access-Control-Allow-Headers','*');
    next();
})
app.use('/auth', authRoutes);

app.use('/recipe', authMiddleware,recipeRoutes);
app.use('/user',authMiddleware,userRoutes);
app.use((err,req,res,next)=>{
    const status=err.statusCode||500;
    const message=err.message;
    console.log(message);
    res.status(status).json({message: message});
})
mongoose.connect(process.env.MONGODB_URI).then(result=>{
    app.listen(process.env.PORT || 8080);
    
}).catch(err=>{
    console.log(err);
})
