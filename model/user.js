const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const userSchema=new Schema({
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        default: 0,
    },
})
module.exports=mongoose.model('User',userSchema);